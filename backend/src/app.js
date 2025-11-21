// backend/src/app.js
const express = require('express');
const jwt = require("jsonwebtoken");
const cors = require('cors');
const path = require('path');
require('./db');
const bcrypt = require("bcrypt");
const db = require("./db");

const DEFAULT_ADMIN_USER = process.env.ADMIN_USER || "admin";
const DEFAULT_ADMIN_PASS = process.env.ADMIN_PASS || "admin123";

db.get(
  "SELECT id FROM usuarios WHERE username = ?",
  [DEFAULT_ADMIN_USER],
  async (err, row) => {
    if (err) {
      console.error("Error al buscar admin por defecto:", err);
      return;
    }
    if (row) {
      console.log("Admin por defecto ya existe");
      return;
    }

    try {
      const hash = await bcrypt.hash(DEFAULT_ADMIN_PASS, 10);
      db.run(
        "INSERT INTO usuarios (username, password_hash, rol) VALUES (?, ?, ?)",
        [DEFAULT_ADMIN_USER, hash, "ADMIN"],
        (err2) => {
          if (err2) {
            console.error("Error al crear admin por defecto:", err2);
          } else {
            console.log(
              `Admin por defecto creado: ${DEFAULT_ADMIN_USER} / ${DEFAULT_ADMIN_PASS}`
            );
          }
        }
      );
    } catch (e) {
      console.error("Error al hashear contraseña de admin:", e);
    }
  }
);

const clientesRoutes = require('./routes/clientes.routes');
const planesRoutes = require('./routes/planes.routes');
const contratosRoutes = require('./routes/contratos.routes');
const facturasRoutes = require('./routes/facturas.routes');
const comprobantesRoutes = require('./routes/comprobantes.routes'); // 👈 NUEVO
const pagosRoutes = require('./routes/pagos.routes'); // (lo crearemos luego)

const app = express();

app.use(cors());
app.use(express.json());

// archivos estáticos (para ver comprobantes en el navegador)
app.use(
  '/uploads',
  express.static(path.join(__dirname, 'uploads')),
);
// === LOGIN ===
app.post("/api/auth/login", (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Usuario y contraseña son obligatorios" });
  }

  db.get(
    "SELECT * FROM usuarios WHERE username = ?",
    [username],
    async (err, user) => {
      if (err) {
        console.error("Error al buscar usuario:", err);
        return res.status(500).json({ error: "Error interno" });
      }
      if (!user) {
        return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
      }

      const match = await bcrypt.compare(password, user.password_hash);
      if (!match) {
        return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
      }

      const payload = {
        id: user.id,
        username: user.username,
        rol: user.rol,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "8h",
      });

      res.json({
        token,
        user: {
          id: user.id,
          username: user.username,
          rol: user.rol,
        },
      });
    }
  );
});
// RUTAS API
app.use('/api/clientes', clientesRoutes);
app.use('/api/planes', planesRoutes);
app.use('/api/contratos', contratosRoutes);
app.use('/api/facturas', facturasRoutes);
app.use('/api/comprobantes', comprobantesRoutes);
app.use('/api/pagos', pagosRoutes); // (lo crearemos luego)

app.get('/', (req, res) => {
  res.json({ mensaje: 'API Cyberlink funcionando' });
});

module.exports = app;
