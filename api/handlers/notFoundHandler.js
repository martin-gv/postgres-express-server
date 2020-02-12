module.exports = function notFoundHandler(req, res, next) {
  next({ status: 404, message: 'invalid endpoint' });
};
