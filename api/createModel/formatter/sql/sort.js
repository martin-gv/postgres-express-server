const identifier = require('../identifier');

module.exports = (config) =>
  function sortSQL(query) {
    const table = identifier(config.collection);

    if (!query.$sort) return `ORDER BY ${table}.id DESC`;

    const [[key, value]] = Object.entries(query.$sort);

    const field = identifier(key);

    let direction;
    switch (value) {
      case 1:
        direction = 'ASC';
        break;
      case -1:
        direction = 'DESC';
        break;
      default:
        throw Error(`invalid sort value on ${table}`);
    }

    return `ORDER BY ${table}.${field} ${direction}`;
  };
