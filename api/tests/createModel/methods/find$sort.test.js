const { setupDatabase, resetDatabase } = require('../../setup/testDatabase');

const Model = require('../../setup/testModel');

beforeEach(() => setupDatabase());
afterEach(() => resetDatabase());

describe('createModel methods -> Model.find with $sort key', () => {
  test('should return records sorted in descending order by id', async () => {
    const res = await Model.find({ $sort: { id: -1 } });
    expect(res[0].id).toBe(10);
    expect(res[9].id).toBe(1);
  });

  test('should return records sorted in ascending order by id', async () => {
    const res = await Model.find({ $sort: { id: 1 } });
    expect(res[0].id).toBe(1);
    expect(res[9].id).toBe(10);
  });

  test('should return records sorted in descending order by job_title', async () => {
    const res = await Model.find({ $sort: { job_title: -1 } });
    expect(res[0].job_title).toBe('Senior Configuration Director');
    expect(res[9].job_title).toBe('District Communications Coordinator');
  });

  test('should return records sorted in ascending order by job_title', async () => {
    const res = await Model.find({ $sort: { job_title: 1 } });
    expect(res[0].job_title).toBe('District Communications Coordinator');
    expect(res[9].job_title).toBe('Senior Configuration Director');
  });
});
