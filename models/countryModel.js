const sqlite3 = require('sqlite3');
const db = require('../db');

const getAllCountries = (callback) => {
  const query = 'SELECT * FROM countries';
  db.all(query, (err, rows) => {
    if (err) {
      console.error('Error fetching countries:', err.message);
      callback([]);
    } else {
      callback(rows);
    }
  });
};

const getCountryById = (id, callback) => {
  const query = 'SELECT * FROM countries WHERE id = ?';
  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Error fetching country:', err.message);
      callback(null);
    } else {
      callback(row);
    }
  });
};

const addCountry = (country, callback) => {
  const query = `
    INSERT INTO countries (name, keywords, stop_words, keysearches, logs) VALUES (?, ?, ?, ?)
  `;

  const values = [country.name, country.keywords, country.stop_words, country.keysearches, country.logs];

  db.run(query, values, function (err) {
    if (err) {
      console.error('Error adding country:', err.message);
      callback(null);
    } else {
      callback({ id: this.lastID });
    }
  });
};

const updateCountry = (id, updatedFields, callback) => {
  const query = `
    UPDATE countries
    SET
      name = COALESCE(?, name),
      keywords = COALESCE(?, keywords),
      stop_words = COALESCE(?, stop_words),
      logs = COALESCE(?, logs),
      keysearches = COALESCE(?, keysearches)
    WHERE id = ?
  `;

  const values = [
    updatedFields.name,
    updatedFields.keywords,
    updatedFields.stop_words,
    updatedFields.logs,
    updatedFields.keysearches,
    id,
  ];
  // console.log(values)
  db.run(query, values, function (err) {
    if (err) {
      console.error('Error updating country:', err.message);
      callback(false);
    } else {
      callback(this.changes > 0);
    }
  });
};

const deleteCountry = (id, callback) => {
  const query = 'DELETE FROM countries WHERE id = ?';
  db.run(query, [id], function (err) {
    if (err) {
      console.error('Error deleting country:', err.message);
      callback(false);
    } else {
      callback(this.changes > 0);
    }
  });
};

module.exports = {
  getAllCountries,
  getCountryById,
  addCountry,
  updateCountry,
  deleteCountry,
};
