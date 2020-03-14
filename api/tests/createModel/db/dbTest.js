/* eslint-disable-next-line */
require('dotenv').config();

const fs = require('fs');
const path = require('path');

const createModel = require('../../../createModel');
const createPool = require('../../../db');

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

const setupSQL = fs.readFileSync(path.join(__dirname, 'setup.sql'), 'utf8');
const resetSQL = fs.readFileSync(path.join(__dirname, 'setup.sql'), 'utf8');

// db.query returns a Promise, which needs to be returned from Jest's setup and teardown functions
exports.setupDatabase = () => db.query(setupSQL);
exports.resetDatabase = () => db.query(resetSQL);

// model for use in tests
exports.Model = createModel({ collection: 'employee', db });

// for doing direct database queries
exports.db = db;
