import * as lib from './lib';

// umi test ./src/component/chartItem/option/lib.test.ts

test('getMax', () => {
  expect(lib.getMax(5)).toBe(10);
  expect(lib.getMax(15)).toBe(20);
  expect(lib.getMax(115)).toBe(200);
  expect(lib.getMax(155)).toBe(200);
  expect(lib.getMax(955)).toBe(1000);
  expect(lib.getMax(-25)).toBe(-20);
  expect(lib.getMax(-155)).toBe(-100);
});

test('getMin', () => {
  expect(lib.getMin(5)).toBe(0);
  expect(lib.getMin(4)).toBe(0);
  expect(lib.getMin(15)).toBe(10);
  expect(lib.getMin(115)).toBe(100);
  expect(lib.getMin(100)).toBe(100);
  expect(lib.getMin(155)).toBe(100);
  expect(lib.getMin(955)).toBe(900);
  expect(lib.getMax(-35)).toBe(-30);
});

test('getPercentWithPrecision', () => {
  let arr = lib.getPercentWithPrecision([11, 21, 31, 41], 2);
  expect(arr).toEqual([10.58, 20.19, 29.81, 39.42]);
});

test('getPercent', () => {
  let arr = lib.getPercent({
    data: [
      {
        a: 11,
      },
      {
        a: 21,
      },
      {
        a: 31,
      },
      {
        a: 41,
      },
    ],
    y: 0,
    header: ['a', 'b'],
  });
  expect(arr[0].percent).toEqual(10.58);
});

test('getChartType', () => {
  expect(lib.getChartType('area', 0.5)).toMatchObject({
    type: 'line',
    areaStyle: { opacity: 0.5 },
  });
  expect(lib.getChartType('column')).toMatchObject({
    type: 'column',
  });
});

test('handleMinMax', () => {
  let res = lib.handleMinMax({ min: 12, max: 55 });
  expect(res).toMatchObject({
    min: 10,
    max: 100,
  });
});

test('color', () => {
  expect(lib.rgb2hex('rgb(255,255,255)')).toBe('#ffffffff');
  expect(lib.hex2rgb('#ffffff')).toBe('255,255,255');
  expect(lib.hex2rgb('#fff')).toBe('255,255,255');
});
