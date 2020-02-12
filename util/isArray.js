const isType = require('./isType');

module.exports = function isArray(input) {
  return isType('array', input);
};
