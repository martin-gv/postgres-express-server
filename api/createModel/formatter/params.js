const signature = require('../../../util/signature');

// Takes an SQL string with $1 style placeholders, and
// re-numbers them to create a valid sequence starting at 1
function params(sql) {
  const regex = /\$\d+/g;
  let num = 0;
  return sql.replace(regex, () => {
    num += 1;
    return `$${num}`;
  });
}

module.exports = signature(['string'], params);
