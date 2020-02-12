const typeOf = require('./typeOf');

// Checks if a string, array, or object is empty.
// Null and undefined are considered empty.
module.exports = function isEmpty(input) {
  if (input === null || input === undefined) return true;

  const type = typeOf(input);
  if (type === 'string' || type === 'array') return input.length === 0;
  if (type === 'object') return Object.keys(input).length === 0;

  return false; // Everything else
};
