const db = require('../../../db');
const { hasOperator, params } = require('../formatter');
const isEmpty = require('../../../util/isEmpty');

const update = ({ table, config, formatter }) => (query, data) => {
  if (isEmpty(query) && !config.DANGER_updateAll)
    throw Error(`full table update in ${config.collection} is not permitted`);

  if (hasOperator(query))
    throw Error(`invalid operator in ${config.collection}.update`);

  const [assignment, assignmentValues] = formatter.assignmentSQL(data); // data object
  const [where, whereValues] = formatter.whereSQL(query); // query object
  const values = [...assignmentValues, ...whereValues];

  let sql = `UPDATE ${table} \n SET ${assignment} \n ${where} \n RETURNING *`;
  sql = params(sql);

  return db.query(sql, values);
};

module.exports = update;
