// backend/src/routes/clientes.routes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// IMPORTANTE:
// Primero rutas más específicas como /dni/:dni
// y luego las rutas con :id para que no haya conflicto.

// GET /api/clientes/dni/:dni  -> buscar por DNI (para más adelante el portal público)
router.get('/dni/:dni', (req, res) => {
  const { dni } = req.params;

  db.get('SELECT * FROM clientes WHERE dni = ?', [dni], (err, row) => {
    if (err) {
      console.error('Error buscando cliente por DNI:', err.message);
      return res.status(500).json({ error: 'Error al buscar cliente por DNI' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(row);
  });
});

// GET /api/clientes  -> listar todos
router.get('/', (req, res) => {
  db.all('SELECT * FROM clientes ORDER BY creado_en DESC', [], (err, rows) => {
    if (err) {
      console.error('Error listando clientes:', err.message);
      return res.status(500).json({ error: 'Error al obtener clientes' });
    }
    res.json(rows);
  });
});

// GET /api/clientes/:id  -> obtener uno por id
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM clientes WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error obteniendo cliente:', err.message);
      return res.status(500).json({ error: 'Error al obtener cliente' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json(row);
  });
});

// POST /api/clientes  -> crear cliente
router.post('/', (req, res) => {
  const { dni, nombres, apellidos, telefono, email, direccion, estado } = req.body;

  if (!dni || !nombres || !apellidos) {
    return res.status(400).json({
      error: 'DNI, nombres y apellidos son obligatorios',
    });
  }

  const sql = `
    INSERT INTO clientes (dni, nombres, apellidos, telefono, email, direccion, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    dni,
    nombres,
    apellidos,
    telefono || null,
    email || null,
    direccion || null,
    estado || 'ACTIVO',
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Error creando cliente:', err.message);
      if (err.message.includes('UNIQUE')) {
        return res.status(400).json({ error: 'Ya existe un cliente con ese DNI' });
      }
      return res.status(500).json({ error: 'Error al crear cliente' });
    }

    res.status(201).json({
      id: this.lastID,
      dni,
      nombres,
      apellidos,
      telefono,
      email,
      direccion,
      estado: estado || 'ACTIVO',
    });
  });
});

// PUT /api/clientes/:id  -> actualizar cliente
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { dni, nombres, apellidos, telefono, email, direccion, estado } = req.body;

  if (!dni || !nombres || !apellidos) {
    return res.status(400).json({
      error: 'DNI, nombres y apellidos son obligatorios',
    });
  }

  const sql = `
    UPDATE clientes
    SET dni = ?, nombres = ?, apellidos = ?, telefono = ?, email = ?, direccion = ?, estado = ?
    WHERE id = ?
  `;
  const params = [dni, nombres, apellidos, telefono, email, direccion, estado, id];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Error actualizando cliente:', err.message);
      return res.status(500).json({ error: 'Error al actualizar cliente' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json({ mensaje: 'Cliente actualizado' });
  });
});

// DELETE /api/clientes/:id  -> eliminar cliente
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM clientes WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Error eliminando cliente:', err.message);
      return res.status(500).json({ error: 'Error al eliminar cliente' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.json({ mensaje: 'Cliente eliminado' });
  });
});

module.exports = router;
