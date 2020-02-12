module.exports = function errorCreator(message, statusCode) {
  const error = Error(message);
  error.status = statusCode;
  return error;
};
