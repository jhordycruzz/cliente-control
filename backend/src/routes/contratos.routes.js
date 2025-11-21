// backend/src/routes/contratos.routes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper: convertir booleans de sqlite (si hiciera falta) – aquí casi no lo usamos

// GET /api/contratos  -> listar todos (con info básica de cliente y plan)
router.get('/', (req, res) => {
  const sql = `
    SELECT
      c.id,
      c.cliente_id,
      cli.dni AS cliente_dni,
      cli.nombres || ' ' || cli.apellidos AS cliente_nombre,
      c.plan_id,
      p.nombre AS plan_nombre,
      p.velocidad,
      p.precio_mensual,
      c.fecha_alta,
      c.fecha_baja,
      c.estado,
      c.ciclo_facturacion,
      c.metodo_pago,
      c.creado_en
    FROM contratos c
    JOIN clientes cli ON cli.id = c.cliente_id
    JOIN planes p ON p.id = c.plan_id
    ORDER BY c.creado_en DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error listando contratos:', err.message);
      return res.status(500).json({ error: 'Error al obtener contratos' });
    }
    res.json(rows);
  });
});

// GET /api/contratos/:id  -> contrato por id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT
      c.id,
      c.cliente_id,
      cli.dni AS cliente_dni,
      cli.nombres || ' ' || cli.apellidos AS cliente_nombre,
      c.plan_id,
      p.nombre AS plan_nombre,
      p.velocidad,
      p.precio_mensual,
      c.fecha_alta,
      c.fecha_baja,
      c.estado,
      c.ciclo_facturacion,
      c.metodo_pago,
      c.creado_en
    FROM contratos c
    JOIN clientes cli ON cli.id = c.cliente_id
    JOIN planes p ON p.id = c.plan_id
    WHERE c.id = ?
  `;
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error('Error obteniendo contrato:', err.message);
      return res.status(500).json({ error: 'Error al obtener contrato' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Contrato no encontrado' });
    }
    res.json(row);
  });
});

// GET /api/contratos/cliente/:clienteId  -> contratos de un cliente
router.get('/cliente/:clienteId', (req, res) => {
  const { clienteId } = req.params;
  const sql = `
    SELECT
      c.id,
      c.cliente_id,
      cli.dni AS cliente_dni,
      cli.nombres || ' ' || cli.apellidos AS cliente_nombre,
      c.plan_id,
      p.nombre AS plan_nombre,
      p.velocidad,
      p.precio_mensual,
      c.fecha_alta,
      c.fecha_baja,
      c.estado,
      c.ciclo_facturacion,
      c.metodo_pago,
      c.creado_en
    FROM contratos c
    JOIN clientes cli ON cli.id = c.cliente_id
    JOIN planes p ON p.id = c.plan_id
    WHERE c.cliente_id = ?
    ORDER BY c.creado_en DESC
  `;
  db.all(sql, [clienteId], (err, rows) => {
    if (err) {
      console.error('Error listando contratos por cliente:', err.message);
      return res.status(500).json({ error: 'Error al obtener contratos del cliente' });
    }
    res.json(rows);
  });
});

// POST /api/contratos  -> crear contrato
router.post('/', (req, res) => {
  const {
    cliente_id,
    plan_id,
    fecha_alta,
    fecha_baja,
    estado,
    ciclo_facturacion,
    metodo_pago,
  } = req.body;

  if (!cliente_id || !plan_id || !fecha_alta) {
    return res.status(400).json({
      error: 'cliente_id, plan_id y fecha_alta son obligatorios',
    });
  }

  const sql = `
    INSERT INTO contratos
      (cliente_id, plan_id, fecha_alta, fecha_baja, estado, ciclo_facturacion, metodo_pago)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    cliente_id,
    plan_id,
    fecha_alta,
    fecha_baja || null,
    estado || 'PENDIENTE',
    ciclo_facturacion || 'MENSUAL',
    metodo_pago || null,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Error creando contrato:', err.message);
      return res.status(500).json({ error: 'Error al crear contrato' });
    }

    res.status(201).json({
      id: this.lastID,
      cliente_id,
      plan_id,
      fecha_alta,
      fecha_baja: fecha_baja || null,
      estado: estado || 'PENDIENTE',
      ciclo_facturacion: ciclo_facturacion || 'MENSUAL',
      metodo_pago: metodo_pago || null,
    });
  });
});

// PUT /api/contratos/:id  -> actualizar contrato
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    cliente_id,
    plan_id,
    fecha_alta,
    fecha_baja,
    estado,
    ciclo_facturacion,
    metodo_pago,
  } = req.body;

  if (!cliente_id || !plan_id || !fecha_alta) {
    return res.status(400).json({
      error: 'cliente_id, plan_id y fecha_alta son obligatorios',
    });
  }

  const sql = `
    UPDATE contratos
    SET cliente_id = ?, plan_id = ?, fecha_alta = ?, fecha_baja = ?,
        estado = ?, ciclo_facturacion = ?, metodo_pago = ?
    WHERE id = ?
  `;
  const params = [
    cliente_id,
    plan_id,
    fecha_alta,
    fecha_baja || null,
    estado || 'PENDIENTE',
    ciclo_facturacion || 'MENSUAL',
    metodo_pago || null,
    id,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Error actualizando contrato:', err.message);
      return res.status(500).json({ error: 'Error al actualizar contrato' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Contrato no encontrado' });
    }
    res.json({ mensaje: 'Contrato actualizado' });
  });
});

// DELETE /api/contratos/:id  -> eliminar contrato
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM contratos WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Error eliminando contrato:', err.message);
      return res.status(500).json({ error: 'Error al eliminar contrato' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Contrato no encontrado' });
    }
    res.json({ mensaje: 'Contrato eliminado' });
  });
});

module.exports = router;
