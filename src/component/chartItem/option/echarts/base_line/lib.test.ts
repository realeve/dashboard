import * as lib from './lib';

// umi test ./src/component/chartItem/option/echarts/base_line/lib.test.ts

test('获取坐标系名称', () => {
  expect(lib.getAxisName({ isReverse: true, isPolar: false, type: 'x' })).toBe('xAxis');
  expect(lib.getAxisName({ isReverse: false, isPolar: false, type: 'x' })).toBe('yAxis');

  expect(lib.getAxisName({ isReverse: true, isPolar: true, type: 'x' })).toBe('angleAxis');
  expect(lib.getAxisName({ isReverse: false, isPolar: true, type: 'x' })).toBe('radiusAxis');

  expect(lib.getAxisName({ isReverse: true, isPolar: true, type: 'y' })).toBe('radiusAxis');
  expect(lib.getAxisName({ isReverse: false, isPolar: true, type: 'y' })).toBe('angleAxis');
});

test('handlePercent', () => {
  let res = lib.handlePercent([
    {
      data: [1, 2],
    },
    {
      data: [4, 8],
    },
  ]);
  expect(res).toMatchObject([{ data: [20, 20] }, { data: [80, 80] }]);
});
