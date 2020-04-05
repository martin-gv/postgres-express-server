const { db } = require('./testDatabase');
const createModel = require('../../createModel');

module.exports = createModel({ collection: 'employee', db });
