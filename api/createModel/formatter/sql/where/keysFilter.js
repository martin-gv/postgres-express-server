const keysFilter = (key) => key === '$search' || !key.startsWith('$'); // only operator allowed is $search

module.exports = keysFilter;
