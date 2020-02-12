const isType = require('./isType');

module.exports = function isFunction(input) {
  if (isType('function', input) || isType('asyncfunction', input)) return true;

  return false;
};
