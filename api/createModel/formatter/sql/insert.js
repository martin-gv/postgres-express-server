const identifier = require('../identifier');

module.exports = function insertSQL(data) {
  const keys = Object.keys(data);

  const columns = keys.length
    ? `(${keys.map((key) => identifier(key)).join()})`
    : '';

  const placeholders = keys.length
    ? `(${keys.map((key, index) => `$${index + 1}`).join()})`
    : '(DEFAULT)';

  const values = keys.map((key) => data[key]);

  return [columns, placeholders, values];
};
