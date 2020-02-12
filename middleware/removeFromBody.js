const isString = require('../util/isString');
const isArray = require('../util/isArray');

// Removes properties from the request body. Useful for blocking updates
// to specific fields without having to remove them in the front-end

// Accepts a string or an array of strings
module.exports = function removeFromBody(input) {
  return (req, res, next) => {
    if (isString(input)) {
      delete req.body[input];
    }

    if (isArray(input)) {
      input.forEach((key) => delete req.body[key]);
    }

    next();
  };
};
