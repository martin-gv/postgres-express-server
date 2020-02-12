const express = require('express');

const router = express.Router();

const roleRequired = require('../middleware/roleRequired');
const isOwner = require('../middleware/isOwner');

const tags = require('../handlers/tags');
const users = require('../handlers/users');

router
  .route('/')
  .get(roleRequired('admin'), tags.get)
  .post(isOwner, tags.post);

router
  .route('/:id')
  .all(tags.find, isOwner)
  .get(tags.get)
  .put(tags.put)
  .delete(tags.delete);

// Get notes tagged with a specific tag
router.get('/:id/notes', users.getUserNotesByTag);

module.exports = router;
