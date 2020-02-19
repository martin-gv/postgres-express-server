const join = require('../join');

const config = { collection: 'books' };
const joinSQL = join(config);

describe('generates JOIN sql statement', () => {
  test('should return a blank string if no $join key exists', () => {
    const query = { title: 'foobar' };
    expect(joinSQL(query)).toBe('');
  });

  describe('$join object should be valid', () => {
    test('should throw an error for missing keys', () => {
      expect(() => joinSQL({ $join: { table: 'foo' } })).toThrow();
      expect(() => joinSQL({ $join: { field: 'foo' } })).toThrow();
    });

    test('should throw an error for non-string keys', () => {
      expect(() => joinSQL({ $join: { table: [] } })).toThrow();
      expect(() => joinSQL({ $join: { field: [] } })).toThrow();
    });
  });

  test('should return a properly formatted JOIN sql statement', () => {
    const query1 = { $join: { table: 'foo', field: 'bar' } };
    expect(joinSQL(query1)).toBe(
      'INNER JOIN "foo" ON "foo"."bar" = "books".id',
    );

    const query2 = { $join: { field: 'foo', table: 'bar' } };
    expect(joinSQL(query2)).toBe(
      'INNER JOIN "bar" ON "bar"."foo" = "books".id',
    );
  });

  test('should ignore non-$join keys', () => {
    const query1 = { title: 'foobar', $join: { table: 'foo', field: 'bar' } };
    expect(joinSQL(query1)).toBe(
      'INNER JOIN "foo" ON "foo"."bar" = "books".id',
    );

    const query2 = {
      title: 'foobar',
      $hello: 'there',
      $join: { table: 'foo', field: 'bar' },
    };
    expect(joinSQL(query2)).toBe(
      'INNER JOIN "foo" ON "foo"."bar" = "books".id',
    );
  });
});
