const params = require('../params');

describe('renumbers sql $1 placeholders into a valid sequence', () => {
  test('should throw if a string is not passed in', () => {
    expect(() => params([])).toThrow();
    expect(() => params({})).toThrow();
  });

  test('should replace all $1 placeholders with a valid sequence', () => {
    expect(params('$3 $4 $5')).toBe('$1 $2 $3');
    expect(params('$1')).toBe('$1');
    expect(params('$11 $22 $333')).toBe('$1 $2 $3');
    expect(params('$0foobar$0')).toBe('$1foobar$2');
  });

  test('should not modify $s not followed by a number', () => {
    expect(params('$foo 123 $bar 456')).toBe('$foo 123 $bar 456');
  });
});
