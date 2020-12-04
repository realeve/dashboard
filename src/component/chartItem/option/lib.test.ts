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
  expect(
    lib.getBarMax(
      [
        { a: 0, b: 1 },
        { a: 2, b: 3 },
      ],
      'a',
    ),
  ).toBe(3);
  expect(
    lib.getBarMax([
      [0, 11],
      [2, 13],
    ]),
  ).toBe(20);
});

test('getMin', () => {
  expect(lib.getMin(-4)).toBe(-10);
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
  expect(lib.getPercentWithPrecision([1, 2, -1, -2], 2)).toEqual([0, 0, 0, 0]);
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

test('uniq', () => {
  expect(lib.uniq([1, 1])).toMatchObject([1]);
});

test('tooltipFormatter', () => {
  // 数据为空
  expect(
    lib.tooltipFormatter({ series: [], unit: '', axisName: '', append: false, shouldDrill: false }),
  ).toBeFalsy();
  const config = {
    series: [
      {
        name: 'name',
        value: 1,
        seriesName: 'seriesName',
        color: '#f00',
      },
    ],
    unit: 'unit',
    axisName: 'axisName',
    append: false,
    shouldDrill: false,
  };
  expect(lib.tooltipFormatter(config)).toBe(
    '<div style="font-weight:bold;font-size:20px;height:30px;">name</div>unit<div class="ex_tooltip"><div class="icon" style="background-color:#f00;"></div><span>seriesName：1 </span></div>',
  );

  expect(
    lib.tooltipFormatter({
      ...config,
      series: [
        {
          name: 'name',
          value: 1,
          seriesName: 'seriesName1',
          color: '#f00',
        },
        {
          name: 'name',
          value: 2,
          seriesName: 'seriesName2',
          color: '#f00',
        },
      ],
      append: true,
      shouldDrill: true,
    }),
  ).toContain('<div style="color:#e23;">( 点击查看详情 )</div>');
});

test('处理单位', () => {
  expect(lib.getTooltipUnit(false)).toBeFalsy();
  expect(lib.getTooltipUnit('23(元)')).toBe(
    `<div style="margin-bottom:5px;display:block;">(单位:元)</div>`,
  );
});

test('echarts 配置项', () => {
  expect(lib.handleSimpleMode(1, { simple: false })).toBe(1);

  expect(
    lib.handleSimpleMode(
      {
        title: ['1'],
        xAxis: { name: '1', a: '2' },
        yAxis: { name: 2, a: '1' },
      },
      { simple: 1 },
    ),
  ).toMatchObject({
    title: '1',
    xAxis: { a: '2', axisLine: { show: false }, axisTick: { show: false } },
    yAxis: { a: '1' },
  });

  expect(
    lib.handleSimpleMode(
      {
        title: ['1'],
        xAxis: { name: '1', a: '2' },
        yAxis: { name: 2, a: '1' },
      },
      { simple: 2 },
    ),
  ).toMatchObject({
    title: {},
    xAxis: { a: '2', axisLine: { show: false }, axisTick: { show: false } },
    yAxis: { a: '1' },
    toolbox: {},
    grid: { left: 35, right: 10, top: 10, bottom: 20 },
  });

  expect(
    lib.handleSimpleMode(
      {
        title: ['1'],
        xAxis: { name: '1', a: '2' },
        yAxis: { a: '1' },
      },
      { simple: 3 },
    ),
  ).toMatchObject({
    title: '1',
    xAxis: { a: '2', axisLine: { show: false }, axisTick: { show: false } },
    yAxis: { a: '1' },
    toolbox: {},
    grid: { left: 35, right: 10, top: 45, bottom: 20 },
  });

  expect(
    lib.handleSimpleMode(
      {
        title: ['1'],
        yAxis: { name: '1', a: '2' },
        xAxis: { a: '1' },
      },
      { simple: 3 },
    ),
  ).toMatchObject({
    title: '1',
    yAxis: { a: '2' },
    xAxis: { a: '1' },
    toolbox: {},
    grid: { left: 35, right: 10, top: 45, bottom: 20 },
  });
});
