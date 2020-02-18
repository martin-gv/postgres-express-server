const keysFilter = require('./where/keysFilter');
const getValues = require('./where/getValues');
const formatSQL = require('./where/formatSQL');

const isEmpty = require('../../../../util/isEmpty');
const isType = require('../../../../util/isType');

module.exports = (config) =>
  function whereSQL(query) {
    const keys = Object.keys(query).filter(keysFilter);
    if (isEmpty(keys)) return ['', []];

    if (query.$search && !isType('string', query.$search))
      throw Error(`invalid $search value on ${config.collection}`);

    const sql = formatSQL(config, query);
    const values = getValues(query);

    return [sql, values];
  };
