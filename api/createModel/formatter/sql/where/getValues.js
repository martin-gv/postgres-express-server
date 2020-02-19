// Returns values for WHERE conditions as an array, including full-text search
function getValues(query) {
  const values = Object.keys(query)
    .filter((key) => !key.startsWith('$'))
    .map((key) => query[key]);

  if (query.$search) values.push(query.$search);

  return values;
}

module.exports = getValues;
