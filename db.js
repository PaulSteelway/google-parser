const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('test.sqlite'); // Используйте ':memory:' для временной базы данных, замените на путь к файлу для постоянной базы данных
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS countries (
      id INTEGER PRIMARY KEY,
      name TEXT,
      keywords JSON,
      stop_words JSON,
      logs JSON
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS accounts (
      id INTEGER PRIMARY KEY,
      username TEXT,
      password TEXT,
      proxy_host TEXT,
      proxy_port INTEGER,
      proxy_username TEXT,
      proxy_password TEXT,
      auth_status BOOLEAN,
      logs JSON,
      session JSON,
      country_id INTEGER,
      FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE
    )
  `);
}); 
module.exports = db;
  