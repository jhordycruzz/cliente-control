// backend/src/routes/pagos.routes.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/pagos  -> listar todos los pagos
router.get('/', (req, res) => {
  const sql = `
    SELECT
      p.id,
      p.factura_id,
      p.cliente_id,
      cli.dni AS cliente_dni,
      cli.nombres || ' ' || cli.apellidos AS cliente_nombre,
      p.fecha_pago,
      p.monto,
      p.metodo_pago,
      p.referencia,
      p.comprobante_id,
      c.archivo_ruta AS comprobante_ruta,
      c.tipo AS comprobante_tipo,
      p.creado_en
    FROM pagos p
    JOIN clientes cli ON cli.id = p.cliente_id
    LEFT JOIN comprobantes_pago c ON c.id = p.comprobante_id
    ORDER BY p.fecha_pago DESC, p.id DESC
  `;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error listando pagos:', err.message);
      return res.status(500).json({ error: 'Error al obtener pagos' });
    }
    res.json(rows);
  });
});

// GET /api/pagos/cliente/:clienteId  -> pagos de un cliente
router.get('/cliente/:clienteId', (req, res) => {
  const { clienteId } = req.params;
  const sql = `
    SELECT
      p.id,
      p.factura_id,
      p.cliente_id,
      cli.dni AS cliente_dni,
      cli.nombres || ' ' || cli.apellidos AS cliente_nombre,
      p.fecha_pago,
      p.monto,
      p.metodo_pago,
      p.referencia,
      p.comprobante_id,
      c.archivo_ruta AS comprobante_ruta,
      c.tipo AS comprobante_tipo,
      p.creado_en
    FROM pagos p
    JOIN clientes cli ON cli.id = p.cliente_id
    LEFT JOIN comprobantes_pago c ON c.id = p.comprobante_id
    WHERE p.cliente_id = ?
    ORDER BY p.fecha_pago DESC, p.id DESC
  `;
  db.all(sql, [clienteId], (err, rows) => {
    if (err) {
      console.error('Error listando pagos por cliente:', err.message);
      return res.status(500).json({ error: 'Error al obtener pagos del cliente' });
    }
    res.json(rows);
  });
});

// GET /api/pagos/factura/:facturaId  -> pagos de una factura
router.get('/factura/:facturaId', (req, res) => {
  const { facturaId } = req.params;
  const sql = `
    SELECT
      p.id,
      p.factura_id,
      p.cliente_id,
      cli.dni AS cliente_dni,
      cli.nombres || ' ' || cli.apellidos AS cliente_nombre,
      p.fecha_pago,
      p.monto,
      p.metodo_pago,
      p.referencia,
      p.comprobante_id,
      c.archivo_ruta AS comprobante_ruta,
      c.tipo AS comprobante_tipo,
      p.creado_en
    FROM pagos p
    JOIN clientes cli ON cli.id = p.cliente_id
    LEFT JOIN comprobantes_pago c ON c.id = p.comprobante_id
    WHERE p.factura_id = ?
    ORDER BY p.fecha_pago DESC, p.id DESC
  `;
  db.all(sql, [facturaId], (err, rows) => {
    if (err) {
      console.error('Error listando pagos por factura:', err.message);
      return res.status(500).json({ error: 'Error al obtener pagos de la factura' });
    }
    res.json(rows);
  });
});

// GET /api/pagos/:id  -> un pago por id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  const sql = `
    SELECT
      p.id,
      p.factura_id,
      p.cliente_id,
      cli.dni AS cliente_dni,
      cli.nombres || ' ' || cli.apellidos AS cliente_nombre,
      p.fecha_pago,
      p.monto,
      p.metodo_pago,
      p.referencia,
      p.comprobante_id,
      c.archivo_ruta AS comprobante_ruta,
      c.tipo AS comprobante_tipo,
      p.creado_en
    FROM pagos p
    JOIN clientes cli ON cli.id = p.cliente_id
    LEFT JOIN comprobantes_pago c ON c.id = p.comprobante_id
    WHERE p.id = ?
  `;
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error('Error obteniendo pago:', err.message);
      return res.status(500).json({ error: 'Error al obtener pago' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }
    res.json(row);
  });
});

// POST /api/pagos  -> crear pago
router.post('/', (req, res) => {
  const {
    factura_id,
    cliente_id,
    fecha_pago,
    monto,
    metodo_pago,
    referencia,
    comprobante_id,
  } = req.body;

  if (!factura_id || !cliente_id || !fecha_pago || !monto) {
    return res.status(400).json({
      error: 'factura_id, cliente_id, fecha_pago y monto son obligatorios',
    });
  }

  const sql = `
    INSERT INTO pagos
      (factura_id, cliente_id, fecha_pago, monto, metodo_pago, referencia, comprobante_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    factura_id,
    cliente_id,
    fecha_pago,
    monto,
    metodo_pago || null,
    referencia || null,
    comprobante_id || null,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Error creando pago:', err.message);
      return res.status(500).json({ error: 'Error al crear pago' });
    }

    // OPCIONAL: marcar factura como PAGADA si quieres aquí
    // Por ahora solo devolvemos el pago creado.
    res.status(201).json({
      id: this.lastID,
      factura_id,
      cliente_id,
      fecha_pago,
      monto,
      metodo_pago: metodo_pago || null,
      referencia: referencia || null,
      comprobante_id: comprobante_id || null,
    });
  });
});

// PUT /api/pagos/:id  -> actualizar pago
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const {
    factura_id,
    cliente_id,
    fecha_pago,
    monto,
    metodo_pago,
    referencia,
    comprobante_id,
  } = req.body;

  if (!factura_id || !cliente_id || !fecha_pago || !monto) {
    return res.status(400).json({
      error: 'factura_id, cliente_id, fecha_pago y monto son obligatorios',
    });
  }

  const sql = `
    UPDATE pagos
    SET factura_id = ?, cliente_id = ?, fecha_pago = ?, monto = ?,
        metodo_pago = ?, referencia = ?, comprobante_id = ?
    WHERE id = ?
  `;
  const params = [
    factura_id,
    cliente_id,
    fecha_pago,
    monto,
    metodo_pago || null,
    referencia || null,
    comprobante_id || null,
    id,
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Error actualizando pago:', err.message);
      return res.status(500).json({ error: 'Error al actualizar pago' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }
    res.json({ mensaje: 'Pago actualizado' });
  });
});

// DELETE /api/pagos/:id  -> eliminar pago
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM pagos WHERE id = ?', [id], function (err) {
    if (err) {
      console.error('Error eliminando pago:', err.message);
      return res.status(500).json({ error: 'Error al eliminar pago' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Pago no encontrado' });
    }
    res.json({ mensaje: 'Pago eliminado' });
  });
});

module.exports = router;
