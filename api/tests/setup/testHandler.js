const createHandler = require('../../createHandler');
const TestModel = require('./testModel');

const testHandler = createHandler(TestModel);

module.exports = testHandler;
