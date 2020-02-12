const { errorTypes } = require('../api');
const objectHasKey = require('../util/objectHasKey');
const userRequired = require('./userRequired');

const { UNAUTHORIZED } = errorTypes;

// Configs array example:
// const restrictions = [{ fields: ['role', 'active'], roleRequired: 'admin' }];

const restrictBodyByRole = (configs) => (req, res, next) => {
  const testResults = configs.every((config) => {
    // Check if request body includes a restricted field
    const isFound = config.fields.some((field) =>
      objectHasKey(req.body, field),
    );

    return isFound ? res.locals.user.role === config.roleRequired : true;
  });

  if (testResults === false) {
    // One or more permissions did not pass
    next(UNAUTHORIZED);
    return;
  }

  next();
};

module.exports = (configs) => [userRequired, restrictBodyByRole(configs)];
