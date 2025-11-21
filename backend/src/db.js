// backend/src/db.js
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = path.join(__dirname, "../data", "database.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Error al conectar con SQLite:", err.message);
  } else {
    console.log("Conectado a SQLite en", dbPath);
  }
});

// Crear tablas necesarias
db.serialize(() => {
  // 1) CLIENTES
  db.run(`
    CREATE TABLE IF NOT EXISTS clientes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dni TEXT UNIQUE NOT NULL,
      nombres TEXT NOT NULL,
      apellidos TEXT NOT NULL,
      telefono TEXT,
      email TEXT,
      direccion TEXT,
      estado TEXT NOT NULL DEFAULT 'ACTIVO', -- PROSPECTO | ACTIVO | SUSPENDIDO | BAJA
      creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2) PLANES
  db.run(`
    CREATE TABLE IF NOT EXISTS planes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,          -- ej: "Plan Hogar 50Mb"
      velocidad TEXT NOT NULL,       -- ej: "50 Mbps"
      precio_mensual REAL NOT NULL,
      tipo TEXT NOT NULL,            -- RESIDENCIAL | EMPRESARIAL
      activo INTEGER NOT NULL DEFAULT 1
    )
  `);

  // 3) CONTRATOS
  db.run(`
    CREATE TABLE IF NOT EXISTS contratos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      cliente_id INTEGER NOT NULL,
      plan_id INTEGER NOT NULL,
      fecha_alta DATE NOT NULL,
      fecha_baja DATE,
      estado TEXT NOT NULL DEFAULT 'PENDIENTE', -- PENDIENTE | ACTIVO | SUSPENDIDO | CANCELADO
      ciclo_facturacion TEXT NOT NULL DEFAULT 'MENSUAL', -- MENSUAL, TRIMESTRAL, etc.
      metodo_pago TEXT,           -- EFECTIVO, TRANSFERENCIA, YAPE, etc.
      creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (cliente_id) REFERENCES clientes(id),
      FOREIGN KEY (plan_id) REFERENCES planes(id)
    )
  `);

  // 4) FACTURAS
  db.run(`
    CREATE TABLE IF NOT EXISTS facturas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contrato_id INTEGER NOT NULL,
      cliente_id INTEGER NOT NULL,
      periodo_desde DATE NOT NULL,
      periodo_hasta DATE NOT NULL,
      fecha_emision DATE NOT NULL,
      fecha_vencimiento DATE NOT NULL,
      monto REAL NOT NULL,
      estado TEXT NOT NULL DEFAULT 'PENDIENTE', -- PENDIENTE | PAGADA | VENCIDA
      creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (contrato_id) REFERENCES contratos(id),
      FOREIGN KEY (cliente_id) REFERENCES clientes(id)
    )
  `);

  // 5) COMPROBANTES DE PAGO
  db.run(`
    CREATE TABLE IF NOT EXISTS comprobantes_pago (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      archivo_ruta TEXT NOT NULL,    -- ruta del archivo en el servidor
      archivo_nombre TEXT,
      tipo TEXT,                     -- YAPE, DEPOSITO, TRANSFERENCIA
      creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 6) PAGOS
  db.run(`
    CREATE TABLE IF NOT EXISTS pagos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      factura_id INTEGER NOT NULL,
      cliente_id INTEGER NOT NULL,
      fecha_pago DATE NOT NULL,
      monto REAL NOT NULL,
      metodo_pago TEXT,              -- EFECTIVO, YAPE, etc.
      referencia TEXT,               -- nro operación, etc.
      comprobante_id INTEGER,        -- FK a comprobantes_pago
      creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (factura_id) REFERENCES facturas(id),
      FOREIGN KEY (cliente_id) REFERENCES clientes(id),
      FOREIGN KEY (comprobante_id) REFERENCES comprobantes_pago(id)
    )
  `);

  // 7) USUARIOS (para login)
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      rol TEXT NOT NULL DEFAULT 'ADMIN'
    )
  `);

  console.log("Tablas creadas/verificadas correctamente");
});

module.exports = db;
