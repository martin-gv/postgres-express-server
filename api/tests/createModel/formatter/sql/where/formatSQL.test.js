const formatSQL = require('../../../../../createModel/formatter/sql/where/formatSQL');

const config = { collection: 'books' };

describe('formatter function for WHERE sql formatter', () => {
  test('basic where statement', () => {
    const query = { foo: 'bar' };
    expect(formatSQL(config, query)).toBe('WHERE \n"books"."foo" = $1');
  });

  test('multiple where conditions', () => {
    const query = { foo: 'bar', hello: 'there' };
    expect(formatSQL(config, query)).toBe(
      'WHERE \n"books"."foo" = $1 AND\n"books"."hello" = $2',
    );
  });

  test('full-text search statement should be last', () => {
    const query = { $search: 'foobar', foo: 'bar', hello: 'there' };
    expect(formatSQL(config, query)).toBe(
      'WHERE \n"books"."foo" = $1 AND\n"books"."hello" = $2 AND\n"books".tsv @@ plainto_tsquery($0)',
    );
  });

  test('any $ keys except for $search should be ignored', () => {
    const query = {
      $search: 'foobar',
      $limit: 100,
      foo: 'bar',
      hello: 'there',
    };
    expect(formatSQL(config, query)).toBe(
      'WHERE \n"books"."foo" = $1 AND\n"books"."hello" = $2 AND\n"books".tsv @@ plainto_tsquery($0)',
    );
  });
});
