const identifier = require('../../identifier');

const dotNotation = /^[^.\s]+\.[^.\s]+$/; // e.g for matching note.user_id

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

module.exports = formatConditions;
