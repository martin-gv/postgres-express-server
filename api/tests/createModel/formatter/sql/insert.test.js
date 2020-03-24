const insert = require('../../../../createModel/formatter/sql/insert');

describe('generates INSERT sql statement', () => {
  //   output is an array
  test('returns an array with three items, with correct types', () => {
    const data = {};
    const result = insert(data);

    expect(Array.isArray(result)).toBe(true); // is an array
    expect(result.length).toBe(3); // of length 3
    expect(typeof result[0]).toBe('string'); // first item is a string
    expect(typeof result[1]).toBe('string'); // second item is a string
    expect(Array.isArray(result[2])).toBe(true); // third item is an array
  });

  // default if no data
  test('returns default INSERT if no data provided', () => {
    const data = {};
    expect(insert(data)[0]).toBe('');
    expect(insert(data)[1]).toBe('(DEFAULT)');
    expect(insert(data)[2]).toEqual([]);
  });

  test('first item in returned array is a formatted list of columns', () => {
    const data = { foo: 'bar', hello: 'there', hey: 'yep' };
    expect(insert(data)[0]).toBe('("foo", "hello", "hey")');
  });

  test('second item in returned array is a formatted list of placeholders', () => {
    const data = { foo: 'bar', hello: 'there', hey: 'yep' };
    expect(insert(data)[1]).toBe('($1, $2, $3)');
  });

  test('third item in the returned array is an array of values', () => {
    const data = { foo: 'bar', hello: 'there', hey: 'yep' };
    expect(insert(data)[2]).toEqual(['bar', 'there', 'yep']);
  });
});
