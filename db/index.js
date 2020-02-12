const { Pool } = require('pg');
const { setupEventLoggers, logCurrentConnections } = require('./logger');

// pg uses these environment variables by default:
// PGHOST, PGUSER, PGDATABASE, PGPASSWORD, and PGPORT

const pool = new Pool({ max: 20 /* default is 10 */ });
setupEventLoggers(pool);

async function query(text, values) {
  logCurrentConnections(pool);
  const results = await pool.query(text, values);
  if (results.command === 'DELETE') return results.rowCount;
  return results.rows;
}

// Default query method from pg
function pgQuery(text, values) {
  return pool.query(text, values);
}

module.exports = { query, pgQuery };
