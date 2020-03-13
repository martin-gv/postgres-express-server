const { Pool } = require('pg');
const { setupEventLoggers, logCurrentConnections } = require('./logger');

const createPool = (config, options = {}) => {
  // Set up default values for pool options
  const logger = options.logger === undefined ? true : options.logger;

  if (config) {
    // A config is optional. If used it should contain these settings:
    if (
      !config.user ||
      !config.host ||
      !config.database ||
      !config.password ||
      !config.port
    ) {
      throw Error('missing properties in createPool config');
    }
  }

  // The default config uses the pg default env variables:
  // PGHOST, PGUSER, PGDATABASE, PGPASSWORD, and PGPORT
  const defaultConfig = { max: 20 };

  const pool = new Pool(config || defaultConfig);

  if (logger === true) {
    setupEventLoggers(pool);
  }

  // Recommended method
  const query = async (text, values) => {
    if (logger === true) {
      logCurrentConnections(pool);
    }
    const results = await pool.query(text, values);
    if (results.command === 'DELETE') return results.rowCount;
    return results.rows;
  };

  // Unmodified query from pg package
  const pgQuery = (text, values) => {
    return pool.query(text, values);
  };

  return { query, pgQuery };
};

module.exports = createPool;
