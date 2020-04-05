const {
  setupDatabase,
  resetDatabase,
  db,
} = require('../../setup/testDatabase');

const Model = require('../../setup/testModel');
const { createModel } = require('../../../index');

beforeEach(() => setupDatabase());
afterEach(() => resetDatabase());

describe('createModel methods -> Model.find with $offset key', () => {
  test('should skip 2 records when offset set to 2', async () => {
    const res = await Model.find({ $offset: 2 });
    expect(res[0].id).toBe(8);
  });

  test('should skip 5 records when offset set to 5', async () => {
    const res = await Model.find({ $offset: 5 });
    expect(res[0].id).toBe(5);
  });

  test('should skip no records when offset set to 0', async () => {
    const res = await Model.find({ $offset: 0 });
    expect(res[0].id).toBe(10);
  });

  test('should skip no records by default', async () => {
    const res = await Model.find({});
    expect(res[0].id).toBe(10);
  });

  const CustomModel = createModel({
    collection: 'employee',
    defaultOffset: 5,
    db,
  });

  test('should use the custom default offset, if specified', async () => {
    const res = await CustomModel.find({});
    expect(res[0].id).toBe(5);
  });

  test('should override the custom default offset if an offset is specified in the query', async () => {
    const res = await CustomModel.find({ $offset: 8 });
    expect(res[0].id).toBe(2);
  });

  test('should override the custom default offset if an offset of 0 is specified in the query', async () => {
    const res = await CustomModel.find({ $offset: 0 });
    expect(res[0].id).toBe(10);
  });
});
