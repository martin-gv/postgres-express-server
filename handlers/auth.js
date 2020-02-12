const bcrypt = require('bcrypt');

const { verifyToken, tokenTypes, errorCreator, tryCatch } = require('../api');
const createUserTokens = require('../helpers/createUserTokens');
const { User } = require('../models');

const { REFRESH } = tokenTypes;

// Login possible with either username and password. Auto-login
// is handled on the front-end by using the refresh endpoint.

async function findByUsernameAndVerify(username) {
  const [user] = await User.find({ username });
  if (!user) throw errorCreator('no user found', 400);
  if (user.active !== true) throw errorCreator('account disabled', 401);

  return user;
}

// Login using username and password
const login = async (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    next({ status: 400, message: 'login credentials missing' });
    return;
  }

  const user = await findByUsernameAndVerify(req.body.username);
  const match = await bcrypt.compare(req.body.password, user.password);

  if (!match) {
    next({ status: 401, message: 'incorrect password' });
    return;
  }

  const [accessToken, refreshToken] = createUserTokens(user);
  res.status(200).json({ accessToken, refreshToken });
};

// Refresh access token by providing refresh token
const refresh = async (req, res, next) => {
  if (!req.body.refreshToken) {
    next({ status: 400, message: 'missing token in request body' });
    return;
  }

  const payload = verifyToken(req.body.refreshToken, REFRESH.type);
  const user = await findByUsernameAndVerify(payload.data.username);

  const [accessToken] = createUserTokens(user); // only first token returned is used
  res.status(200).json({ accessToken });
};

module.exports = {
  login: tryCatch(login),
  refresh: tryCatch(refresh),
};
