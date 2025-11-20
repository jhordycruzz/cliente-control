// backend/index.js
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = 'clave-super-secreta'; // en producción usar variable de entorno

app.use(cors({
  origin: '*', // luego lo puedes limitar al dominio del frontend
}));
app.use(express.json());

// ---------- MIDDLEWARE AUTENTICACIÓN ----------
function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization']; // "Bearer token"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Token requerido' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token inválido' });
    req.user = user;
    next();
  });
}

function adminOnly(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Solo un administrador puede hacer esto' });
  }
  next();
}

// ---------- LOGIN ----------
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: 'Usuario y contraseña requeridos' });

  db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user)
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

    const isValid = bcrypt.compareSync(password, user.password_hash);
    if (!isValid)
      return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });

    const userPayload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };

    const token = jwt.sign(userPayload, JWT_SECRET, { expiresIn: '8h' });

    res.json({ token, user: userPayload });
  });
});

// ---------- UTILIDAD CLIENTE + DEUDA ----------
function mapClientRow(row) {
  const debt = row.debt || 0;
  const status = debt > 0 ? 'DEUDOR' : 'AL_DIA';
  return {
    id: row.id,
    dni: row.dni,
    name: row.name,
    email: row.email,
    phone: row.phone,
    address: row.address,
    plan_amount: row.plan_amount,
    contract_date: row.contract_date,
    debt,
    status,
  };
}

// ---------- RUTAS CLIENTES ----------
app.get('/api/clients', authMiddleware, (req, res) => {
  const sql = `
    SELECT c.*,
           IFNULL(SUM(CASE WHEN i.paid = 0 THEN i.amount ELSE 0 END), 0) AS debt
    FROM clients c
    LEFT JOIN invoices i ON i.client_id = c.id
    GROUP BY c.id
    ORDER BY c.id DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error al obtener clientes:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows.map(mapClientRow));
  });
});

app.post('/api/clients', authMiddleware, (req, res) => {
  const { dni, name, email, phone, address, plan_amount, contract_date } = req.body;

  if (!name || !dni) {
    return res.status(400).json({ error: 'DNI y nombre son obligatorios' });
  }

  const sql = `
    INSERT INTO clients (dni, name, email, phone, address, plan_amount, contract_date)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.run(
    sql,
    [dni, name, email, phone, address, plan_amount || 0, contract_date || null],
    function (err) {
      if (err) {
        console.error('Error al insertar cliente:', err.message);
        return res.status(500).json({ error: err.message });
      }

      res.status(201).json({
        id: this.lastID,
        dni,
        name,
        email,
        phone,
        address,
        plan_amount: plan_amount || 0,
        contract_date: contract_date || null,
        debt: 0,
        status: 'AL_DIA',
      });
    }
  );
});

// ---------- RUTAS FACTURAS ----------
app.get('/api/clients/:id/invoices', authMiddleware, (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT * FROM invoices
    WHERE client_id = ?
    ORDER BY date DESC, id DESC
  `;
  db.all(sql, [id], (err, rows) => {
    if (err) {
      console.error('Error al obtener facturas:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

app.post('/api/clients/:id/invoices', authMiddleware, (req, res) => {
  const { id } = req.params;
  const { date, amount } = req.body;

  if (!date || !amount) {
    return res.status(400).json({ error: 'La fecha y el monto son obligatorios' });
  }

  const sql = `
    INSERT INTO invoices (client_id, date, amount, paid)
    VALUES (?, ?, ?, 0)
  `;
  db.run(sql, [id, date, amount], function (err) {
    if (err) {
      console.error('Error al insertar factura:', err.message);
      return res.status(500).json({ error: err.message });
    }
    res.status(201).json({
      id: this.lastID,
      client_id: Number(id),
      date,
      amount,
      paid: 0,
    });
  });
});

app.put('/api/invoices/:id/pay', authMiddleware, (req, res) => {
  const { id } = req.params;
  const sql = `UPDATE invoices SET paid = 1 WHERE id = ?`;
  db.run(sql, [id], function (err) {
    if (err) {
      console.error('Error al pagar factura:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0)
      return res.status(404).json({ error: 'Factura no encontrada' });
    res.json({ message: 'Factura marcada como pagada' });
  });
});

app.delete('/api/invoices/:id', authMiddleware, (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM invoices WHERE id = ?`;
  db.run(sql, [id], function (err) {
    if (err) {
      console.error('Error al eliminar factura:', err.message);
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0)
      return res.status(404).json({ error: 'Factura no encontrada' });
    res.json({ message: 'Factura eliminada' });
  });
});

// ---------- RUTA CREAR USUARIOS (solo admin) ----------
app.post('/api/users', authMiddleware, adminOnly, (req, res) => {
  const { username, password, role } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' });
  }

  const finalRole = role === 'admin' ? 'admin' : 'user';
  const passwordHash = bcrypt.hashSync(password, 10);

  const sql = 'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)';
  db.run(sql, [username, passwordHash, finalRole], function (err) {
    if (err) {
      console.error('Error al crear usuario:', err.message);
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Ese usuario ya existe' });
      }
      return res.status(500).json({ error: err.message });
    }

    res.status(201).json({
      id: this.lastID,
      username,
      role: finalRole,
    });
  });
});

app.listen(PORT, () => {
  console.log(`API escuchando en http://localhost:${PORT}`);
});
