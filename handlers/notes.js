/* eslint-disable camelcase */

const { createHandler, tryCatch } = require('../api');
const { Note, TaggedBy } = require('../models');
const wrap = require('../util/wrap');

const notesHandler = createHandler(Note);

const addTag = async (req, res) => {
  const { id: note_id, tag_id } = req.params;
  const results = await TaggedBy.create({ note_id, tag_id });

  res.status(201).json(results);
};

const deleteTag = async (req, res) => {
  const { id: note_id, tag_id } = req.params;
  await TaggedBy.delete({ note_id, tag_id });

  res.status(204).end();
};

const customMethods = wrap({ addTag, deleteTag, martin: 'hey' }, tryCatch);

module.exports = { ...notesHandler, ...customMethods };
