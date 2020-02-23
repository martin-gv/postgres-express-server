const { hasOperator } = require('../formatter');
const isEmpty = require('../../../util/isEmpty');

const $delete = ({ table, config, formatter, db }) => (query) => {
  if (isEmpty(query) && !config.DANGER_deleteAll)
    throw Error(`full table delete in ${config.collection} is not permitted`);

  if (hasOperator(query))
    throw Error(`invalid operator in ${config.collection}.delete`);

  const [where, whereValues] = formatter.whereSQL(query);
  const values = [...whereValues];

  const sql = `DELETE FROM ${table} ${where}`;

  return db.query(sql, values); // returns # of records deleted
};

module.exports = $delete;
