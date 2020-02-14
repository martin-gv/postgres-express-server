const signature = require('../../../util/signature');

const insertSQL = require('./sql/insert');
const whereSQL = require('./sql/where');
const assignmentSQL = require('./sql/assignment');
const joinSQL = require('./sql/join');
const sortSQL = require('./sql/sort');
const limitSQL = require('./sql/limit');
const offsetSQL = require('./sql/offset');

module.exports = function createSQLFormatter(config) {
  const methods = {
    insertSQL,
    whereSQL: whereSQL(config),
    assignmentSQL,
    joinSQL: joinSQL(config),
    sortSQL: sortSQL(config),
    limitSQL: limitSQL(config),
    offsetSQL: offsetSQL(config),
  };

  /* Type checking is required for these methods because they accept external input, and because
     they have unexpected results with wrong types (e.g. a number resuts in a default insert) */

  const withSignature = {};
  const keys = Object.keys(methods);

  // eslint-disable-next-line
  for (const key of keys) {
    withSignature[key] = signature(['object'], methods[key]);
  }

  return withSignature;
};
