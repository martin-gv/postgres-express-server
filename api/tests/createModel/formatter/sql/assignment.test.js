const assignment = require('../../../../createModel/formatter/sql/assignment');

describe('format sql statement for SET assignments', () => {
  test('should throw on an empty object', () => {
    expect(() => assignment({})).toThrow();
  });

  test('should return an array with two items', () => {
    expect(Array.isArray(assignment({ foo: 'bar' }))).toBe(true);
    expect(assignment({ foo: 'bar' })).toHaveLength(2);
  });

  describe('first item in the returned array', () => {
    test('should be an assignment/placeholder list based on the object keys, with escaped column names', () => {
      expect(assignment({ foo: 'bar' })[0]).toBe('"foo" = $1');
      expect(assignment({ foo: 'bar', hey: 'yep' })[0]).toBe(
        '"foo" = $1, "hey" = $2',
      );
      expect(assignment({ foo: 'bar', hey: 'yep', hello: 'there' })[0]).toBe(
        '"foo" = $1, "hey" = $2, "hello" = $3',
      );
    });
  });

  describe('second item in the returned array', () => {
    test('should be an array', () => {
      const secondItem = assignment({ foo: 'bar' })[1];
      expect(Array.isArray(secondItem)).toBe(true);
    });

    test('should have a length equal to the number of keys', () => {
      expect(assignment({ foo: 'bar' })[1]).toHaveLength(1);
      expect(assignment({ foo: 'bar', hello: 'there' })[1]).toHaveLength(2);
    });

    test('should be an array of object values', () => {
      expect(assignment({ foo: 'bar' })[1]).toEqual(['bar']);
      expect(assignment({ foo: 'bar', hello: 'there' })[1]).toEqual([
        'bar',
        'there',
      ]);
    });
  });

  test('returned SET assignment and values should be in correct order', () => {
    expect(assignment({ foo: 'bar', hello: 'there' })).toEqual([
      '"foo" = $1, "hello" = $2',
      ['bar', 'there'],
    ]);

    expect(assignment({ hello: 'there', foo: 'bar' })).toEqual([
      '"hello" = $1, "foo" = $2',
      ['there', 'bar'],
    ]);
  });
});
