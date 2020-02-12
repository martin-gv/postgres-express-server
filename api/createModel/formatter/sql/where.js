const identifier = require('../identifier');
const isEmpty = require('../../../../util/isEmpty');
const isType = require('../../../../util/isType');

const dotNotation = /^[^.\s]+\.[^.\s]+$/; // e.g. note.user_id
const keysFilter = (key) => key === '$search' || !key.startsWith('$'); // only operator allowed is $search

// Array.map callback function
const formatConditions = (mainTable) => (key, i) => {
  const placeholder = `$${i + 1}`;

  const hasTable = dotNotation.test(key);
  if (hasTable) {
    const [table, column] = key.split('.');
    const escTable = identifier(table);
    const escColumn = identifier(column);
    return `${escTable}.${escColumn} = ${placeholder}`;
  }

  // else
  const column = identifier(key);
  return `${mainTable}.${column} = ${placeholder}`;
};

// Returns formatted WHERE SQL statement
function formatSQL({ collection }, query) {
  const mainTable = identifier(collection);

  const conditions = Object.keys(query)
    .filter((key) => !key.startsWith('$'))
    .map(formatConditions(mainTable));

  if (query.$search) conditions.push(`${mainTable}.tsv @@ plainto_tsquery($0)`);

  const where = `WHERE \n${conditions.join(' AND\n')}`;
  return where;
}

// Returns values for WHERE conditions as an array, including full-text search
function getValues(query) {
  const keys = Object.keys(query).filter(keysFilter);
  const values = keys.map((key) => query[key]);
  return values;
}

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
