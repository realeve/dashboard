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
  expect(lib.thouandsNum(2311, 0)).toBe('2,311');
  expect(lib.thouandsNum(2311.337, 2)).toBe('2,311.337');
  expect(lib.thouandsNum(2311.4)).toBe('2,311.4');
  expect(lib.thouandsNum('')).toBe('');
});

test('noncer 随机字符串生成', () => {
  expect(lib.noncer()).toHaveLength(13);
});

test('公共函数', () => {
  expect(lib.now()).toHaveLength(19);
  expect(lib.ymd()).toHaveLength(8);
  expect(lib.encodeBase64('a')).toBe('YQ==');
  expect(lib.decodeBase64('YQ==')).toBe('a');
});

test('store存储测试', () => {
  expect(lib.setStore({ a: 1 }, { payload: { b: 2 } })).toEqual({
    a: 1,
    b: 2,
  });
  expect(lib.setStore({ a: 1 }, { payload: { b: 2, c: 2 } })).toEqual({
    a: 1,
    b: 2,
    c: 2,
  });
  expect(lib.setStore({ a: 1 }, { payload: { a: 2 } })).toEqual({ a: 2 });

  expect(lib.setStore({ a: { b: 2 } }, { payload: { a: { b: 3, c: 2 } } })).toEqual({
    a: { b: 3, c: 2 },
  });

  // throw error报错
  // expect(lib.setStore({ a: 1 }, { b: 2 })).toThrow(/payload/);
  expect(lib.setStore({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
});

test('文件读写', async () => {
  let testResult = '{"a":1}';
  let blob = new Blob([testResult], { type: 'text/plain;charset=utf-8' });
  let res = await lib.loadDashboard(blob);
  expect(res).toMatchObject(JSON.parse(testResult));

  expect(lib.saveDashboard({ a: 1 })).toBeTruthy();
});
