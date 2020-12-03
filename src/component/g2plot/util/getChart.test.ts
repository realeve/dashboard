import { getChart } from './getChart';

// umi test ./src/component/g2plot/util/getChart.test.ts

test('获取图表实例', () => {
  expect(getChart(null, 1)).toBeUndefined();
  expect(getChart((a) => a, 2)).toBeUndefined();
  expect(getChart({ current: {} }, 2)).toBeUndefined();
});
