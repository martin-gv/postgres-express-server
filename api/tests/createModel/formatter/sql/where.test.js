let where = require('../../../../createModel/formatter/sql/where');

const config = { collection: 'books' };
where = where(config);

describe('generates WHERE sql statement and values', () => {
  test('returns an array of length two, with correct types', () => {
    const query = { foo: 'bar' };
    const result = where(query);
    expect(Array.isArray(result)).toBe(true); // result is an array
    expect(result).toHaveLength(2); // with two items
    expect(typeof result[0]).toBe('string'); // first item is a string
    expect(Array.isArray(result[1])).toBe(true); // second item is an array
    expect(typeof result[1][0]).toBe('string'); // second item array contains a string
  });

  test('returns the default output if no query values or $search key present', () => {
    const query1 = { $limit: 25 };
    expect(where(query1)).toEqual(['', []]);

    const query2 = { $limit: 15, $offset: 30 };
    expect(where(query2)).toEqual(['', []]);

    const query3 = {};
    expect(where(query3)).toEqual(['', []]);

    const query4 = { $search: 'foobar' };
    expect(where(query4)).not.toEqual(['', []]); // not.toEqual

    const query5 = { $limit: 25, foo: 'bar' };
    expect(where(query5)).not.toEqual(['', []]);
  });
});
