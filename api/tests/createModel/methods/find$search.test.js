const { setupDatabase, resetDatabase } = require('../../setup/testDatabase');

const Model = require('../../setup/testModel');

beforeEach(() => setupDatabase());
afterEach(() => resetDatabase());

describe('createModel methods -> Model.find with $search key', () => {
  test('should return default results if $search is blank', async () => {
    const res = await Model.find({ $search: '' });
    expect(res.length).toBe(10);
  });

  test('should return a single result that matche a full-text query', async () => {
    const res = await Model.find({ $search: 'future' });
    expect(res.length).toBe(1);
    expect(res[0].job_title).toBe('Future Brand Assistant');
  });

  test('should return multiple results that match a full-text query', async () => {
    const res = await Model.find({ $search: 'coordinator' });

    const expectedJobTitles = [
      'District Communications Coordinator',
      'International Web Coordinator',
    ];

    expect(res.length).toBe(2);
    expect(res.map((el) => el.job_title)).toEqual(
      expect.arrayContaining(expectedJobTitles),
    );
  });

  test('should return a single result that matches a multi-word full-text query', async () => {
    const res = await Model.find({ $search: 'director forward' });
    expect(res.length).toBe(1);
    expect(res[0].job_title).toBe('Forward Optimization Director');
  });

  test('should return a single result that matches a full-text query by lexeme', async () => {
    const res = await Model.find({ $search: 'mobile' });
    expect(res.length).toBe(1);
    expect(res[0].job_title).toBe('Dynamic Mobility Orchestrator');
  });

  test('should return an empty array if no results match a full-text query', async () => {
    const res = await Model.find({ $search: 'metric' });
    expect(res.length).toBe(0);
  });
});
