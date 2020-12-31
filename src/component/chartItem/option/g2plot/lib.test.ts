// umi test ./src/component/chartItem/option/g2plot/lib.test.ts
import * as lib from './lib';

test('排序', () => {
  expect(lib.sort(2, 1)).toBe(1);

  expect(lib.sort('2020-01-03', '2020-01-02')).toBeFalsy();

  expect(lib.sort('三月', '一月')).toBe(2);
});

test('图表尾部跟随', () => {
  expect(lib.getAnnotations(null, { xField: 'x', yField: 'y', color: [] }, {})).toHaveLength(0);
  const data = [
      {
        x: 10,
        y: 20,
        legend: 'a',
      },
      {
        x: 11,
        y: 21,
        legend: 'a',
      },
    ];
    const config = { xField: 'x', yField: 'y', seriesField: 'legend', color: ['#111'] };

  const result = {
    type: 'text',
    content: 'a',
    style: { fill: '#111', textAlign: 'left', textBaseline: 'middle' },
    offsetX: 16,
  };

  expect(
    lib.getAnnotations(data, config, {
      isStack: true,
      isArea: true,
    }),
  ).toMatchObject([
    {
      ...result,
      position: [11, 10.5],
    },
  ]);

  expect(
    lib.getAnnotations(data, config, {
      isStack: false,
      isArea: true,
    }),
  ).toMatchObject([
    {
      ...result,
      position: [11, 21],
    },
  ]);
  expect(
    lib.getAnnotations(data, config, {
      isStack: false,
      isArea: false,
    }),
  ).toMatchObject([
    {
      ...result,
      position: [11, 21],
    },
  ]);
});
