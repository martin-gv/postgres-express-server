const {
  setupDatabase,
  resetDatabase,
  db,
} = require('../../setup/testDatabase');

const Model = require('../../setup/testModel');
const { createModel } = require('../../../index');

beforeEach(() => setupDatabase());
afterEach(() => resetDatabase());

describe('createModel methods -> Model.update', () => {
  test('should throw an error (if using the default config) when attempting to update all records', () => {
    // The update method returns a promise only if it successfully prepares
    // the SQL string. Any errors prior to this are thrown synchronously. This
    // is why await is not used in this test (and other similar tests).
    expect(() => {
      Model.update({}, { foo: 'bar' });
    }).toThrow();
  });

  test('should thrown an error (if using the default config) when a $ query key is included', () => {
    expect(() => {
      Model.update({ id: 1, $limit: 5 }, { foo: 'bar' });
    }).toThrow();
  });

  test('should thrown an error if an empty object is passed in as the second argument', () => {
    expect(() => {
      Model.update({ id: 1 }, {});
    }).toThrow();
  });

  test('should return an array', async () => {
    const res = await Model.update({ id: 1 }, { job_title: 'foobar' });
    expect(Array.isArray(res)).toBe(true);
  });

  test('should return the updated record', async () => {
    const res = await Model.update({ id: 1 }, { job_title: 'CEO' });
    expect(res.length).toBe(1);
    expect(res[0].id).toBe(1);
  });

  test('should correctly update a single field in a single record', async () => {
    const res = await Model.update({ id: 1 }, { job_title: 'CEO' });
    expect(res.length).toBe(1);
    expect(res[0].job_title).toEqual('CEO');
  });

  test('should only update specified fields in a single record', async () => {
    const res = await Model.update({ id: 1 }, { job_title: 'CEO' });

    const updatedAileen = {
      id: 1,
      first_name: 'Aileen',
      last_name: 'Witting',
      job_title: 'CEO',
      tsv: "'ceo':1",
    };

    expect(res.length).toBe(1);
    expect(res[0]).toEqual(updatedAileen);
  });

  test('should correctly update multiple fields in a single record', async () => {
    const res = await Model.update(
      { id: 1 },
      { job_title: 'CEO', first_name: 'Anika' },
    );

    expect(res.length).toBe(1);

    // updated fields
    expect(res[0].first_name).toBe('Anika');
    expect(res[0].job_title).toBe('CEO');
    expect(res[0].tsv).toBe("'ceo':1");

    // these fields should not be updated
    expect(res[0].id).toBe(1);
    expect(res[0].last_name).toBe('Witting');
  });

  test('should correctly update a single field across multiple records', async () => {
    const res = await Model.update(
      { first_name: 'Aileen' },
      { job_title: 'CEO' },
    );

    expect(res.length).toBe(2);

    // updated fields
    expect(res[0].job_title).toBe('CEO');
    expect(res[1].job_title).toBe('CEO');

    // these fields should not be updated
    expect(res[0].id).toBe(1);
    expect(res[0].first_name).toBe('Aileen');
    expect(res[0].last_name).toBe('Witting');

    // these fields should not be updated
    expect(res[1].id).toBe(8);
    expect(res[1].first_name).toBe('Aileen');
    expect(res[1].last_name).toBe('Shields');
  });

  test('should correctly update multiple fields across multiple records', async () => {
    const res = await Model.update(
      { last_name: 'Sporer' },
      { first_name: 'Gisselle', job_title: 'CEO' },
    );

    expect(res.length).toBe(2);

    // updated fields - first record
    expect(res[0].first_name).toBe('Gisselle');
    expect(res[0].job_title).toBe('CEO');

    // updated fields - second record
    expect(res[1].first_name).toBe('Gisselle');
    expect(res[1].job_title).toBe('CEO');

    // fields not updated - first record
    expect(res[0].id).toBe(5);
    expect(res[0].last_name).toBe('Sporer');

    // fields not updated - second record
    expect(res[1].id).toBe(9);
    expect(res[1].last_name).toBe('Sporer');
  });

  test('should update a single record when updating by id', async () => {
    const res = await Model.updateById(1, { job_title: 'CEO' });
    expect(res.length).toBe(1);
  });

  test('should update the correct record when updating by id', async () => {
    const res = await Model.updateById(5, { job_title: 'CEO' });
    expect(res[0].id).toBe(5);
  });

  test('should update the correct record when using the helper updateById method', async () => {
    const res = await Model.updateById(5, { job_title: 'CEO' });

    // updated field
    expect(res[0].job_title).toBe('CEO');

    // non-updated fields
    expect(res[0].id).toBe(5);
    expect(res[0].first_name).toBe('Marjolaine');
    expect(res[0].last_name).toBe('Sporer');
  });

  test('should update all records', async () => {
    const CustomModel = createModel({
      collection: 'employee',
      DANGER_updateAll: true,
      db,
    });

    const res = await CustomModel.update({}, { job_title: 'CEO' });
    expect(res.length).toBe(10);

    // updated field
    expect(res.every((el) => el.job_title === 'CEO')).toBe(true);

    // non-updated fields (id, name, tsv)
    expect(res.every((el) => el.tsv === "'ceo':1")).toBe(true);

    const idAndNames = [
      { id: 1, name: 'Aileen Witting' },
      { id: 2, name: 'Grayce Tillman' },
      { id: 3, name: 'Gisselle Lueilwitz' },
      { id: 4, name: 'Lenora Sipes' },
      { id: 5, name: 'Marjolaine Sporer' },
      { id: 6, name: 'Tremayne Kilback' },
      { id: 7, name: 'Lula Rau' },
      { id: 8, name: 'Aileen Shields' },
      { id: 9, name: 'Israel Sporer' },
      { id: 10, name: 'Lawson Jaskolski' },
    ];

    expect(
      res.map((el) => {
        return { id: el.id, name: `${el.first_name} ${el.last_name}` };
      }),
    ).toEqual(idAndNames);
  });
});
