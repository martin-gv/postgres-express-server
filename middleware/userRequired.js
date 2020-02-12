module.exports = function userRequired(req, res, next) {
  if (!res.locals.user) {
    next({ status: 401, message: 'login required' });
    return;
  }

  next();
};
