import * as lib from './lib';

const Alldata = {
  data: [
    {
      PZ: 'PZ',
      GX: 'GX1',
      JT: 'JT1',
      CL: '200',
    },
    {
      PZ: 'PZ',
      GX: 'GX2',
      JT: 'JT2',
      CL: '137',
    },
    {
      PZ: 'PZ',
      GX: 'GX3',
      JT: 'JT3',
      CL: '128',
    },
    {
      PZ: 'PZ',
      GX: 'GX1',
      JT: 'JH',
      CL: '240',
    },
    {
      PZ: 'PZ',
      GX: 'GX2',
      JT: 'JH',
      CL: '230',
    },
  ],
};

const data = {
  data: [
    {
      PZ: 'PZ',
      GX: 'GX1',
      JT: 'JT1',
      CL: '200',
    },
    {
      PZ: 'PZ',
      GX: 'GX2',
      JT: 'JT2',
      CL: '137',
    },
    {
      PZ: 'PZ',
      GX: 'GX2',
      JT: 'JT3',
      CL: '128',
    },
  ],
};

const plan = ['GX1', 'GX2'];

test('获取CL最大值', () => {
  expect(lib.getAxisMaxNum({ data: Alldata.data, y: 'CL' })).toBe(240);
});

test('获取planFormatter', () => {
  expect(
    lib.planTooltipFormatter({
      e: [
        {
          axisValue: 'GX1',
          seriesName: 'JH',
          value: 240,
          name: 'GX1',
          marker:
            '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#e23;"></span>',
          name: 'GX1',
        },
        {
          axisValue: 'GX1',
          seriesName: 'JH1',
          value: 230,
          name: 'GX1',
          marker:
            '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#e23;"></span>',
        },
      ],
      planName: 'JH',
    }),
  ).toEqual(
    `<div><b>GX1</b><br/><div><span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:#e23;"></span> GX1: 230</div><div style="border-top:1px solid #ddd;margin-top:8px;padding-top:8px">合计: 230</div><div>JH: 240</div></div>`,
  );
});

test('获取JH数据', () => {
  const res = lib.handlePlanData({
    data: Alldata.data,
    legend: 'JT',
    planName: 'JH',
    barWidth: 30,
    xAxisLength: plan.length,
    y: 'CL',
    isReverse: true,
  });
  expect(res).toMatchObject({
    name: 'JH',
    type: 'line',
    data: [240, 230],
    lineStyle: {
      width: 0,
    },
    color: '#e23',
    symbolSize: [80, 3],
    symbol: 'rect',
    symbolOffset: [-8, 0],
    label: {
      show: true,
      position: 'center',
      offset: [0, -12],
      color: '#fff',
    },
  });
  expect(
    res.label.formatter({
      dataIndex: 2,
      value: 10,
    }),
  ).toBe(10);
  expect(
    res.label.formatter({
      dataIndex: 1,
      value: 10,
    }),
  ).toBe('JH\n10');
});

test('获取y轴数据', () => {
  expect(
    lib.handleData({
      data: data.data,
      xAxisData: ['GX1', 'GX2'],
      legend: 'JT',
      x: 'GX',
      y: 'CL',
    }),
  ).toEqual([
    {
      data: [
        { name: 'JT1', value: 200 },
        { name: 'JT2', value: 137 },
      ],
    },
    { data: ['-', { name: 'JT3', value: 128 }] },
  ]);
});
