const $delete = require('./delete');

const deleteById = (config) => (id) => $delete(config)({ id });

module.exports = deleteById;
