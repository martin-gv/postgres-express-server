const getValues = require('../../../../../createModel/formatter/sql/where/getValues');

describe('getValues function for WHERE sql formatter', () => {
  test('returns an array of query object values', () => {
    expect(getValues({ foo: 'bar', hello: 'there' })).toEqual(['bar', 'there']);
  });

  test('returned array is in the order returned by Object.keys', () => {
    const query = { foo: 'bar', hello: 'there' };
    const keys = Object.keys(query);
    const values = keys.map((key) => query[key]);
    expect(getValues(query)).toEqual(values);
  });

  test('filters out keys that start with $ except for $search', () => {
    const query1 = { foo: 'bar', hello: 'there', $limit: 10 };
    expect(getValues(query1)).toEqual(['bar', 'there']);

    const query2 = { foo: 'bar', hello: 'there', $search: 'spaceship' };
    expect(getValues(query2)).toEqual(['bar', 'there', 'spaceship']);

    const query3 = {
      foo: 'bar',
      hello: 'there',
      $limit: 10,
      $search: 'spaceship',
    };
    expect(getValues(query3)).toEqual(['bar', 'there', 'spaceship']);
  });

  test('value in $search is returned last in the array', () => {
    const query1 = {
      foo: 'bar',
      $search: 'spaceship',
      hello: 'there',
    };
    expect(getValues(query1)[2]).toEqual('spaceship');
  });
});
