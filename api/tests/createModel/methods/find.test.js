const { setupDatabase, resetDatabase } = require('../../setup/testDatabase');

const Model = require('../../setup/testModel');

beforeEach(() => setupDatabase());
afterEach(() => resetDatabase());

describe('createModel methods ->  Model.find', () => {
  test('should return an array', async () => {
    const res = await Model.find({});
    expect(Array.isArray(res)).toBe(true);
  });

  test('should return 10 records by default', async () => {
    const res = await Model.find({});
    expect(res.length).toBe(10);
  });

  test('should return the most recent records by default', async () => {
    const res = await Model.find({});
    expect(res[0].id).toBe(10);
  });

  const lenora = {
    id: 4,
    first_name: 'Lenora',
    last_name: 'Sipes',
    job_title: 'International Applications Orchestrator',
    tsv: "'applic':2 'intern':1 'orchestr':3",
  };

  test('should return the correct record for a single-condition query', async () => {
    const res = await Model.find({ first_name: 'Lenora' });
    expect(res.length).toBe(1);
    expect(res[0]).toEqual(lenora);
  });

  test('should return the correct record for a multi-condition query', async () => {
    const res = await Model.find({ first_name: 'Lenora', last_name: 'Sipes' });
    expect(res.length).toBe(1);
    expect(res[0]).toEqual(lenora);
  });

  const aileenWitting = {
    id: 1,
    first_name: 'Aileen',
    last_name: 'Witting',
    job_title: 'Future Brand Assistant',
    tsv: "'assist':3 'brand':2 'futur':1",
  };

  const aileenShields = {
    id: 8,
    first_name: 'Aileen',
    last_name: 'Shields',
    job_title: 'District Communications Coordinator',
    tsv: "'communic':2 'coordin':3 'district':1",
  };

  test('should return multiple records if multiple records match', async () => {
    const res = await Model.find({ first_name: 'Aileen' });
    expect(res.length).toBe(2);
    expect(res[0]).toEqual(aileenShields);
    expect(res[1]).toEqual(aileenWitting);
  });

  test('should return no records if no records match', async () => {
    const res = await Model.find({ first_name: 'Richard' });
    expect(res).toEqual([]);
  });

  test('should return the correct record when using the helper findById method', async () => {
    const res = await Model.findById(1);
    expect(res.length).toBe(1);
    expect(res[0].id).toBe(1);
  });
});
