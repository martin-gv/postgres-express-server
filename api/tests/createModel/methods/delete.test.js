const {
  setupDatabase,
  resetDatabase,
  db,
} = require('../../setup/testDatabase');

const Model = require('../../setup/testModel');
const { createModel } = require('../../../index');

beforeEach(() => setupDatabase());
afterEach(() => resetDatabase());

describe('createModel methods -> Model.delete', () => {
  test('should throw an error (if using the default config) when attempting to delete all records', () => {
    expect(() => {
      Model.delete({});
    }).toThrow();
  });

  test('should thrown an error (if using the default config) when a $ query key is included', () => {
    expect(() => {
      Model.delete({ id: 1, $limit: 5 });
    }).toThrow();

    expect(() => {
      Model.delete({ $limit: 5 });
    }).toThrow();

    expect(() => {
      Model.delete({ $offset: 5, $limit: 10 });
    }).toThrow();
  });

  test('should return a number', async () => {
    const res = await Model.delete({ id: 1 });
    expect(typeof res).toBe('number');
  });

  test('should return the number of records deleted', async () => {
    const res = await Model.delete({ last_name: 'Sporer' });
    expect(res).toBe(2);
  });

  test('should delete a single record', async () => {
    await Model.delete({ id: 4 });

    const res = await Model.find({}); // query table to confirm results

    expect(res.length).toBe(9);

    const recordStillExists = res.some((row) => row.id === 4);
    expect(recordStillExists).toBe(false);
  });

  test('should delete multiple records', async () => {
    await Model.delete({ first_name: 'Aileen' });

    const res = await Model.find({});

    expect(res.length).toBe(8);

    const recordStillExists = res.some((row) => row.id === 1 || row.id === 8);
    expect(recordStillExists).toBe(false);
  });

  test('should delete the correct record when using the helper deleteById method', async () => {
    await Model.deleteById(2);

    const res = await Model.find({});

    expect(res.length).toBe(9);
    const recordStillExists = res.some((row) => row.id === 2);
    expect(recordStillExists).toBe(false);
  });

  test('should delete all records', async () => {
    const CustomModel = createModel({
      collection: 'employee',
      DANGER_deleteAll: true,
      db,
    });

    const deleteRes = await CustomModel.delete({});
    expect(deleteRes).toBe(10);

    // query table to confirm results
    const findRes = await Model.find({});
    expect(findRes).toEqual([]);
  });
});
