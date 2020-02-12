const express = require('express');

const router = express.Router();

// Handlers
const notes = require('../handlers/notes');
const tags = require('../handlers/tags');

// Middleware
const roleRequired = require('../middleware/roleRequired');
const isOwner = require('../middleware/isOwner');

router
  .route('/')
  .get(roleRequired('admin'), notes.get)
  .post(isOwner, notes.post);

router
  .route('/:id')
  .all(notes.find, isOwner)
  .get(notes.get)
  .put(notes.put)
  .delete(notes.delete);

// Add/delete tags
router
  .route('/:id/tags/:tag_id')
  .all(tags.findBy('tag_id'), isOwner)
  .post(notes.addTag)
  .delete(notes.deleteTag);

module.exports = router;
