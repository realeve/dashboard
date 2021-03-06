import type { Chart } from '@antv/g2';
import { textColor } from '../index';
import * as R from 'ramda';
import type {
  IChartMock,
  IChartConfig,
  IChartProps,
  IApiConfig,
} from '@/component/chartItem/interface';
import { getColors, getAntThemePanel } from '../g2plot/lib';

export const mock: IChartMock = {
  data: [
    ['2016 年', '乌拉圭', 1.3],
    ['2017 年', '乌拉圭', 1.8],
    ['2016 年', '巴拉圭', 3.6],
    ['2017 年', '巴拉圭', 5.5],
    ['2016 年', '南非', 3.7],
    ['2017 年', '南非', 12.1],
    ['2016 年', '巴基', 2.9],
    ['2017 年', '巴基', 22],
    ['2016 年', '阿根廷', 23.8],
    ['2017 年', '阿根廷', 38.6],
    ['2016 年', '加拿大', 11.6],
    ['2017 年', '加拿大', 46.9],
    ['2016 年', '巴西', 49.1],
    ['2017 年', '巴西', 73.2],
    ['2016 年', '中国', 2.8],
    ['2017 年', '中国', 108.4],
    ['2016 年', '美国', 72.9],
    ['2017 年', '美国', 165.2],
    ['2016 年', '印度', 49.1],
    ['2017 年', '印度', 175.4],
  ],
  header: ['类型', '国家', '数值'],
  title: '某数据_MOCK数据',
  rows: 10,
  hash: 'mockdata',
};

export const config: IChartConfig[] = [
  { type: 'label', title: '切换方向需要刷新页面' },
  {
    key: 'direction',
    title: '图表布局',
    type: 'radio',
    defaultValue: 'vertical',
    option: [
      {
        title: '纵向',
        value: 'vertical',
      },
      {
        title: '横向',
        value: 'horizontal',
      },
    ],
  },
  {
    key: 'showLegend',
    title: '显示图例',
    type: 'switch',
    defaultValue: false,
  },
  getAntThemePanel(),
  {
    key: 'needRerverse',
    defaultValue: false,
    title: '翻转颜色表',
    type: 'switch',
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: '/mock/18_whirlwind.json',
  interval: 60,
  config: [
    {
      key: 'legend',
      title: 'legend 字段',
      defaultValue: 0,
      min: 0,
    },
    {
      key: 'x',
      title: 'x 字段',
      defaultValue: 1,
      min: 0,
    },
    {
      key: 'y',
      title: 'y 字段',
      defaultValue: 2,
      min: 0,
    },
  ],
};

export const defaultOption = {
  padding: [20, 20, 40, 40],
  renderer: 'svg',
};

// g2 的默认组件需要2个参数，一是配置项，二是chart实例
export const onMount = (
  {
    data: { data, header },
    legend: _legend = 0,
    x: _x = 1,
    y: _y = 2,
    showLegend = false,
    direction = 'vertical',
    theme = 'cbpc',
    needRerverse,
  }: IChartProps,
  chart: Chart,
) => {
  const legend = String(_legend);
  const x = String(_x);
  const y = String(_y);

  const isVertical = direction === 'vertical';
  const arr = R.pluck<number[]>([x], data);
  const xLen = R.map<any[], number>((item) => item.length)(arr);

  const yConfig = {
    nice: false,
    alias: header[y],
    sync: true,
  };

  const content = (obj) => Number(obj[y]);

  chart.scale({
    [y]: yConfig,
    [legend]: {
      sync: true,
    },
  });

  chart.data(data);

  chart.axis(
    y,
    isVertical
      ? false
      : {
          grid: null,
          label: {
            style: {
              fill: textColor, // 文本的颜色
            },
          },
        },
  );

  const textStyle = {
    fill: textColor, // 文本的颜色
    fontSize: 12,
  };

  chart.axis(x, {
    line: null,
    tickLine: null,
    label: {
      style: isVertical
        ? textStyle
        : {
            ...textStyle,
            textAlign: isVertical ? 'right' : 'center', // 文本对齐方向，可取值为： start middle end
            textBaseline: 'middle', // 文本基准线，可取 top middle bottom，默认为middle
          },
      offset: isVertical ? 35 : 15,
    },
  });

  chart.legend(
    showLegend && {
      position: 'bottom',
    },
  );

  const showTitle = !showLegend
    ? {
        title: {
          offsetY: 5,
          style: {
            stroke: null,
            fontSize: 14,
            textAlign: 'center',
            fontWeight: 300,
            fill: textColor,
          },
        },
        showTitle: true,
      }
    : { showTitle: false };

  if (isVertical) {
    chart.coordinate().transpose();
  }

  const color = getColors(theme, needRerverse);
  chart.facet('mirror', {
    fields: [legend],
    transpose: isVertical,
    ...showTitle,
    // 自动调整两侧间距
    padding: isVertical ? [0, 45 + 5 * Math.max(...xLen), 0, 0] : [0, 0, 30, 0],
    eachView: function eachView(view, facet) {
      const facetIndex = facet[isVertical ? 'columnIndex' : 'rowIndex'];

      view
        .interval()
        .position(`${x}*${y}`)
        .color(legend, color)
        .label(y, () => {
          if (!isVertical) {
            return {
              content,
              position: 'top',
              offsetY: facetIndex === 1 ? 30 : 7,
              style: {
                fill: textColor,
              },
            };
          }

          return {
            content,
            position: 'right',
            offset: facetIndex === 0 ? -4 : 4,
            style: {
              fill: textColor,
              shadowBlur: 0,
              shadowColor: 'rgba(0, 0, 0, .45)',
              textAlign: facetIndex === 0 ? 'end' : 'start',
            },
          };
        });
    },
  });

  chart.render();
};

export default onMount;
