const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
  // ⚠️ SOLO PARA DESARROLLO: siempre borrar la tabla clients y volver a crearla
  db.run(`DROP TABLE IF EXISTS clients`);

  db.run(`
    CREATE TABLE IF NOT EXISTS clients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      dni TEXT,
      name TEXT NOT NULL,
      phone TEXT,
      email TEXT,
      address TEXT,
      plan_amount REAL,
      contract_date TEXT
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS invoices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id INTEGER NOT NULL,
      date TEXT NOT NULL,
      amount REAL NOT NULL,
      paid INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (client_id) REFERENCES clients(id)
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL
    )
  `);

  const adminUsername = 'admin';
  const adminPassword = 'admin123';

  db.get(
    'SELECT * FROM users WHERE username = ?',
    [adminUsername],
    (err, row) => {
      if (err) {
        console.error('Error verificando admin:', err.message);
        return;
      }
      if (!row) {
        const passwordHash = bcrypt.hashSync(adminPassword, 10);
        db.run(
          'INSERT INTO users (username, password_hash, role) VALUES (?, ?, ?)',
          [adminUsername, passwordHash, 'admin'],
          (err2) => {
            if (err2) {
              console.error('Error creando admin:', err2.message);
            } else {
              console.log('Usuario admin creado (admin / admin123)');
            }
          }
        );
      }
    }
  );
});

module.exports = db;
