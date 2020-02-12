const signature = require('../../../util/signature');

// Escapes SQL identifier (e.g. column, table name, etc.)
function identifier(identifierName) {
  return `"${identifierName.replace(/"/g, '""')}"`;
}

module.exports = signature(['string'], identifier);
