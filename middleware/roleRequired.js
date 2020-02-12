const userRequired = require('./userRequired');

const roleRequired = (roleName) => (req, res, next) => {
  if (res.locals.user.role !== roleName) {
    next({ status: 401, message: `${roleName} role required` });
    return;
  }

  next();
};

module.exports = (roleName) => [userRequired, roleRequired(roleName)];
