const offset = require('../offset');
const defaultConfig = require('../../../defaultConfig');

const config = { ...defaultConfig, collection: 'books' };
const offsetSQL = offset(config);

describe('generates OFFSET sql statement', () => {
  describe('should return the default on an undefined $offset key', () => {
    test('default config offset value', () => {
      const query = { foo: 'bar' };
      expect(offsetSQL(query)).toBe(`OFFSET ${defaultConfig.defaultOffset}`);
    });

    test('custom config offset value', () => {
      const query = { foo: 'bar' };
      const customConfig = { defaultOffset: 45, collection: 'books' };
      const customOffsetSQL = offset(customConfig);
      expect(customOffsetSQL(query)).toBe(`OFFSET 45`);
    });
  });

  test('should throw an error if $offset key is not a number', () => {
    const query = { foo: 'bar', $offset: '50' };
    expect(() => offsetSQL(query)).toThrow();
  });

  test('should return a properly formatted SQL offset statement', () => {
    const query = { foo: 'bar', $offset: 50 };
    expect(offsetSQL(query)).toBe('OFFSET 50');
  });
});
