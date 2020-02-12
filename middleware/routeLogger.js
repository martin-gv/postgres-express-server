const { log } = console;

function routeLogger(req, res, next) {
  log('%s %s', req.method, req.originalUrl);
  next();
}

module.exports = routeLogger;
