const isType = require('./isType');

module.exports = function isObject(input) {
  return isType('object', input);
};
