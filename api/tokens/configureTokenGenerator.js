const jwt = require('jsonwebtoken');
const tokenTypes = require('./tokenTypes');
const errorCreator = require('../errors/errorCreator');

const secret = process.env.JWT_SECRET_KEY;

function configureTokenGenerator(type) {
  if (!tokenTypes[type]) throw errorCreator('invalid token type', 500);

  // Generates new JWT token
  return function tokenGenerator(data) {
    const payload = { data, type };
    const token = jwt.sign(payload, secret, {
      expiresIn: tokenTypes[type].expiry,
    });

    return token;
  };
}

module.exports = configureTokenGenerator;
