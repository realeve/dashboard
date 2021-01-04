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
  expect(lib.getMin(-4)).toBe(-5);
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
  const arr = lib.getPercentWithPrecision([11, 21, 31, 41], 2);
  expect(arr).toEqual([10.58, 20.19, 29.81, 39.42]);
  expect(lib.getPercentWithPrecision([1, 2, -1, -2], 2)).toEqual([0, 0, 0, 0]);
  expect(lib.getPercentWithPrecision([1, 1, '-'])).toEqual([50, 50, 0]);
});

test('getPercent', () => {
  const arr = lib.getPercent({
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
  const res = lib.handleMinMax({ min: 12, max: 55 });
  expect(res).toMatchObject({
    min: 10,
    max: 100,
  });
});

test('color', () => {
  expect(lib.rgb2hex('#fff')).toBe('#fff');
  expect(lib.rgb2hex('rgb(15,255,255)')).toBe('#0fffffff');
  expect(lib.rgb2hex('rgba(15,255,255,1)')).toBe('#0fffffff');
  expect(lib.hex2rgb('ffffff')).toBe('255,255,255');
  expect(lib.hex2rgb('#fff')).toBe('255,255,255');
});

test('uniq', () => {
  expect(lib.uniq([1, 1])).toMatchObject([1]);
});

test('tooltipFormatter', () => {
  // 数据为空
  expect(lib.tooltipFormatter({ series: [], unit: '', axisName: '' })).toBeFalsy();
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
          value: '-',
          seriesName: 'seriesName1',
          color: '#f00',
        },
      ],
      unit: false,
    }),
  ).toBe('<div style="font-weight:bold;font-size:20px;height:30px;">name</div>');

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

  expect(
    lib.tooltipFormatter({
      ...config,
      series: [
        {
          name: 'name',
          value: '1',
          color: '#f00',
        },
        {
          name: 'name',
          value: '2',
          color: '#f00',
        },
      ],
    }),
  ).toBe(
    '<div style="font-weight:bold;font-size:20px;height:30px;">name</div>unit<div class="ex_tooltip"><div class="icon" style="background-color:#f00;"></div><span>axisName：1 </span></div><div class="ex_tooltip"><div class="icon" style="background-color:#f00;"></div><span>axisName：2 </span></div>',
  );

  expect(
    lib.tooltipFormatter({
      ...config,
      series: [
        {
          value: '1',
          color: '#f00',
        },
      ],
    }),
  ).toBe(
    'undefinedunit<div class="ex_tooltip"><div class="icon" style="background-color:#f00;"></div><span>axisName：1 </span></div>',
  );
});

test('处理单位', () => {
  expect(lib.getTooltipUnit(false)).toBeFalsy();
  expect(lib.getTooltipUnit('23')).toBeFalsy();
  expect(lib.getTooltipUnit('23(元)')).toBe(
    `<div style="margin-bottom:5px;display:block;">(单位:元)</div>`,
  );
});

test('echarts 配置项', () => {
  expect(lib.handleSimpleMode(1, { simple: false })).toBe(1);
  expect(lib.handleSimpleMode(1, { simple: 4 })).toBe(1);

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

test('str2Date', () => {
  expect(lib.str2Date('as')).toBe('as');
  expect(lib.str2Date('202001')).toBe('2020-01');
  expect(lib.str2Date('20200102')).toBe('2020-01-02');
});

test('str2Num', () => {
  expect(lib.str2Num('23')).toBe(23);
  expect(lib.str2Num('23.2')).toBe(23.2);
  expect(lib.str2Num('a')).toBe('a');
});

test('isDate', () => {
  expect(lib.isDate('20')).toBeFalsy();
  expect(lib.isDate('20201102')).toBeTruthy();
  expect(lib.isDate('2020-11-02')).toBeTruthy();
  expect(lib.isDate('2020-11-02 12:34')).toBeTruthy();
});

test('needConvertDate', () => {
  expect(lib.needConvertDate('20')).toBeFalsy();
  expect(lib.needConvertDate('20201102')).toBeTruthy();
  expect(lib.needConvertDate('2020-11-02')).toBeTruthy();
  expect(lib.needConvertDate('2020-11-02 12:34')).toBeTruthy();
});

test('getDataByIdx', () => {
  expect(
    lib.getDataByIdx({
      key: 'a',
      data: [
        { a: 2, b: 3 },
        { a: 3, b: 4 },
      ],
    }),
  ).toEqual([2, 3]);
});
test('getUniqByIdx', () => {
  expect(
    lib.getUniqByIdx({
      key: 'a',
      data: [
        { a: 2, b: 3 },
        { a: 3, b: 4 },
        { a: 3, b: 4 },
      ],
    }),
  ).toEqual([2, 3]);
});

test('getDataByKeys', () => {
  expect(
    lib.getDataByKeys({
      keys: ['a', 'c'],
      data: [
        { a: 2, b: 3, c: 1 },
        { a: 3, b: 4, c: 2 },
        { a: 3, b: 4, c: 3 },
      ],
    }),
  ).toEqual([
    [2, 1],
    [3, 2],
    [3, 3],
  ]);
});

test('getLegendData', () => {
  expect(lib.getLegendData(['a'])).toMatchObject([
    {
      name: 'a',
      icon: 'circle',
    },
  ]);
});

test('getRenderer', () => {
  expect(lib.getRenderer({ type: 'line' })).toBe('svg');
  expect(lib.getRenderer({ render: 'svg', type: 'bar' })).toBe('svg');
  expect(lib.getRenderer({ type: 'paralell' })).toBe('canvas');
  expect(lib.getRenderer({ histogram: '1', type: 'bar' })).toBe('canvas');
});

test('getG2LegendOption', () => {
  expect(
    lib.getG2LegendOption({
      legendShow: false,
    }),
  ).toMatchObject({ legend: false });

  expect(
    lib.getG2LegendOption({
      legendShow: true,
      legendAlign: 'center',
      legendPosition: 'bottom',
      legendOrient: 'horizontal',
    }),
  ).toMatchObject({
    legend: {
      layout: 'horizontal',
      position: 'bottom',
    },
  });

  expect(
    lib.getG2LegendOption({
      legendShow: true,
      legendAlign: 'top',
      legendPosition: 'bottom',
      legendOrient: 'horizontal',
    }),
  ).toMatchObject({
    legend: {
      layout: 'horizontal',
      position: 'bottom-top',
    },
  });

  expect(
    lib.getG2LegendOption({
      legendShow: true,
      legendAlign: 'left',
      legendPosition: 'right',
      legendOrient: 'horizontal',
    }),
  ).toMatchObject({
    legend: {
      layout: 'horizontal',
      position: 'right-top',
    },
  });

  expect(
    lib.getG2LegendOption({
      legendShow: true,
      legendAlign: 'right',
      legendPosition: 'right',
      legendOrient: 'horizontal',
    }),
  ).toMatchObject({
    legend: {
      layout: 'horizontal',
      position: 'right-bottom',
    },
  });

  expect(
    lib.getG2LegendOption({
      legendShow: true,
      legendAlign: 'center',
      legendPosition: 'center',
      legendOrient: 'horizontal',
    }),
  ).toMatchObject({
    legend: {
      layout: 'horizontal',
      position: '',
    },
  });

  expect(lib.getG2LegendOption({})).toMatchObject({
    legend: {
      layout: 'horizontal',
      position: 'top',
    },
  });
});

test('getLegendOption ', () => {
  expect(
    lib.getLegendOption({
      legendShow: false,
    }),
  ).toMatchObject({
    show: false,
    icon: 'circle',
    textStyle: { color: '#ddd' },
    top: 15,
    left: 'center',
    orient: 'horizontal',
  });

  const config = {
    show: true,
    icon: 'circle',
    textStyle: { color: '#ddd' },
  };
  expect(
    lib.getLegendOption({
      legendShow: true,
      legendAlign: 'center',
      legendPosition: 'bottom',
      legendOrient: 'horizontal',
    }),
  ).toMatchObject({
    ...config,
    bottom: 15,
    left: 'center',
    orient: 'horizontal',
  });

  expect(
    lib.getLegendOption({
      legendShow: true,
      legendAlign: 'top',
      legendPosition: 'bottom',
      legendOrient: 'horizontal',
    }),
  ).toMatchObject({
    ...config,
    bottom: 15,
    left: 'top',
    orient: 'horizontal',
  });

  expect(
    lib.getLegendOption({
      legendShow: true,
      legendAlign: 'left',
      legendPosition: 'right',
      legendOrient: 'horizontal',
    }),
  ).toMatchObject({
    ...config,
    top: 'top',
    orient: 'horizontal',
  });

  expect(
    lib.getLegendOption({
      legendShow: true,
      legendAlign: 'right',
      legendPosition: 'right',
      legendOrient: 'horizontal',
    }),
  ).toMatchObject({
    ...config,
    top: 'bottom',
    orient: 'horizontal',
  });

  expect(
    lib.getLegendOption({
      legendShow: true,
      legendAlign: 'right',
      legendPosition: 'center',
      legendOrient: 'horizontal',
    }),
  ).toMatchObject({
    ...config,
    top: 'bottom',
    orient: 'horizontal',
  });

  expect(lib.getLegendOption({})).toMatchObject({
    ...config,
    left: 'center',
    orient: 'horizontal',
  });
});

test('getFontConfig', () => {
  expect(lib.getFontConfig()).toMatchSnapshot();
});

test('getPositionConfig', () => {
  expect(lib.getPositionConfig().length).toBeGreaterThan(4);
});

test('isColor', () => {
  expect(lib.isColor('#223344')).toBeTruthy();
  expect(lib.isColor('rgb(2,3,4)')).toBeTruthy();
  expect(lib.isColor('rgba(2,3,4,1)')).toBeTruthy();
  expect(lib.isColor('rgbas(2,3,4,1)')).toBeFalsy();
});
