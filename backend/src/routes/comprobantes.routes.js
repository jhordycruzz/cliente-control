// backend/src/routes/comprobantes.routes.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuración de multer (dónde y cómo guardar archivos)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dest = path.join(__dirname, '../uploads/comprobantes');
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    // reemplazar espacios por guiones
    const originalName = file.originalname.replace(/\s+/g, '-');
    cb(null, `${timestamp}-${originalName}`);
  },
});

const upload = multer({ storage });

// POST /api/comprobantes  -> subir comprobante (imagen, pdf, etc.)
router.post('/', upload.single('archivo'), (req, res) => {
  const { tipo } = req.body; // YAPE, DEPOSITO, TRANSFERENCIA, etc.
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'Se requiere un archivo (campo "archivo")' });
  }

  const archivo_ruta = `/uploads/comprobantes/${file.filename}`; // ruta pública
  const archivo_nombre = file.originalname;

  const sql = `
    INSERT INTO comprobantes_pago (archivo_ruta, archivo_nombre, tipo)
    VALUES (?, ?, ?)
  `;
  const params = [archivo_ruta, archivo_nombre, tipo || null];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Error creando comprobante:', err.message);
      return res.status(500).json({ error: 'Error al guardar comprobante' });
    }

    res.status(201).json({
      id: this.lastID,
      archivo_ruta,
      archivo_nombre,
      tipo: tipo || null,
    });
  });
});

// GET /api/comprobantes  -> listar comprobantes
router.get('/', (req, res) => {
  db.all(
    'SELECT * FROM comprobantes_pago ORDER BY creado_en DESC',
    [],
    (err, rows) => {
      if (err) {
        console.error('Error listando comprobantes:', err.message);
        return res.status(500).json({ error: 'Error al obtener comprobantes' });
      }
      res.json(rows);
    },
  );
});

// GET /api/comprobantes/:id  -> obtener un comprobante
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.get('SELECT * FROM comprobantes_pago WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error obteniendo comprobante:', err.message);
      return res.status(500).json({ error: 'Error al obtener comprobante' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Comprobante no encontrado' });
    }
    res.json(row);
  });
});

// DELETE /api/comprobantes/:id  -> eliminar comprobante (y archivo físico)
router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM comprobantes_pago WHERE id = ?', [id], (err, row) => {
    if (err) {
      console.error('Error obteniendo comprobante:', err.message);
      return res.status(500).json({ error: 'Error al obtener comprobante' });
    }
    if (!row) {
      return res.status(404).json({ error: 'Comprobante no encontrado' });
    }

    const filePath = path.join(__dirname, '..', row.archivo_ruta);

    db.run('DELETE FROM comprobantes_pago WHERE id = ?', [id], function (err2) {
      if (err2) {
        console.error('Error eliminando comprobante:', err2.message);
        return res.status(500).json({ error: 'Error al eliminar comprobante' });
      }

      // intentar borrar archivo físico (sin romper si falla)
      fs.unlink(filePath, (fsErr) => {
        if (fsErr) {
          console.warn('No se pudo borrar archivo físico:', fsErr.message);
        }
      });

      res.json({ mensaje: 'Comprobante eliminado' });
    });
  });
});

module.exports = router;
