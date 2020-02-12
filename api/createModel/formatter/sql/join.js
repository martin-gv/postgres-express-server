const identifier = require('../identifier');
const isType = require('../../../../util/isType');

// Returns formatted JOIN SQL statement
module.exports = (config) =>
  function joinSQL(query) {
    if (!query.$join) return '';

    const { table, field } = query.$join;

    if (!table || !field || !isType('string', table, field))
      throw Error(`invalid $join object on ${table}`);

    const joinTable = identifier(table);
    const joinField = identifier(field);
    const primaryTable = identifier(config.collection);

    const join = `INNER JOIN ${joinTable} ON ${joinTable}.${joinField} = ${primaryTable}.id`;
    return join;
  };
