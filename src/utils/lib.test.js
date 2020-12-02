import * as lib from './lib';

// umi test ./src/utils/lib.test.js

test('数值判断', () => {
  expect(lib.isNumOrFloat(23)).toBeTruthy();
  expect(lib.isNumOrFloat('23.4')).toBeTruthy();
  expect(lib.isNumOrFloat('-23.4')).toBeTruthy();
  expect(lib.isNumOrFloat('-2a3.4')).toBeFalsy();
});

test('千分位格式，用于金额显示', () => {
  expect(lib.thouandsNum(23)).toBe('23');
  expect(lib.thouandsNum(2311)).toBe('2,311');
  expect(lib.thouandsNum(2311.4)).toBe('2,311.4');
  expect(lib.thouandsNum('')).toBe('');
});

test('noncer 随机字符串生成', () => {
  expect(lib.noncer()).toHaveLength(13);
});
