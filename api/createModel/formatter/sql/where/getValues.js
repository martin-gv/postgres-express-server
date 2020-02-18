const keysFilter = require('./keysFilter');

// Returns values for WHERE conditions as an array, including full-text search
function getValues(query) {
  const keys = Object.keys(query).filter(keysFilter);
  const values = keys.map((key) => query[key]);
  return values;
}

module.exports = getValues;
