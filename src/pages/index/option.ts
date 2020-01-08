const data = [
  {
    x: '2019-03',
    y: 385,
    serie: 'Paris',
  },
  {
    x: '2019-04',
    y: 888,
    serie: 'Paris',
  },
  {
    x: '2019-05',
    y: 349,
    serie: 'Paris',
  },
  {
    x: '2019-06',
    y: 468,
    serie: 'Paris',
  },
  {
    x: '2019-07',
    y: 477,
    serie: 'Paris',
  },
  {
    x: '2019-03',
    y: 291,
    serie: 'London',
  },
  {
    x: '2019-04',
    y: 484,
    serie: 'London',
  },
  {
    x: '2019-05',
    y: 293,
    serie: 'London',
  },
  {
    x: '2019-06',
    y: 147,
    serie: 'London',
  },
  {
    x: '2019-07',
    y: 618,
    serie: 'London',
  },
];

let lineChart = {
  data,
  config: {
    configs: {
      title: {
        visible: true,
        text: '不同年份销量数据2',
      },
      smooth: true,
      label: {
        visible: true,
        type: 'line',
      },
      legend: {
        visible: false,
      },
      point: {
        visible: true,
        shape: 'point',
      },
      seriesField: 'serie',
      xField: 'x',
      yField: 'y',
    },
    type: 'Line',
  },
};

let barChart = {
  data: [
    {
      x: '2019-03',
      y: 385,
      serie: 'Paris',
    },
    {
      x: '2019-04',
      y: 888,
      serie: 'Paris',
    },
    {
      x: '2019-05',
      y: 349,
      serie: 'Paris',
    },
    {
      x: '2019-06',
      y: 468,
      serie: 'Paris',
    },
    {
      x: '2019-07',
      y: 477,
      serie: 'Paris',
    },
    {
      x: '2019-03',
      y: 291,
      serie: 'London',
    },
    {
      x: '2019-04',
      y: 484,
      serie: 'London',
    },
    {
      x: '2019-05',
      y: 293,
      serie: 'London',
    },
    {
      x: '2019-06',
      y: 147,
      serie: 'London',
    },
    {
      x: '2019-07',
      y: 618,
      serie: 'London',
    },
  ],
  config: {
    configs: {
      title: {
        visible: true,
        text: '百分比堆叠条形图',
      },
      description: {
        visible: true,
        text: '一个简单的百分比堆叠条形图',
      },
      legend: {
        flipPage: false,
      },
      xAxis: {
        label: {},
        title: {
          text: '百分比',
        },
      },
      yAxis: {
        title: {
          text: '日期',
        },
      },
      forceFit: false,
      xField: 'y',
      yField: 'x',
      stackField: 'serie',
    },
    type: 'PercentageStackBar',
  },
};

export default type => {
  switch (type) {
    case 'Line':
    default:
      return lineChart;
    case 'PercentageStackBar':
      return barChart;
  }
};
