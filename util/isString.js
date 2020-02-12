const isType = require('./isType');

module.exports = function isString(input) {
  return isType('string', input);
};
