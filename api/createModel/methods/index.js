const create = require('./create');
const find = require('./find');
const findById = require('./findById');
const update = require('./update');
const updateById = require('./updateById');
const $delete = require('./delete');
const deleteById = require('./deleteById');

module.exports = {
  create,
  find,
  findById,
  update,
  updateById,
  delete: $delete,
  deleteById,
};
