const express = require('express');

const router = express.Router();

const roleRequired = require('../middleware/roleRequired');
const restrictBodyByRole = require('../middleware/restrictBodyByRole');
const hashPassword = require('../middleware/hashPassword');
const restrictUser = require('../middleware/restrictUser');
const hasQueryParam = require('../middleware/hasQueryParam');

const users = require('../handlers/users');

const updateRestrictions = restrictBodyByRole([
  { fields: ['role', 'active'], roleRequired: 'admin' },
]);

router
  .route('/')
  .all(roleRequired('admin')) // only admins may create users, or view all users
  .get(users.get)
  .post(hashPassword, users.post);

router
  .route('/:id')
  .all(restrictUser({ restrictByParam: 'id' }), users.find)
  .get(users.get)
  .put(updateRestrictions, hashPassword, users.put)
  .delete(users.delete);

// User's notes
router.get(
  '/:id/notes',
  hasQueryParam('search', { nextRoute: true }),
  users.searchUserNotes,
);

// Duplicate routes can't be chained together and must each be added
// individually to the router. (e.g. router.get().get() will not work)

router.get('/:id/notes', users.getUserNotes);

// User's tags
router.get('/:id/tags', users.getUserTags);

module.exports = router;
