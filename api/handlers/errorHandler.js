// Error handling middleware accepts four arguments, instead of three.

// Express has a built-in error handler for sync code. Aync errors, however,
// must be passed to next() so that Express can handle them.

// next() always calls the next middleware function unless it is
// passed anything (with the exception 'route'), in which case
// Express will skip any non-error handling middleware functions.

// eslint-disable-next-line
module.exports = function errorHandler(err, req, res, next) {
  // delegate to default Express error handler if headers have already been sent
  if (res.headersSent) return next(err);

  // Create error object with default values
  const error = {
    name: err.name || 'Error',
    message: err.message || 'Something went wrong',
    status: err.status || 500,
  };

  res.status(error.status).json({ error });
};
