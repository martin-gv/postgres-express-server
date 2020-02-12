const { verifyToken, tokenTypes, errorCreator, tryCatch } = require('../api');

const { ACCESS } = tokenTypes;

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    next(errorCreator('authorization header missing', 400));
    return;
  }

  // Headers only carry string data
  if (!authHeader.startsWith('Bearer')) {
    next(errorCreator('bearer authorization required', 400));
    return;
  }

  const token = authHeader.substring(7, authHeader.length);
  const decodedPayload = verifyToken(token, ACCESS.type); // throws error for invalid jwt tokens

  res.locals.user = decodedPayload.data;

  next();
}

module.exports = tryCatch(authenticate);
