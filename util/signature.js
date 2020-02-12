const isType = require('./isType');

module.exports = function signature(types, fn) {
  return (...args) => {
    // check args according to types
    args.forEach((arg, i) => {
      if (!isType(types[i], arg)) {
        throw Error(
          `Argument ${i + 1} must be of type ${types[i]} in ${fn.name}`,
        );
      }
    });

    return fn(...args);
  };
};
