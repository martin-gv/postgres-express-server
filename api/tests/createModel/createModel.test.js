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

const TestModel = createModel({ collection: 'employee', db });

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

describe('database query methods from createModel', () => {
  describe('create method', () => {
    test('should return the newly created record', async () => {
      const res = await TestModel.create({ first_name: 'hello' });

      expect(res.length).toBe(1);
      expect(res[0].id).toBe(11);
      expect(res[0].first_name).toBe('hello');
      expect(res[0].last_name).toBe(null);

      const res2 = await TestModel.create({
        first_name: 'foo',
        last_name: 'bar',
      });

      expect(res2.length).toBe(1);
      expect(res2[0].id).toBe(12);
      expect(res2[0].first_name).toBe('foo');
      expect(res2[0].last_name).toBe('bar');
    });
  });

  describe('find method', () => {
    test('should return an array', async () => {
      const res = await TestModel.find({});
      expect(Array.isArray(res)).toBe(true);
    });

    test('should return 10 records by default', async () => {
      const res = await TestModel.find({});
      expect(res.length).toBe(10);
    });

    test('should return the most recent records by default', async () => {
      const res = await TestModel.find({});
      expect(res[0].id).toBe(12); // most recent record
    });

    test('should return the correct record for a single-condition query', async () => {
      const res = await TestModel.find({ first_name: 'Lenora' });
      expect(res.length).toBe(1);
      expect(res[0].first_name).toBe('Lenora');
    });

    test('should return the correct record for a multi-condition query', async () => {
      const res = await TestModel.find({
        first_name: 'Marjolaine',
        last_name: 'Sporer',
      });
      expect(res.length).toBe(1);
      expect(res[0].first_name).toBe('Marjolaine');
      expect(res[0].last_name).toBe('Sporer');
    });

    test('should return multiple records if multiple records match', async () => {
      const res = await TestModel.find({ first_name: 'Aileen' });
      expect(res.length).toBe(2);
      expect(res[0].first_name).toBe('Aileen');
      expect(res[1].first_name).toBe('Aileen');
    });

    test('should return no records if no records match', async () => {
      const res = await TestModel.find({ first_name: 'Richard' });
      expect(res).toEqual([]);
    });

    test('should return records sorted from oldest to newest', async () => {
      const res = await TestModel.find({ $sort: { id: -1 } });
      expect(res[0].id).toBe(12);
    });

    test('should return records sorted from newest to oldest', async () => {
      const res = await TestModel.find({ $sort: { id: 1 } });
      expect(res[0].id).toBe(1);
    });

    test('should limit number of records returned', async () => {
      const res = await TestModel.find({ $limit: 5 });
      expect(res.length).toBe(5);
    });

    test('should return no records if limit is set to zero', async () => {
      const res = await TestModel.find({ $limit: 0 });
      expect(res).toEqual([]);
    });

    test('should skip the correct number of records', async () => {
      const res = await TestModel.find({ $offset: 5 });
      expect(res[0].id).toBe(7);

      const res2 = await TestModel.find({ $offset: 11 });
      expect(res2[0].id).toBe(1);
    });

    test('should return correct full-text search results', async () => {
      const res1 = await TestModel.find({ $search: 'future' });
      expect(res1.length).toBe(1);
      expect(res1[0].job_title).toBe('Future Brand Assistant');

      const res2 = await TestModel.find({ $search: 'coordinator' });
      expect(res2.length).toBe(2);
      expect(res2[0].job_title).toBe('District Communications Coordinator');
      expect(res2[1].job_title).toBe('International Web Coordinator');

      const res3 = await TestModel.find({ $search: 'director forward' });
      expect(res3.length).toBe(1);
      expect(res3[0].job_title).toBe('Forward Optimization Director');

      const res4 = await TestModel.find({ $search: 'mobile' });
      expect(res4.length).toBe(1);
      expect(res4[0].job_title).toBe('Dynamic Mobility Orchestrator');

      const res5 = await TestModel.find({ $search: 'metric' });
      expect(res5.length).toBe(0);
    });

    test('should return correctly joined records', async () => {
      const res = await TestModel.find({
        last_name: 'Tillman',
        $join: { table: 'client_account', field: 'employee_id' },
      });
      expect(res.length).toBe(3);
      expect(res[0].employee_id).toBe(2);
      expect(res[1].employee_id).toBe(2);
      expect(res[2].employee_id).toBe(2);
    });

    test('should return no records if no records can be joined', async () => {
      const res = await TestModel.find({
        last_name: 'Lueilwitz',
        $join: { table: 'client_account', field: 'employee_id' },
      });
      expect(res).toEqual([]);
    });

    test('should use the custom default limit if specified', async () => {
      const Employee = createModel({
        collection: 'employee',
        defaultLimit: 5,
        db,
      });
      const res = await Employee.find({});
      expect(res.length).toBe(5);
    });

    test('should use the custom default offset if specified', async () => {
      const Employee = createModel({
        collection: 'employee',
        defaultOffset: 5,
        db,
      });
      const res = await Employee.find({});
      expect(res[0].id).toBe(7);
    });

    test('should override the custom default limit if a limit is specified in the query', async () => {
      const Employee = createModel({
        collection: 'employee',
        defaultLimit: 5,
        db,
      });
      const res1 = await Employee.find({ $limit: 11 });
      expect(res1.length).toBe(11);

      const res2 = await Employee.find({ $limit: 0 });
      expect(res2).toEqual([]);
    });

    test('should override the custom default offset if a offset is specified in the query', async () => {
      const Employee = createModel({
        collection: 'employee',
        defaultOffset: 5,
        db,
      });
      const res1 = await Employee.find({ $offset: 8 });
      expect(res1[0].id).toBe(4);

      const res2 = await Employee.find({ $offset: 0 });
      expect(res2[0].id).toBe(12);
    });

    test('should return the correct record when searching by id', async () => {
      const res = await TestModel.findById(1);
      expect(res.length).toBe(1);
      expect(res[0].id).toBe(1);
    });
  });

  describe('update method', () => {
    test('should throw an error (if using the default config) when attempting to update all records', () => {
      // The update method returns a promise only if it successfully prepares
      // the SQL string. Any errors prior to this are thrown synchronously. This
      // is why no await is used below:
      expect(() => {
        TestModel.update({}, { job_title: 'CEO' });
      }).toThrow();
    });

    test('should thrown an error (if using the default config) when a $ query key is included', () => {
      expect(() => {
        TestModel.update({ id: 1, $limit: 5 }, { job_title: 'CEO' });
      }).toThrow();
    });

    test('should return the updated record', async () => {
      const res = await TestModel.update(
        { id: 1 },
        { job_title: 'Principal Security Architect' },
      );
      expect(res.length).toBe(1);
      expect(res[0].id).toBe(1);
    });

    test('should correctly update a single field in a single record', async () => {
      const res = await TestModel.update(
        { id: 1 },
        { job_title: 'Chief Directives Producer' },
      );
      expect(res.length).toBe(1);
      expect(res[0].job_title).toBe('Chief Directives Producer');
    });

    test('should not update fields not specified when updating a single record', async () => {
      const res = await TestModel.update(
        { id: 2 },
        { job_title: 'Forward Tactics Engineer' },
      );
      expect(res.length).toBe(1);
      expect(res[0].id).toBe(2);
      expect(res[0].first_name).toBe('Grayce');
      expect(res[0].last_name).toBe('Tillman');
    });

    test('should correctly update multiple fields in a single record', async () => {
      const res = await TestModel.update(
        { id: 3 },
        { job_title: 'Forward Markets Consultant', first_name: 'Anika' },
      );
      expect(res.length).toBe(1);

      // updated fields
      expect(res[0].first_name).toBe('Anika');
      expect(res[0].job_title).toBe('Forward Markets Consultant');

      // these fields should not be updated
      expect(res[0].id).toBe(3);
      expect(res[0].last_name).toBe('Lueilwitz');
    });

    test('should correctly update a single field in multiple records', async () => {
      const res = await TestModel.update(
        { first_name: 'Aileen' },
        { job_title: 'Forward Optimization Director' },
      );
      expect(res.length).toBe(2);

      // updated fields
      expect(res[0].job_title).toBe('Forward Optimization Director');
      expect(res[1].job_title).toBe('Forward Optimization Director');

      // these fields should not be updated
      expect(res[0].id).toBe(8);
      expect(res[0].first_name).toBe('Aileen');
      expect(res[0].last_name).toBe('Shields');

      // these fields should not be updated
      expect(res[1].id).toBe(1);
      expect(res[1].first_name).toBe('Aileen');
      expect(res[1].last_name).toBe('Witting');
    });

    test('should correctly update multiple fields across multiple records', async () => {
      const res = await TestModel.update(
        { last_name: 'Sporer' },
        { first_name: 'Gisselle', job_title: 'Future Brand Assistant' },
      );
      expect(res.length).toBe(2);

      // updated fields
      expect(res[0].first_name).toBe('Gisselle');
      expect(res[1].first_name).toBe('Gisselle');
      expect(res[0].job_title).toBe('Future Brand Assistant');
      expect(res[1].job_title).toBe('Future Brand Assistant');

      // fields not updated
      expect(res[0].id).toBe(5);
      expect(res[1].id).toBe(9);
      expect(res[0].last_name).toBe('Sporer');
      expect(res[1].last_name).toBe('Sporer');
    });

    test('should update a single record when updating by id', async () => {
      const res = await TestModel.updateById(6, {
        job_title: 'Forward Optimization Director',
      });
      expect(res.length).toBe(1);
    });

    test('should update the correct record when updating by id', async () => {
      const res = await TestModel.updateById(6, {
        job_title: 'Forward Optimization Director',
      });
      expect(res[0].id).toBe(6);
    });

    test('should update the correct field when updating by id', async () => {
      const res = await TestModel.updateById(6, {
        job_title: 'Product Quality Consultant',
      });

      // updated field
      expect(res[0].job_title).toBe('Product Quality Consultant');

      // non-updated fields
      expect(res[0].id).toBe(6);
      expect(res[0].first_name).toBe('Tremayne');
      expect(res[0].last_name).toBe('Kilback');
    });
  });

  describe('delete method', () => {
    test('should throw an error (if using the default config) when attempting to delete all records', () => {
      expect(() => {
        TestModel.delete({});
      }).toThrow();
    });

    test('should thrown an error (if using the default config) when a $ query key is included', () => {
      expect(() => {
        TestModel.delete({ id: 1, $limit: 5 });
      }).toThrow();

      expect(() => {
        TestModel.delete({ $limit: 5 });
      }).toThrow();

      expect(() => {
        TestModel.delete({ $offset: 5, $limit: 10 });
      }).toThrow();
    });

    test('should return the number of records deleted', async () => {
      const res1 = await TestModel.delete({ id: 1 });
      expect(res1).toBe(1);

      const res2 = await TestModel.delete({ last_name: 'Sporer' });
      expect(res2).toBe(2);
    });

    test('should delete a single record', async () => {
      await TestModel.delete({ id: 4 });

      const res = await TestModel.find({});
      expect(res.length).toBe(8);

      // check that the record has been deleted
      const recordFound = res.some((row) => row.id === 4);
      expect(recordFound).toBe(false);
    });

    test('should delete multiple records', async () => {
      await TestModel.delete({
        job_title: 'Forward Optimization Director',
      });

      const res = await TestModel.find({});
      expect(res.length).toBe(6);

      // check that both records have been deleted
      const recordFound = res.some((row) => row.id === 8 || row.id === 10);
      expect(recordFound).toBe(false);
    });

    test('should delete the correct record when deleting by id', async () => {
      await TestModel.deleteById(2);

      const res = await TestModel.find({});
      expect(res.length).toBe(5);

      const recordFound = res.some((row) => row.id === 2);
      expect(recordFound).toBe(false);
    });
  });
});
