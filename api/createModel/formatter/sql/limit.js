const isType = require('../../../../util/isType');

module.exports = (config) =>
  function limitSQL(query) {
    if (!query.$limit) return `LIMIT ${config.defaultLimit}`;

    if (!isType('number', query.$limit))
      throw Error(`invalid limit value on ${config.collection}`);

    return `LIMIT ${query.$limit}`;
  };
