import * as lib from './utils';
// umi test ./src/component/g2plot/util/utils.test.ts
test('g2 plot通用功能', () => {
  expect(lib.camelCase('helloKitty')).toBe('HelloKitty');
  expect(lib.camelCase('hello_kitty')).toBe('HelloKitty');
  expect(lib.checkChanged({ a: 2 }, { a: 3 })).toBeFalsy();

  expect(lib.sameArray([2, 3], [2, 3])).toBeTruthy();

  expect(lib.isType('2', 'String')).toBeTruthy();
  expect(lib.clone([2])).toMatchObject({ '0': 2 });

  expect(lib.clone(false)).toBeFalsy();
});
