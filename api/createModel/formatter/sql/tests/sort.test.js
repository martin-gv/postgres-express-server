const sort = require('../sort');
const defaultConfig = require('../../../defaultConfig');

const config = { ...defaultConfig, collection: 'books' };
const sortSQL = sort(config);

describe('generates SORT sql statement', () => {
  test('should return the default on an undefined $sort key', () => {
    const query = { foo: 'bar' };
    expect(sortSQL(query)).toBe(`ORDER BY "${config.collection}".id DESC`);
  });

  test('should throw an error if $sort key is not valid', () => {
    const query = { $sort: { id: 'foo' } };
    expect(() => sortSQL(query)).toThrow();

    const query2 = { $sort: { id: 2 } };
    expect(() => sortSQL(query2)).toThrow();

    const query3 = { $sort: { id: -1.5 } };
    expect(() => sortSQL(query3)).toThrow();
  });

  test('should return a properly formatted SQL SORT statement', () => {
    const query1 = { $sort: { foo: -1 } };
    expect(sortSQL(query1)).toBe(`ORDER BY "${config.collection}"."foo" DESC`);

    const query2 = { $sort: { bar: 1 } };
    expect(sortSQL(query2)).toBe(`ORDER BY "${config.collection}"."bar" ASC`);
  });
});
