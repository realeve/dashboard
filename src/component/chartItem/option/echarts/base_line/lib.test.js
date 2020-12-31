import * as lib from './lib';

// umi test ./src/component/chartItem/option/echarts/base_line/lib.test.js

test('获取坐标系名称', () => {
  expect(lib.getAxisName({ isReverse: true, isPolar: false, type: 'x' })).toBe('xAxis');
  expect(lib.getAxisName({ isReverse: false, isPolar: false, type: 'x' })).toBe('yAxis');

  expect(lib.getAxisName({ isReverse: true, isPolar: true, type: 'x' })).toBe('angleAxis');
  expect(lib.getAxisName({ isReverse: false, isPolar: true, type: 'x' })).toBe('radiusAxis');

  expect(lib.getAxisName({ isReverse: true, isPolar: true, type: 'y' })).toBe('radiusAxis');
  expect(lib.getAxisName({ isReverse: false, isPolar: true, type: 'y' })).toBe('angleAxis');
});

test('handlePercent', () => {
  const res = lib.handlePercent([
    {
      data: [1, 2],
    },
    {
      data: [4, 8],
    },
  ]);
  expect(res).toMatchObject([{ data: [20, 20] }, { data: [80, 80] }]);
});

test('标记区域', () => {
  const config = lib.getMarkArea(2, 1, '~');
  expect(config).toHaveLength(4);
  expect(config[0]).toMatchObject({
    key: 'markTitle1',
    defaultValue: '',
    type: 'input',
    valueType: 'text',
    title: `区域1标题`,
  });
});

test('标记区域配置项', () => {
  const config = lib.getMarkAreaData('平均值', [10, 20]);
  expect(lib.getMarkAreaData('', [])).toHaveLength(0);
  expect(config[1]).toMatchObject({
    yAxis: 20,
  });
  expect(config[0]).toMatchObject({
    name: '平均值',
    label: {
      position: 'right',
      offset: [-27, 0],
      color: '#fff',
    },
    yAxis: 10,
  });
});

test('标记区域配置项', () => {
  const option = {
    showMarkArea: true,
    markAreaColor: '#fff',
    markAreaColor2: '#f00',
    markTitle1: 'area1',
    markArea1: [10, 20],
    markTitle2: '',
    markArea2: [10, 20],
    markTitle3: '',
    markArea3: [10, 20],
    markTitle4: '',
    markArea4: [10, 20],
    markTitle5: '',
    markArea5: [10, 20],
  };
  const config = lib.getMarkAreaInfo(option);
  expect(config).toMatchObject({
    markArea: {
      silent: true,
      itemStyle: {
        color: '#fff',
      },
      data: [
        [
          {
            name: 'area1',
            label: {
              position: 'right',
              offset: [-45, 0],
              color: '#fff',
            },
            yAxis: 10,
          },
          {
            yAxis: 20,
          },
        ],
      ],
    },
  });
});
