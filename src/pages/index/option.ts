const getLineOption = () => {
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
  let configs = {
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
  };

  return {
    data,
    config: {
      configs,
      type: 'Line',
    },
  };
};

const getGroupBarOption = () => {
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
  const config = {
    title: {
      visible: true,
      text: '簇状柱形图',
    },
    description: {
      visible: true,
      text: '一个基本的簇状柱形图',
    },
    legend: {},
    xAxis: {
      title: {
        text: '日期',
      },
    },
    yAxis: {
      title: {
        text: '数值',
      },
    },
    xField: 'x',
    yField: 'y',
    groupField: 'serie',
  };
  return {
    data,
    config: {
      configs: config,
      type: 'GroupColumn',
    },
  };
};

const getStackColumnOption = () => {
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
  const config = {
    title: {
      visible: true,
      text: '堆叠柱形图',
    },
    description: {
      visible: true,
      text: '一个基本的堆叠柱形图',
    },
    legend: {
      position: 'top-right',
      flipPage: true,
    },
    xAxis: {
      title: {
        visible: false,
        text: '日期',
      },
    },
    yAxis: {
      label: {
        offset: 0,
      },
      title: {
        text: '数值',
      },
    },
    label: {
      visible: true,
      position: 'top',
    },
    xField: 'x',
    yField: 'y',
    stackField: 'serie',
  };

  return {
    data,
    config: {
      configs: config,
      type: 'StackColumn',
    },
  };
};

export default type => {
  switch (type) {
    case 'Line':
    default:
      return getLineOption();
    case 'GroupColumn':
      return getGroupBarOption();
    case 'StackColumn':
      return getStackColumnOption();
  }
};
