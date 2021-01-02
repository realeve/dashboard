import type { Chart } from '@antv/g2';
import type {
  IChartMock,
  IChartConfig,
  IChartProps,
  IApiConfig,
} from '@/component/chartItem/interface';
import * as R from 'ramda';
import { getColors, getAntThemePanel } from '../g2plot/lib';

export const mock: IChartMock = {
  data: [
    { x: '07-01', min: 14.5, avg: 22.1, max: 27.8 },
    { x: '07-02', min: 15.5, avg: 23, max: 29.6 },
    { x: '07-03', min: 16.7, avg: 23.8, max: 30.7 },
    { x: '07-04', min: 16.5, avg: 21.4, max: 25 },
    { x: '07-05', min: 17.8, avg: 21.3, max: 25.7 },
    { x: '07-06', min: 13.5, avg: 18.3, max: 24.8 },
    { x: '07-07', min: 10.5, avg: 15.4, max: 21.4 },
    { x: '07-08', min: 9.2, avg: 16.4, max: 23.8 },
    { x: '07-09', min: 11.6, avg: 17.7, max: 21.8 },
    { x: '07-10', min: 10.7, avg: 17.5, max: 23.7 },
    { x: '07-11', min: 11, avg: 17.6, max: 23.3 },
    { x: '07-12', min: 11.6, avg: 17.7, max: 23.7 },
    { x: '07-13', min: 11.8, avg: 16.8, max: 20.7 },
    { x: '07-14', min: 12.6, avg: 17.7, max: 22.4 },
    { x: '07-15', min: 13.6, avg: 16.3, max: 19.6 },
    { x: '07-16', min: 11.4, avg: 17.8, max: 22.6 },
    { x: '07-17', min: 13.2, avg: 18.1, max: 25 },
    { x: '07-18', min: 14.2, avg: 17.2, max: 21.6 },
    { x: '07-19', min: 13.1, avg: 14.4, max: 17.1 },
    { x: '07-20', min: 12.2, avg: 13.7, max: 15.5 },
    { x: '07-21', min: 12, avg: 15.7, max: 20.8 },
    { x: '07-22', min: 12, avg: 14.6, max: 17.1 },
    { x: '07-23', min: 12.7, avg: 15.3, max: 18.3 },
    { x: '07-24', min: 12.4, avg: 15.3, max: 19.4 },
    { x: '07-25', min: 12.6, avg: 15.8, max: 19.9 },
    { x: '07-26', min: 11.9, avg: 15.2, max: 20.2 },
    { x: '07-27', min: 11, avg: 14.8, max: 19.3 },
    { x: '07-28', min: 10.8, avg: 14.4, max: 17.8 },
    { x: '07-29', min: 11.8, avg: 15, max: 18.5 },
    { x: '07-30', min: 10.8, avg: 13.6, max: 16.1 },
    { x: '07-31', min: 14.3, avg: 21.5, max: 27.7 },
  ],
  title: '某数据_MOCK数据',
  header: ['x', 'min', 'avg', 'max'],
  rows: 10,
  hash: 'mockdata',
};

export const config: IChartConfig[] = [
  {
    key: 'chartType',
    defaultValue: 'area',
    title: '图表类型',
    type: 'radio',
    option: [
      {
        title: '面积图',
        value: 'area',
      },
      {
        title: '柱状图',
        value: 'interval',
      },
    ],
  },
  getAntThemePanel(),
  {
    key: 'needRerverse',
    defaultValue: false,
    title: '翻转颜色表',
    type: 'switch',
  },
  {
    key: 'lineWidth',
    defaultValue: 2,
    title: '线宽',
    type: 'range',
    max: 14,
    min: 1,
    step: 1,
  },
  {
    key: 'pointSize',
    defaultValue: 4,
    title: '数据点大小',
    type: 'range',
    min: 0,
    max: 14,
    step: 1,
  },
  {
    key: 'coord',
    defaultValue: 'rect',
    title: '坐标系',
    type: 'radio',
    option: ['polar', 'rect'],
  },
  { title: '以下选项在极坐标系下有效', type: 'label' },
  {
    key: 'innerRadius',
    defaultValue: 0.2,
    title: '圆环大小',
    type: 'range',
    min: 0,
    max: 1,
    step: 0.1,
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/41_rangeLine.json',
  interval: 60,
  config: [
    {
      key: 'x',
      title: 'x 字段',
      defaultValue: 0,
      min: 0,
    },
    {
      key: 'y',
      title: 'y 字段',
      defaultValue: 1,
      min: 0,
    },
  ],
};

const transform = ({ data, x, min, avg, max }) =>
  R.map((item) => ({
    x: item[x],
    y: [item[min], item[max]],
    y2: item[avg],
  }))(data);

export const defaultOption = {
  padding: [20, 20, 40, 40],
  renderer: 'svg',
};

// g2 的默认组件需要2个参数，一是配置项，二是chart实例
export const onMount = (
  {
    data: { data: val, header },
    chartType = 'area',
    coord = 'rect',
    smooth = true,
    x: _x = 0,
    min: _min = 1,
    avg: _avg = 2,
    max: _max = 3,
    theme = 'cbpc',
    needRerverse,
    pointSize = 4,
    lineWidth = 2,
    innerRadius = 0.2,
  }: IChartProps,
  chart: Chart,
) => {
  const x = header[_x];
  const min = header[_min];
  const avg = header[_avg];
  const max = header[_max];
  const showAverage = !R.isNil(max);
  const isBar = chartType === 'interval';
  chart.scale({
    y: {
      sync: true,
      min: 0,
    },
  });

  chart.tooltip({
    shared: true,
    showMarkers: false,
    showCrosshairs: true,
  });

  const v1 = chart.createView({
    padding: 32,
  });

  const data = transform({ data: val, x, min, avg, max });

  v1.data(data);
  const colors = getColors(theme, needRerverse);
  const instance1 = v1[chartType]()
    .position('x*y')
    .color(colors[0])
    .style({
      opacity: showAverage ? 0.2 : 0.8,
    })
    .tooltip('y', (y) => {
      return {
        name: '数据区间',
        value: `${y?.[0]} 至 ${y?.[1]}`,
      };
    });

  if (isBar) {
    instance1.animate({
      appear: {
        animation: 'zoom-in',
      },
    });
  }

  if (smooth && !isBar) {
    instance1.shape('smooth');
  }
  const axis = {
    line: null,
    tickLine: null,
    grid: null,
  };
  if (coord === 'polar') {
    v1.coordinate(coord, {
      innerRadius,
    });
    v1.axis('x', axis);
  } else {
    v1.axis('y', axis);
  }
  let v2 = null;
  if (showAverage) {
    v2 = chart.createView({
      padding: 32,
    });
    const data2 = data.map((item) => ({ x: item.x, y: item.y2 }));
    v2.data(data2);
    v2.axis(false);
    const instance2 = v2
      .line()
      .position('x*y')
      .color(colors[0])
      .tooltip('y', (y) => {
        return {
          name: '均值',
          value: y,
        };
      })
      .style({ lineWidth });
    v2.point()
      .position('x*y')
      .size(pointSize)
      .shape('circle')
      .style({
        stroke: '#fff',
        lineWidth: 1,
        fillOpacity: 1,
      })
      .color(colors[0]);
    if (smooth) {
      instance2.shape('smooth');
    }
    // if (coord == 'polar') {
    //   v2.coordinate(coord, {
    //     innerRadius,
    //   });
    // }
  }

  chart.render();

  const onChange = ({ data: next }) => {
    const v1Data = transform({ data: next, x, avg, min, max });
    v1.changeData(v1Data);

    if (showAverage) {
      const data2 = data.map((item) => ({ x: item.x, y: item.y2 }));
      v2.changeData(data2);
    }
  };

  return onChange;
};

export default onMount;
