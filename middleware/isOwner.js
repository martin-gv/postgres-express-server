const { errorTypes } = require('../api');
const userRequired = require('./userRequired');

const { UNAUTHORIZED } = errorTypes;

function isOwner(req, res, next) {
  const { user, documents } = res.locals;

  // For new documents
  if (req.body.user_id) {
    if (user.id !== req.body.user_id) {
      next(UNAUTHORIZED);
      return;
    }
  }

  // For retrieved documents
  if (documents && documents.length > 0) {
    if (user.id !== documents[0].user_id) {
      next(UNAUTHORIZED);
      return;
    }
  }

  next();
}

module.exports = [userRequired, isOwner];
