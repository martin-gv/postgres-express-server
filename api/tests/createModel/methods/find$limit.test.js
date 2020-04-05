const {
  setupDatabase,
  resetDatabase,
  db,
} = require('../../setup/testDatabase');

const Model = require('../../setup/testModel');
const { createModel } = require('../../../index');

beforeEach(() => setupDatabase());
afterEach(() => resetDatabase());

describe('createModel methods -> Model.find with $limit key', () => {
  test('should limit the number of records returned', async () => {
    const res = await Model.find({ $limit: 5 });
    expect(res.length).toBe(5);
  });

  test('should return no records if limit is set to zero', async () => {
    const res = await Model.find({ $limit: 0 });
    expect(res).toEqual([]);
  });

  const CustomModel = createModel({
    collection: 'employee',
    defaultLimit: 5,
    db,
  });

  test('should use the custom default limit, if specified', async () => {
    const res = await CustomModel.find({});
    expect(res.length).toBe(5);
  });

  test('should override the custom default limit if a limit is specified in the query', async () => {
    const res = await CustomModel.find({ $limit: 7 });
    expect(res.length).toBe(7);
  });

  test('should override the custom default limit if a limit of 0 is specified in the query', async () => {
    const res = await CustomModel.find({ $limit: 0 });
    expect(res).toEqual([]);
  });
});
