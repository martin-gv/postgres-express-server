const { params } = require('../formatter/');

const find = ({ table, formatter, db }) => (query) => {
  const [where, values] = formatter.whereSQL(query);
  const join = formatter.joinSQL(query);
  const sort = formatter.sortSQL(query);
  const limit = formatter.limitSQL(query);
  const skip = formatter.offsetSQL(query);

  let sql = `SELECT * FROM ${table} \n ${join} \n ${where} \n ${sort} \n ${limit} \n ${skip}`;
  sql = params(sql);

  return db.query(sql, values);
};

module.exports = find;
