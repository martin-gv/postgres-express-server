const identifier = require('../../identifier');
const formatConditions = require('./formatConditions');

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

module.exports = formatSQL;
