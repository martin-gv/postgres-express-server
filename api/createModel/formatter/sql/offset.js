const isType = require('../../../../util/isType');

module.exports = (config) =>
  function offsetSQL(query) {
    if (!query.$offset) return `OFFSET ${config.defaultOffset}`;

    if (!isType('number', query.$offset))
      throw Error(`invalid offset value on ${config.collection}`);

    return `OFFSET ${query.$offset}`;
  };
