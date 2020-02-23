const create = ({ table, formatter, db }) => (data) => {
  const [columns, placeholders, values] = formatter.insertSQL(data);
  const sql = `INSERT INTO ${table} ${columns} VALUES ${placeholders} RETURNING *`;
  return db.query(sql, values);
};

module.exports = create;
