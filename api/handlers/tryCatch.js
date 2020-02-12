const crypto = require('crypto');
const isFunction = require('../../util/isFunction');

// Handlers need try/catch to pass errors to the error handling middleware function.
// If not they may be caught by the Express handler if sync code, or not at all if
// async code, and possibly crash the server.

// Accepts a handler function for Express and adds error handling, allowing
// async handlers to be written without try/catch. It returns a function that
// is passed to the Express route.

// This function works for both async and sync functions. A similar
// solution using .catch would throw an error on non-async functions.

const signature = crypto.randomBytes(16).toString('hex');

module.exports = function tryCatch(fn) {
  if (!isFunction(fn)) return fn; // input is not a function
  if (fn.signature === signature) return fn; // already wrapped with try/catch

  const wrapped = async (req, res, next) => {
    try {
      // If non-async, await will just return the function itself
      await fn(req, res, next);
    } catch (err) {
      next(err);
    }
  };

  wrapped.signature = signature;

  return wrapped;
};
