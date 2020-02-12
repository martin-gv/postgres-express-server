const db = require('../../../db');

const create = ({ table, formatter }) => (data) => {
  const [columns, placeholders, values] = formatter.insertSQL(data);
  const sql = `INSERT INTO ${table} ${columns} VALUES ${placeholders} RETURNING *`;
  return db.query(sql, values);
};

module.exports = create;
