const typeOf = require('./typeOf');

module.exports = function isType(type, ...inputs) {
  return inputs.every((input) => type === typeOf(input));
};
