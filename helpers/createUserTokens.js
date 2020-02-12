const { configureTokenGenerator, tokenTypes, errorCreator } = require('../api');

const { ACCESS, REFRESH } = tokenTypes;

const createAccessToken = configureTokenGenerator(ACCESS.type);
const createRefreshToken = configureTokenGenerator(REFRESH.type);

module.exports = function createUserTokens(user) {
  const { id, username, role } = user;

  if (!id || !username || !role)
    throw errorCreator('missing user data for auth token', 500);

  const payload = { id, username, role };

  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);

  return [accessToken, refreshToken];
};
