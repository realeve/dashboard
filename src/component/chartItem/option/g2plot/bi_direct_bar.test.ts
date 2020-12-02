// umi test ./src/component/chartItem/option/g2plot/bi_direct_bar.test.ts
import * as lib from './bi_direct_bar';

test('双向条形图处理', () => {
  // 根据key计算最大值
  expect(lib.getMaxByKey([{ a: 1 }, { a: 2 }], 'a')).toBe(2);
  let axis = {
    min: 0,
    max: 20,
    grid: { line: null },
  };
  expect(
    lib.getMaxByKeys(
      [
        { a: 1, b: 13 },
        { a: 2, b: 2 },
      ],
      ['a', 'b'],
    ),
  ).toMatchObject({
    yAxis: {
      a: axis,
      b: axis,
    },
  });
});
