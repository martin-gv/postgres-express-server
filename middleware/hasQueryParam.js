function hasQueryParam(param, config = {}) {
  const { nextRoute = false } = config;

  return (req, res, next) => {
    // Query param found, continue with route.
    if (req.query[param]) {
      next();
      return;
    }

    // No param found. If nextRoute option specified skip to the next matching route...
    if (nextRoute === true) {
      next('route');
      return;
    }

    // ...else move to error handler
    next({ status: 400, message: `request requires query param '${param}'` });
  };
}

module.exports = hasQueryParam;
