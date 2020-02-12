const { tryCatch } = require('../api');
const { User } = require('../models');
const createUserTokens = require('../helpers/createUserTokens');
const removeFromBody = require('../middleware/removeFromBody');

// Register new user; tokens returned so user can immediately start using app
async function register(req, res) {
  const [user] = await User.create(req.body);

  const [accessToken, refreshToken] = createUserTokens(user);

  res.status(200).json({ accessToken, refreshToken });
}

module.exports = [removeFromBody('role'), tryCatch(register)];
