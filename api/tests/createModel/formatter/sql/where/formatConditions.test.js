const formatConditions = require('../../../../../createModel/formatter/sql/where/formatConditions');

const mainTable = '"books"';

describe('converts query keys to WHERE statements for WHERE sql formatter', () => {
  test('should return an array of formatted WHERE statements', () => {
    const queryKeys1 = ['foobar'];
    const conditions1 = queryKeys1.map(formatConditions(mainTable));
    expect(conditions1).toEqual([`${mainTable}."foobar" = $1`]);

    const queryKeys2 = ['foobar', 'hello', 'there'];
    const conditions2 = queryKeys2.map(formatConditions(mainTable));
    expect(conditions2).toEqual([
      `${mainTable}."foobar" = $1`,
      `${mainTable}."hello" = $2`,
      `${mainTable}."there" = $3`,
    ]);
  });

  test('should properly escape dot-notation table names', () => {
    const queryKeys1 = ['houses.id', 'foobar'];
    const conditions1 = queryKeys1.map(formatConditions(mainTable));
    expect(conditions1).toEqual([
      `"houses"."id" = $1`,
      `${mainTable}."foobar" = $2`,
    ]);
  });
});
