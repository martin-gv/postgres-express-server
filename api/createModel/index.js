const methods = require('./methods');
const { createSQLFormatter, identifier } = require('./formatter');
const isType = require('../../util/isType');

// Model methods return a promise via db.query(). The methods themselves don't need to be
// async unless they use a query's results before returning them to the handler.

const defaultConfig = {
  defaultLimit: 10,
  defaultOffset: 0,
};

module.exports = function createModel(initConfig) {
  const { collection } = initConfig;

  if (!collection || !isType('string', collection))
    throw Error('invalid model collection name');

  const config = { ...defaultConfig, ...initConfig };
  const table = identifier(collection);
  const formatter = createSQLFormatter(config);

  const methodConfig = { table, config, formatter };

  const configuredMethods = Object.keys(methods).reduce((acc, key) => {
    acc[key] = methods[key](methodConfig);
    return acc;
  }, {});

  return configuredMethods;
};
