const jwt = require('jsonwebtoken');
const tokenTypes = require('./tokenTypes');
const errorCreator = require('../errors/errorCreator');

const secret = process.env.JWT_SECRET_KEY;

// Checks if JWT token is valid and, optionally, of correct type
function verifyToken(token, type) {
  let decodedPayload;

  try {
    decodedPayload = jwt.verify(token, secret); // throws error if token is not valid or missing
  } catch (err) {
    err.status = 401;
    throw err;
  }

  if (type && decodedPayload.type !== tokenTypes[type].type) {
    throw errorCreator(`wrong token type. ${type} token required`, 400);
  }

  return decodedPayload;
}

module.exports = verifyToken;
