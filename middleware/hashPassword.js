const bcrypt = require('bcrypt');
const { tryCatch } = require('../api');

const saltRounds = 12;

// No error on undefined password because hashPassword() middleware is
// optional in some routes (e.g. when updating fields other than password)

async function hashPassword(req, res, next) {
  if (req.body.password) {
    req.body.password = await bcrypt.hash(req.body.password, saltRounds);
  }

  next();
}

module.exports = tryCatch(hashPassword);
