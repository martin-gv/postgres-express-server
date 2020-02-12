// Checks a query object for any operators
module.exports = function hasOperator(query) {
  return Object.keys(query).some((key) => {
    return key.startsWith('$');
  });
};
