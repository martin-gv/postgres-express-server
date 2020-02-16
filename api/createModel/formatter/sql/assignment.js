const identifier = require('../identifier');
const isEmpty = require('../../../../util/isEmpty');

// Returns formatted assignments SQL for SET statement
function formatSQL(data) {
  const keys = Object.keys(data);

  const assignments = keys.map((key, index) => {
    const column = identifier(key);
    const placeholder = `$${index + 1}`;
    return `${column} = ${placeholder}`;
  });

  return assignments.join(', ');
}

// Returns values for SET assignments
function getValues(data) {
  // Object.values not used to be consistent with formatSQL()
  const keys = Object.keys(data);
  const values = keys.map((key) => data[key]);
  return values;
}

module.exports = function assignmentSQL(data) {
  if (isEmpty(data)) throw Error('empty data object in assignment');

  const sql = formatSQL(data);
  const values = getValues(data);

  return [sql, values];
};
