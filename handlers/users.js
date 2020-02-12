/* eslint-disable camelcase */

const { createHandler, tryCatch } = require('../api');
const { User, Note, Tag } = require('../models/');
const wrap = require('../util/wrap');

const usersHandler = createHandler(User);

// Search a user's notes using full-text search
const searchUserNotes = async (req, res) => {
  const { id: user_id } = req.params;
  const { search: $search } = req.query;
  const results = await Note.find({ user_id, $search });

  res.status(200).json(results);
};

// Get a user's notes
const getUserNotes = async (req, res) => {
  const { id: user_id } = req.params;
  const results = await Note.find({ user_id });

  res.status(200).json(results);
};

// Many to many relationship uses a link table. Notes are queried using an inner join to
// the link table (e.g. Note.id -> TaggedBy.note_id), and a specifc tag_id on the link table

// Used by /tags/:id/notes
const getUserNotesByTag = async (req, res) => {
  const { id: tag_id } = req.params; // from params
  const { id: user_id } = res.locals.user; // from res.locals

  const results = await Note.find({
    user_id,
    $join: { table: 'tagged_by', field: 'note_id' },
    'tagged_by.tag_id': tag_id,
  });

  res.status(200).json(results);
};

// Used by /users/:id/tags
const getUserTags = async (req, res) => {
  const { id: user_id } = req.params;

  const promise1 = Tag.find({ user_id });
  const promise2 = Tag.find({
    user_id,
    $join: { table: 'tagged_by', field: 'tag_id' },
  });

  const [tags, notesTagged] = await Promise.all([promise1, promise2]);

  res.status(200).json({ tags, notesTagged });
};

const customMethods = wrap(
  {
    searchUserNotes,
    getUserNotes,
    getUserNotesByTag,
    getUserTags,
  },
  tryCatch,
);

module.exports = { ...usersHandler, ...customMethods };
