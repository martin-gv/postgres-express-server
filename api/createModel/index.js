const methods = require('./methods');
const defaultConfig = require('./defaultConfig');
const { createSQLFormatter, identifier } = require('./formatter');
const isType = require('../../util/isType');

const createPool = require('../db');

let defaultPool;

// Model methods return a promise via db.query(). The methods themselves don't need to be
// async unless they use a query's results before returning them to the handler.

module.exports = function createModel(initConfig) {
  const { collection } = initConfig;

  if (!collection || !isType('string', collection))
    throw Error('invalid model collection name');

  // The default pool is created the first time createPool is called
  // without a custom 'db' parameter. Due to Node module caching, the
  // default pool is reused, if needed, by future calls of createPool.
  if (initConfig.db === undefined && defaultPool === undefined) {
    defaultPool = createPool();
  }

  const db = initConfig.db || defaultPool;

  const config = { ...defaultConfig, ...initConfig };
  const table = identifier(collection);
  const formatter = createSQLFormatter(config);

  const methodConfig = { table, config, formatter, db };

  const configuredMethods = {};
  const keys = Object.keys(methods);

  // eslint-disable-next-line
  for (const key of keys) {
    configuredMethods[key] = methods[key](methodConfig);
  }

  return configuredMethods;
};
