const limit = require('../../../../createModel/formatter/sql/limit');
const defaultConfig = require('../../../../createModel/defaultConfig');

const config = { ...defaultConfig, collection: 'books' };
const limitSQL = limit(config);

describe('generates LIMIT sql statement', () => {
  describe('should return the default on an undefined $limit key', () => {
    test('default config limit value', () => {
      const query = { foo: 'bar' };
      expect(limitSQL(query)).toBe(`LIMIT ${defaultConfig.defaultLimit}`);
    });

    test('custom config limit value', () => {
      const query = { foo: 'bar' };
      const customConfig = { defaultLimit: 15, collection: 'books' };
      const customLimitSQL = limit(customConfig);
      expect(customLimitSQL(query)).toBe(`LIMIT 15`);
    });
  });

  test('should throw an error if $limit key is not a number', () => {
    const query = { foo: 'bar', $limit: '30' };
    expect(() => limitSQL(query)).toThrow();
  });

  test('should return a properly formatted SQL limit statement', () => {
    const query = { foo: 'bar', $limit: 30 };
    expect(limitSQL(query)).toBe('LIMIT 30');
  });
});
