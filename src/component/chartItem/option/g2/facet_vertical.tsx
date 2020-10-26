import { Chart } from '@antv/g2';
import { IChartMock, IChartConfig, IChartProps, IApiConfig } from '@/component/chartItem/interface';

import { textColor } from '@/component/chartItem/option';

import * as R from 'ramda';

export let chartType = {
  bar: 'interval',
  line: 'line',
  point: 'point',
  column: 'interval',
};

export let mock: IChartMock = {
  data: [
    ['转基因作物种植面积', '印度', 10.8],
    ['转基因作物种植面积', '美国', 72.9],
    ['转基因作物种植面积', '中国', 2.8],
    ['转基因作物种植面积', '巴西', 49.1],
    ['转基因作物种植面积', '加拿大', 11.6],
    ['转基因作物种植面积', '阿根廷', 23.8],
    ['转基因作物种植面积', '巴基斯坦', 2.9],
    ['转基因作物种植面积', '南非', 2.7],
    ['转基因作物种植面积', '巴拉圭', 3.6],
    ['转基因作物种植面积', '乌拉圭', 1.3],
    ['耕地总面积', '印度', 175.4],
    ['耕地总面积', '美国', 165.2],
    ['耕地总面积', '中国', 108.4],
    ['耕地总面积', '巴西', 73.2],
    ['耕地总面积', '加拿大', 46.9],
    ['耕地总面积', '阿根廷', 38.6],
    ['耕地总面积', '巴基斯坦', 22],
    ['耕地总面积', '南非', 12.1],
    ['耕地总面积', '巴拉圭', 5.5],
    ['耕地总面积', '乌拉圭', 1.8],
    ['转基因作物种植占比（%）', '印度', 6.2],
    ['转基因作物种植占比（%）', '美国', 44.1],
    ['转基因作物种植占比（%）', '中国', 2.6],
    ['转基因作物种植占比（%）', '巴西', 67],
    ['转基因作物种植占比（%）', '加拿大', 24.7],
    ['转基因作物种植占比（%）', '阿根廷', 61.6],
    ['转基因作物种植占比（%）', '巴基斯坦', 13.2],
    ['转基因作物种植占比（%）', '南非', 22.4],
    ['转基因作物种植占比（%）', '巴拉圭', 65.7],
    ['转基因作物种植占比（%）', '乌拉圭', 73],
  ],
  header: ['类型', '国家', '数值'],
  title: '某数据_MOCK数据',
  rows: 10,
  hash: 'mockdata',
};

export const config: IChartConfig[] = [
  {
    key: 'barWidth',
    defaultValue: 20,
    title: '柱状宽度',
    type: 'range',
    min: 10,
    max: 40,
    step: 2,
  },
  {
    key: 'type',
    type: 'radio',
    defaultValue: 'line',
    option: [
      {
        title: '曲线图',
        value: 'line',
      },
      {
        title: '柱形图',
        value: 'bar',
      },
      {
        title: '散点图',
        value: 'point',
      },
    ],
  },
  {
    key: 'showLegend',
    title: '显示图例',
    type: 'switch',
    defaultValue: false,
  },
  {
    key: 'transpose',
    title: '转换X/Y轴',
    type: 'switch',
    defaultValue: false,
  },
  {
    type: 'label',
    title: 'X/Y切换需要刷新页面查看效果',
  },
  {
    key: 'cols',
    defaultValue: 4,
    title: '每行图表数量',
    type: 'range',
    min: 1,
    max: 10,
    step: 1,
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/21_facet_vertical.json',
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

export const defaultOption = (config) => {
  return {
    padding: config.transpose ? [20, 0, 0, 10] : [20, 20, 30, 0],
    renderer: 'svg',
  };
};

// g2 的默认组件需要2个参数，一是配置项，二是chart实例
export const onMount = (
  {
    data: { data },
    type = 'bar',
    legend = 0,
    x = 1,
    y = 2,
    showLegend = false,
    transpose = true,
    cols = 4,
  }: IChartProps,
  chart: Chart,
) => {
  legend = String(legend);
  x = String(x);
  y = String(y);

  chart.data(data);

  chart.scale({
    [legend]: {
      sync: type !== 'line',
    },
    [y]: {
      sync: true,
    },
  });

  chart.legend(
    showLegend && {
      position: 'top',
    },
  );

  let legendData = R.compose(R.uniq, R.pluck(legend))(data);

  let showTitle = !showLegend
    ? {
        title: {
          offsetY: 5,
          style: {
            shadowBlur: 0,
            stroke: null,
            strokeOpacity: 0,
            fontSize: 14,
            textAlign: 'center',
            fontWeight: 300,
            fill: textColor,
          },
        },
        showTitle: true,
      }
    : { showTitle: false };

  chart.scale(transpose ? y : x, {
    range: [0, 1],
  });

  transpose && chart.coordinate().transpose();

  chart.facet('list', {
    fields: [legend],
    ...showTitle,
    // 自动调整间距
    padding: [10, 0, transpose ? 0 : 30, 5 + 13 * 4],
    cols: Math.min(legendData.length, cols), // 超过4个换行
    eachView: function eachView(view, facet) {
      let coordinateAxis = ['line', 'bar', 'point'].includes(type);

      if (coordinateAxis || facet.columnIndex === 0) {
        view.axis(coordinateAxis ? y : x, {
          label: {
            style: {
              fill: textColor,
              fontSize: 12,
              strokeOpacity: 0,
            },
          },
          tickLine: {
            alignTick: true,
            length: 0,
          },
          line: {
            style: {
              lineWidth: 0,
            },
          },
          grid: null,
        });
      }

      let chartView = view[chartType[type]]()
        .shape(type === 'point' ? 'circle' : 'smooth')
        .style({
          opacity: 0.8,
        })
        .position(`${x}*${y}`)
        .color(legend);

      if (type !== 'point') {
        chartView.label(y, function (value) {
          const offset = ['line', 'bar'].includes(type) ? 10 : value < 25 ? 10 : -4;
          const fill = value < 25 ? textColor : '#ffffff';
          const textAlign = value < 25 ? 'start' : 'end';
          return {
            offset,
            style: {
              fill,
              textAlign,
              fontSize: 12,
              strokeOpacity: 0,
              fontWeight: 300,
              shadowBlur: 2,
              shadowColor: 'rgba(0, 0, 0, .45)',
            },
          };
        });
      }
    },
  });
  chart.render();
};

export default onMount;
