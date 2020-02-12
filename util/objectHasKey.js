module.exports = function objectHasKey(object, key) {
  return Object.prototype.hasOwnProperty.call(object, key);
};
