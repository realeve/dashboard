import { Chart, getTheme, Util } from '@antv/g2';
import { IChartMock, IChartConfig, IChartProps, IApiConfig } from '@/component/chartItem/interface';
const defaultTheme = getTheme();
import { getPercent } from '../lib';

// 注意：该图形只支持 object的data项，不支持数组，在饼图下渲染异常
export let mock: IChartMock = {
  data: [
    { type: '分类一', value: 47 },
    { type: '分类二', value: 35 },
    { type: '分类三', value: 28 },
    { type: '分类四', value: 15 },
    { type: '分类五', value: 10 },
    { type: 'Other', value: 15 },
  ],
  header: ['type', 'value'],
  title: '玫瑰图_MOCK数据',
  rows: 10,
  hash: 'mockdata',
};

export const config: IChartConfig[] = [
  {
    key: 'innerPercent',
    defaultValue: 20,
    title: '内圆',
    type: 'range',
    min: 0,
    max: 95,
    step: 1,
  },
  {
    key: 'startAngle',
    defaultValue: 180,
    title: '开始角度',
    type: 'range',
    min: 0,
    max: 360,
    step: 15,
  },
  {
    key: 'endAngle',
    defaultValue: 360,
    title: '结束角度',
    type: 'range',
    min: 0,
    max: 360,
    step: 15,
  },
  {
    key: 'legend',
    defaultValue: false,
    title: '显示legend',
    type: 'switch',
  },
  {
    key: 'color',
    defaultValue: 'gardient',
    title: '颜色模式',
    type: 'radio',
    option: [
      {
        title: '渐变',
        value: '#40a9ff-#0050b3',
      },
      {
        title: '彩色',
        value: 'rainbow',
      },
      {
        title: '纯色',
        value: '#1890FF',
      },
    ],
  },
  {
    key: 'fontSize',
    defaultValue: 16,
    title: '字号',
    type: 'range',
    min: 10,
    max: 60,
    step: 2,
  },
  {
    key: 'intervalData',
    defaultValue: true,
    title: '变换数据',
    type: 'switch',
  },
  {
    type: 'divider',
    title: '坐标系切换需刷新页面',
  },
  {
    key: 'coordinate',
    defaultValue: 'polar',
    title: '坐标系',
    type: 'radio',
    option: [
      {
        title: 'polar',
        value: 'polar',
      },
      {
        title: 'theta',
        value: 'theta',
      },
      {
        title: 'rect',
        value: 'rect',
      },
    ],
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/16_g2_pie_rose.json',
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

export const defaultOption = {
  renderer: 'svg',
};

let intervalId: null | NodeJS.Timeout = null;
// g2 的默认组件需要2个参数，一是配置项，二是chart实例
export const onMount = (
  {
    data: { data: _data, header },
    x: _x = 0,
    y: _y = 1,
    innerPercent = 20,
    startAngle = 180,
    endAngle = 360,
    legend = true,
    color = 'rainbow',
    intervalData = true,
    coordinate = 'polar',
    fontSize = 16,
  }: IChartProps,
  chart: Chart,
) => {
  if (intervalId) {
    intervalId = null;
    window.clearInterval(intervalId);
  }
  let data = getPercent({ data: _data, y: _y, header });

  chart.data(data);
  let x = header[_x],
    y = header[_y];

  chart.coordinate(coordinate, {
    innerRadius: innerPercent / 100,
    startAngle: startAngle === 0 ? 0 : Math.PI * (startAngle / 180), // 起始角度
    endAngle: endAngle === 0 ? 0 : Math.PI * (endAngle / 180), // 结束角度
  });

  if (coordinate === 'polar') chart.axis(false);

  let interval = chart
    .interval()
    .position(coordinate === 'theta' ? `${y}` : `${x}*${y}`)
    .label(String(x), (val) => ({
      offset: -30,
      style: {
        fill: 'white',
        fontSize,
      },
      content: (obj) => {
        return obj[x] + '\n' + obj.percent + '%';
      },
    }))
    .style({
      lineWidth: 1,
      stroke: '#fff',
    })
    .state({
      active: {
        style: (element) => {
          const shape = element.shape;
          return {
            matrix: Util.zoom(shape, 1.1),
          };
        },
      },
    });

  if (coordinate === 'theta') {
    interval.adjust('stack');
  }

  interval.color(String(x), color === 'rainbow' ? defaultTheme.colors10 : color);

  chart.tooltip({
    showTitle: false,
    showMarkers: false,
  });

  chart.legend(legend);

  chart.interaction('element-single-selected');
  // chart.interaction('element-highlight');

  chart.render();
  return;
  var idx = data.length;
  if (!intervalData) {
    return;
  }
  intervalId = setInterval(() => {
    chart.changeData(data.slice(0, idx));
    idx--;
    if (idx < 2) {
      idx = data.length;
    }
  }, 3000);
};

export default onMount;
