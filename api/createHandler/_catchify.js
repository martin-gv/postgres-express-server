// This function adds error handling to Express async handlers
// by using the .catch method of the returned promise. It will
// not work for sync functions.

// The tryCatch helper function is able to handle both sync and async handlers.

module.exports = function catchify(fn) {
    return (req, res, next) => {
      // fn must be an async function. Async functions return promises. The
      // then method is handled inside the handler (fn) with next()
      fn(req, res, next).catch(next);
  
      // The catch method runs the function passed with the error
      // as the first argument, in this case next(err). Catch will run
      // on any rejected promises (e.g. from await) or on thrown errors.
    };
  };
  