const isFunction = require('./isFunction');
const isObject = require('./isObject');

// Wraps methods of provided object in wrapper function
module.exports = function wrap(object, wrapperFn) {
  if (!isObject(object)) throw Error('object required for argument 1');
  if (!isFunction(wrapperFn)) throw Error('function required for argument 2');

  const wrapped = {};
  const entries = Object.entries(object);

  // eslint-disable-next-line
  for (const [key, value] of entries) {
    wrapped[key] = isFunction(value) ? wrapperFn(value) : value;
  }

  return wrapped;
};
