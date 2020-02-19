const identifier = require('../identifier');

describe('sql identifier escape function', () => {
  test('it should wrap input in double quotation marks', () => {
    expect(identifier('hey')).toBe('"hey"');
    expect(identifier('')).toBe('""');
  });

  describe('it should escape double quotation marks in the text', () => {
    test('a single double quotation mark', () => {
      expect(identifier('foo"bar')).toBe('"foo""bar"');
    });

    test('multiple double quotation marks', () => {
      expect(identifier('foo""bar')).toBe('"foo""""bar"');
      expect(identifier('"foo""bar')).toBe('"""foo""""bar"');
    });

    test('it should not replace single quotation marks', () => {
      expect(identifier("foo'bar")).toBe('"foo\'bar"');
    });
  });
});
