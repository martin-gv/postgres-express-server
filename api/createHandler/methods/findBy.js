const signature = require('../../../util/signature');
const tryCatch = require('../../handlers/tryCatch');

// Accepts a route param string to use for an id lookup, and
// saves the results in res.locals

module.exports = function findBy({ model }) {
  return signature(['string'], (paramName) => {
    return tryCatch(async (req, res, next) => {
      const results = await model.findById(req.params[paramName]);
      res.locals.documents = results;
      next();
    });
  });
};
