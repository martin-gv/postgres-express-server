// Returns lower case string of type (e.g. 'string', 'object', 'array', etc.)
module.exports = function typeOf(input) {
  const string = Object.prototype.toString.call(input);
  const type = string.slice(8, -1);
  return type.toLowerCase();
};
