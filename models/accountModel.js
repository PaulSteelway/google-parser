const sqlite3 = require('sqlite3');
const db = require('../db');


const getAllAccounts = (callback) => {
  const query = 'SELECT * FROM accounts';
  db.all(query, (err, rows) => {
    if (err) {
      console.error('Error fetching accounts:', err.message);
      callback([]);
    } else {
      callback(rows);
    }
  });
};

const getAccountById = (id, callback) => {
  const query = 'SELECT * FROM accounts WHERE id = ?';
  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Error fetching account:', err.message);
      callback(null);
    } else {
      callback(row);
    }
  });
};
const getCountryAccountById = (id, callback) => {
  const query = `
    SELECT accounts.*, countries.name AS country_name, countries.keywords, countries.stop_words
    FROM accounts
    LEFT JOIN countries ON accounts.country_id = countries.id
    WHERE accounts.id = ?;
  `;

  db.get(query, [id], (err, row) => {
    if (err) {
      console.error('Error fetching account:', err.message);
      callback(null);
    } else {
      callback(row);
    }
  });
};

const addAccount = (account, callback) => {
  const query = `
    INSERT INTO accounts (
      username, password, proxy_host, proxy_port, proxy_username, proxy_password, auth_status, logs, country_id
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    account.username,
    account.password,
    account.proxy_host,
    account.proxy_port,
    account.proxy_username,
    account.proxy_password,
    account.auth_status,
    account.logs,
    account.country_id,
  ];

  db.run(query, values, function (err) {
    if (err) {
      console.error('Error adding account:', err.message);
      callback(null);
    } else {
      callback({ id: this.lastID });
    }
  });
};


const updateAccount = (id, updatedFields, callback) => {
  const query = `
    UPDATE accounts
    SET
      username = COALESCE(?, username),
      password = COALESCE(?, password),
      proxy_host = COALESCE(?, proxy_host),
      proxy_port = COALESCE(?, proxy_port),
      proxy_username = COALESCE(?, proxy_username),
      proxy_password = COALESCE(?, proxy_password),
      auth_status = COALESCE(?, auth_status),
      logs = COALESCE(?, logs),
      country_id = COALESCE(?, country_id)
    WHERE id = ?
  `;

  const values = [
    updatedFields.username,
    updatedFields.password,
    updatedFields.proxy_host,
    updatedFields.proxy_port,
    updatedFields.proxy_username,
    updatedFields.proxy_password,
    updatedFields.auth_status,
    updatedFields.logs,
    updatedFields.country_id,
    id,
  ];

  db.run(query, values, function (err) {
    if (err) {
      console.error('Error updating account:', err.message);
      callback(false);
    } else {
      callback(this.changes > 0);
    }
  });
};

const deleteAccount = (id, callback) => {
  const query = 'DELETE FROM accounts WHERE id = ?';
  db.run(query, [id], function (err) {
    if (err) {
      console.error('Error deleting account:', err.message);
      callback(false);
    } else {
      callback(this.changes > 0);
    }
  });
};
const updateSession = async (id, updatedSession) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE accounts SET session = COALESCE(?, session) WHERE id = ?';
    const values = [JSON.stringify(updatedSession), id];

    db.run(query, values, function (err) {
      if (err) {
        console.error('Error updating session:', err.message);
        reject(false);
      } else {
        resolve(this.changes > 0);
      }
    });
  });
};

const updateAuthStatus = async (id, updatedAuthStatus) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE accounts SET auth_status = COALESCE(?, auth_status) WHERE id = ?';
    const values = [updatedAuthStatus, id];
    db.run(query, values, function (err) {
      if (err) {
        console.error('Error updating auth status:', err.message);
        reject(false);
      } else {
        resolve(this.changes > 0);
      }
    });
  });
};

const updateLogs = async (id, updatedLogs) => {
  return new Promise((resolve, reject) => {
    const query = 'UPDATE accounts SET logs = COALESCE(?, logs) WHERE id = ?';
    const values = [JSON.stringify(updatedLogs), id];

    db.run(query, values, function (err) {
      if (err) {
        console.error('Error updating logs:', err.message);
        reject(false);
      } else {
        resolve(this.changes > 0);
      }
    });
  });
};
module.exports = {
  getAllAccounts,
  getCountryAccountById,
  getAccountById,
  addAccount,
  updateAccount,
  deleteAccount,
  updateSession,
  updateAuthStatus,
  updateLogs
};
