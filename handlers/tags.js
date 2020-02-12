const { createHandler } = require('../api');
const { Tag } = require('../models/');

const tagsHandler = createHandler(Tag);

module.exports = tagsHandler;
