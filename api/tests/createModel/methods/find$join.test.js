const { setupDatabase, resetDatabase } = require('../../setup/testDatabase');

const Model = require('../../setup/testModel');

beforeEach(() => setupDatabase());
afterEach(() => resetDatabase());

describe('createModel methods -> Model.find with $join key', () => {
  test('should return correctly joined records', async () => {
    const res = await Model.find({
      last_name: 'Tillman',
      $join: { table: 'client_account', field: 'employee_id' },
    });
    expect(res.length).toBe(3);
    expect(res.map((el) => el.employee_id)).toEqual([2, 2, 2]);
  });

  test('should return no records if no records can be joined', async () => {
    const res = await Model.find({
      last_name: 'Lueilwitz',
      $join: { table: 'client_account', field: 'employee_id' },
    });
    expect(res).toEqual([]);
  });
});
