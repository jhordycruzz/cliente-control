// backend/src/app.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('./db');

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
