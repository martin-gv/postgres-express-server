const { createModel } = require('../api');

const User = createModel({ collection: 'user_account' });
const Note = createModel({ collection: 'note' });
const Tag = createModel({ collection: 'tag' });
const TaggedBy = createModel({ collection: 'tagged_by' });

module.exports = { User, Note, Tag, TaggedBy };
