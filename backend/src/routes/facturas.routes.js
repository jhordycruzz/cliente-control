// backend/src/routes/facturas.routes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

/**
 * IMPORTANTE: orden de rutas
 * Primero las que tienen '/cliente/...' o '/contrato/...'
 * y al final la que tiene '/:id' para que no haya conflictos.
 */

// GET /api/facturas  -> listar todas (con datos básicos del cliente)
router.get('/', (req, res) => {
  const sql = `
    SELECT
      f.id,
      f.contrato_id,
      f.cliente_id,
      cli.dni AS cliente_dni,
      cli.nombres || ' ' || cli.apellidos AS cliente_nombre,
      f.periodo_desde,
      f.periodo_hasta,
      f.fecha_emision,
      f.fecha_vencimiento,
      f.monto,
      f.estado,
      f.creado_en
    FROM facturas f
    JOIN clientes cli ON cli.id = f.cliente_id
    ORDER BY f.fecha_emision DESC, f.id DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error listando facturas:', err.message);
      return res.status(500).json({ error: 'Error al obtener facturas' });
    }
    res.json(rows);
  });
});

// GET /api/facturas/cliente/:clienteId  -> facturas de un cliente
router.get('/cliente/:clienteId', (req, res) => {
  const { clienteId } = req.params;
  const sql = `
    SELECT
      f.id,
      f.contrato_id,
      f.cliente_id,
      cli.dni AS cliente_dni,
      cli.nombres || ' ' || cli.apellidos AS cliente_nombre,
      f.periodo_desde,
      f.periodo_hasta,
      f.fecha_emision,
      f.fecha_vencimiento,
      f.monto,
      f.estado,
      f.creado_en
    FROM facturas f
    JOIN clientes cli ON cli.id = f.cliente_id
    WHERE f.cliente_id = ?
    ORDER BY f.fecha_emision DESC, f.id DESC
  `;
  db.all(sql, [clienteId], (err, rows) => {
    if (err) {
      console.error('Error listando facturas por cliente:', err.message);
      return res.status(500).json({ error: 'Error al obtener facturas del cliente' });
    }
    res.json(rows);
  });
});

// GET /api/facturas/contrato/:contratoId  -> facturas de un contrato
router.get('/contrato/:contratoId', (req, res) => {
  const { contratoId } = req.params;
  const sql = `
    SELECT
      f.id,
      f.contrato_id,
      f.cliente_id,
      cli.dni AS cliente_dni,
      cli.nombres || ' ' || cli.apellidos AS cliente_nombre,
      f.periodo_desde,
      f.periodo_hasta,
      f.fecha_emision,
      f.fecha_vencimiento,
      f.monto,
      f.estado,
      f.creado_en
    FROM facturas f
    JOIN clientes cli ON cli.id = f.cliente_id
    WHERE f.contrato_id = ?
    ORDER BY f.fecha_emision DESC, f.id DESC
  `;
  db.all(sql, [contratoId], (err, rows) => {
    if (err) {
      console.error('Error listando facturas por contrato:', err.message);
      return res.status(500).json({ error: 'Error al obtener facturas del contrato' });
    }
    res.json(rows);
  });
});

// GET /api/facturas/:id  -> una factura por id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT
      f.id,
      f.contrato_id,
      f.cliente_id,
      cli.dni AS cliente_dni,
      cli.nombres || ' ' || cli.apellidos AS cliente_nombre,
      f.periodo_desde,
      f.periodo_hasta,
      f.fecha_emision,
      f.fecha_vencimiento,
      f.monto,
      f.estado,
      f.creado_en
    FROM facturas f
    JOIN clientes cli ON cli.id = f.cliente_id
    WHERE f.id = ?
  `;
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error('Error obteniendo factura:', err.message);
      return res.status(500).json({ error: 'Error al obtener factura' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }
    res.json(row);
  });
});

// POST /api/facturas  -> crear factura
router.post('/', (req, res) => {
  const {
    contrato_id,
    cliente_id,
    periodo_desde,
    periodo_hasta,
    fecha_emision,
    fecha_vencimiento,
    monto,
    estado,
  } = req.body;

  if (
    !contrato_id ||
    !cliente_id ||
    !periodo_desde ||
    !periodo_hasta ||
    !fecha_emision ||
    !fecha_vencimiento ||
    !monto
  ) {
    return res.status(400).json({
      error:
        'contrato_id, cliente_id, periodo_desde, periodo_hasta, fecha_emision, fecha_vencimiento y monto son obligatorios',
    });
  }

  const sql = `
    INSERT INTO facturas
      (contrato_id, cliente_id, periodo_desde, periodo_hasta, fecha_emision, fecha_vencimiento, monto, estado)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    contrato_id,
    cliente_id,
    periodo_desde,
    periodo_hasta,
    fecha_emision,
    fecha_vencimiento,
    monto,
    estado || 'PENDIENTE',
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Error creando factura:', err.message);
      return res.status(500).json({ error: 'Error al crear factura' });
    }

    res.status(201).json({
      id: this.lastID,
      contrato_id,
      cliente_id,
      periodo_desde,
      periodo_hasta,
      fecha_emision,
      fecha_vencimiento,
      monto,
      estado: estado || 'PENDIENTE',
    });
  });
});

// PUT /api/facturas/:id  -> actualizar factura completa
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    contrato_id,
    cliente_id,
    periodo_desde,
    periodo_hasta,
    fecha_emision,
    fecha_vencimiento,
    monto,
    estado,
  } = req.body;

  if (
    !contrato_id ||
    !cliente_id ||
    !periodo_desde ||
    !periodo_hasta ||
    !fecha_emision ||
    !fecha_vencimiento ||
    !monto
  ) {
    return res.status(400).json({
      error:
        'contrato_id, cliente_id, periodo_desde, periodo_hasta, fecha_emision, fecha_vencimiento y monto son obligatorios',
    });
  }

  const sql = `
    UPDATE facturas
    SET contrato_id = ?, cliente_id = ?, periodo_desde = ?, periodo_hasta = ?,
        fecha_emision = ?, fecha_vencimiento = ?, monto = ?, estado = ?
    WHERE id = ?
  `;
  const params = [
    contrato_id,
    cliente_id,
    periodo_desde,
    periodo_hasta,
    fecha_emision,
    fecha_vencimiento,
    monto,
    estado || 'PENDIENTE',
    id,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Error actualizando factura:', err.message);
      return res.status(500).json({ error: 'Error al actualizar factura' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }
    res.json({ mensaje: 'Factura actualizada' });
  });
});

// PATCH /api/facturas/:id/estado  -> cambiar solo el estado (PENDIENTE/PAGADA/VENCIDA)
router.patch('/:id/estado', (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!estado) {
    return res.status(400).json({ error: 'Estado es obligatorio' });
  }

  const sql = `UPDATE facturas SET estado = ? WHERE id = ?`;
  db.run(sql, [estado, id], function (err) {
    if (err) {
      console.error('Error cambiando estado de factura:', err.message);
      return res.status(500).json({ error: 'Error al cambiar estado de factura' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }
    res.json({ mensaje: 'Estado de factura actualizado' });
  });
});

// DELETE /api/facturas/:id  -> eliminar factura
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM facturas WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Error eliminando factura:', err.message);
      return res.status(500).json({ error: 'Error al eliminar factura' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Factura no encontrada' });
    }
    res.json({ mensaje: 'Factura eliminada' });
  });
});

module.exports = router;
