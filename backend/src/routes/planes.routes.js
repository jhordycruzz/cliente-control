// backend/src/routes/planes.routes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/planes  -> listar todos los planes
router.get('/', (req, res) => {
  db.all('SELECT * FROM planes ORDER BY id DESC', [], (err, rows) => {
    if (err) {
      console.error('Error listando planes:', err.message);
      return res.status(500).json({ error: 'Error al obtener planes' });
    }
    res.json(rows);
  });
});

// GET /api/planes/:id  -> obtener un plan por id
router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM planes WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error obteniendo plan:', err.message);
      return res.status(500).json({ error: 'Error al obtener plan' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Plan no encontrado' });
    }
    res.json(row);
  });
});

// POST /api/planes  -> crear plan
router.post('/', (req, res) => {
  const { nombre, velocidad, precio_mensual, tipo, activo } = req.body;

  if (!nombre || !velocidad || !precio_mensual || !tipo) {
    return res.status(400).json({
      error: 'Nombre, velocidad, precio_mensual y tipo son obligatorios',
    });
  }

  const sql = `
    INSERT INTO planes (nombre, velocidad, precio_mensual, tipo, activo)
    VALUES (?, ?, ?, ?, ?)
  `;
  const params = [
    nombre,
    velocidad,
    precio_mensual,
    tipo,
    activo !== undefined ? (activo ? 1 : 0) : 1,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Error creando plan:', err.message);
      return res.status(500).json({ error: 'Error al crear plan' });
    }

    res.status(201).json({
      id: this.lastID,
      nombre,
      velocidad,
      precio_mensual,
      tipo,
      activo: activo !== undefined ? !!activo : true,
    });
  });
});

// PUT /api/planes/:id  -> actualizar plan
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre, velocidad, precio_mensual, tipo, activo } = req.body;

  if (!nombre || !velocidad || !precio_mensual || !tipo) {
    return res.status(400).json({
      error: 'Nombre, velocidad, precio_mensual y tipo son obligatorios',
    });
  }

  const sql = `
    UPDATE planes
    SET nombre = ?, velocidad = ?, precio_mensual = ?, tipo = ?, activo = ?
    WHERE id = ?
  `;
  const params = [
    nombre,
    velocidad,
    precio_mensual,
    tipo,
    activo ? 1 : 0,
    id,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Error actualizando plan:', err.message);
      return res.status(500).json({ error: 'Error al actualizar plan' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Plan no encontrado' });
    }
    res.json({ mensaje: 'Plan actualizado' });
  });
});

// DELETE /api/planes/:id  -> eliminar plan
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM planes WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Error eliminando plan:', err.message);
      return res.status(500).json({ error: 'Error al eliminar plan' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Plan no encontrado' });
    }
    res.json({ mensaje: 'Plan eliminado' });
  });
});

module.exports = router;
