const hasOperator = require('../hasOperator');

describe('checks for object keys that start with $', () => {
  test('should return true if one or more keys start with $', () => {
    expect(hasOperator({ $: '' })).toBe(true);
    expect(hasOperator({ foo: 'bar', $foo: 'bar' })).toBe(true);
    expect(hasOperator({ $foo: 'bar', $bar: 'foo' })).toBe(true);
  });

  test('should return false if no object key starts with $', () => {
    expect(hasOperator({ foo: 'bar', hey: 'yep' })).toBe(false);
  });

  test('should return false on an empty object', () => {
    expect(hasOperator({})).toBe(false);
  });
});
