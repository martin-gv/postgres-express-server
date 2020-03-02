require('dotenv').config();

const fs = require('fs');
const path = require('path');

const createModel = require('../../createModel');
const createPool = require('../../../db/');

// Connect to testing database
const db = createPool(
  {
    user: process.env.TEST_PGUSER,
    host: process.env.TEST_PGHOST,
    database: process.env.TEST_PGDATABASE,
    password: process.env.TEST_PGPASSWORD,
    port: process.env.TEST_PGPORT,
  },
  { logger: false },
);

const testModel = createModel({ collection: 'test_table', db });

const setupFile = path.resolve(__dirname, './db/setup.sql');
const setupSQL = fs.readFileSync(setupFile, 'utf8');

const resetFile = path.resolve(__dirname, './db/reset.sql');
const resetSQL = fs.readFileSync(resetFile, 'utf8');

// beforeAll and afterAll return a promise for Jest.
// Note: setup and reset is done by querying the pool directly.
// The model itself is used in the tests.

beforeAll(() => {
  return db.query(setupSQL); // set up test table 'bananas'
});

afterAll(() => {
  return db.query(resetSQL); // delete test table
});

// Tests for a fully configured model, including a mock database
describe('database query methods from createModel', () => {
  test('create method', async () => {
    const res = await testModel.create({ first_name: 'hello' });

    expect(res.length).toBe(1);
    expect(res[0].id).toBe(1);
    expect(res[0].first_name).toBe('hello');
    expect(res[0].last_name).toBe(null);

    const res2 = await testModel.create({
      first_name: 'foo',
      last_name: 'bar',
    });

    expect(res2[0].id).toBe(2);
    expect(res2[0].first_name).toBe('foo');
    expect(res2[0].last_name).toBe('bar');
  });
});
