const update = require('./update');

const updateById = (config) => (id, data) => update(config)({ id }, data);

module.exports = updateById;
