const find = require('./find');

const findById = (config) => (id) => find(config)({ id });

module.exports = findById;
