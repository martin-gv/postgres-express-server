const { errorTypes } = require('../api');
const userRequired = require('./userRequired');

const { UNAUTHORIZED } = errorTypes;

const restrictUser = ({ restrictByParam }) => (req, res, next) => {
  const userId = res.locals.user.id.toString();
  const paramValue = req.params[restrictByParam]; // route params are strings

  if (userId !== paramValue) {
    next(UNAUTHORIZED);
    return;
  }

  next();
};

module.exports = (config) => [userRequired, restrictUser(config)];
