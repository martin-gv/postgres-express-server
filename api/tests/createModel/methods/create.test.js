const {
  setupDatabase,
  resetDatabase,
  db,
} = require('../../setup/testDatabase');

const Model = require('../../setup/testModel');

beforeEach(() => setupDatabase());
afterEach(() => resetDatabase());

describe('createModel methods -> Model.create', () => {
  test('should return an array', async () => {
    const res = await Model.create({});
    expect(Array.isArray(res)).toBe(true);
  });

  test('should return a single record', async () => {
    const res = await Model.create({});
    expect(res.length).toBe(1);
  });

  test('should return the newly created record', async () => {
    const res = await Model.create({});
    expect(res[0].id).toBe(11);
  });

  test('should correctly insert data', async () => {
    const res = await Model.create({
      first_name: 'foo',
      last_name: 'bar',
    });
    expect(res[0].first_name).toBe('foo');
    expect(res[0].last_name).toBe('bar');
  });

  test('should not insert additional data', async () => {
    const res = await Model.create({
      first_name: 'foo',
      last_name: 'bar',
    });
    expect(res[0].job_title).toBe(null);
  });

  test('should only insert a single record', async () => {
    await Model.create({});
    const res = await db.query('SELECT * FROM "employee";');
    expect(res.length).toBe(11);
  });
});
