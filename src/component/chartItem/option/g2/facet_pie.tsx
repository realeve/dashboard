import { IChartMock, IChartConfig, IApiConfig } from '@/component/chartItem/interface';
import * as lib from '@/component/chartItem/option/lib';

import { getColors, getAntThemePanel } from '../g2plot/lib';
import { ShapeAttrs } from '@antv/g-base/lib/types';

export let mock: IChartMock = {
  data: [
    ['2A', 92.4],
    ['3A', 88.6],
    ['6T', 77.6],
    ['7T', 78.6],
  ],
  title: 'facet_pie_MOCK数据',
  header: ['品种', '好品率'],
  rows: 10,
  hash: 'mockdata',
};

export const config: IChartConfig[] = [
  {
    key: 'facet',
    title: '分面类型',
    type: 'radio',
    defaultValue: 'list',
    option: [
      {
        title: '列分面',
        value: 'rect',
      },
      {
        title: '列表',
        value: 'list',
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
    key: 'outterPercent',
    defaultValue: 100,
    title: '外径比例',
    type: 'range',
    min: 5,
    max: 100,
    step: 5,
  },
  {
    key: 'innerPercent',
    defaultValue: 60,
    title: '内径比例',
    type: 'range',
    min: 0,
    max: 95,
    step: 1,
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
  ...lib.getFontConfig(16, '#ffffff'),
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/17_facet_pie.json',
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
  padding: [0, 0, 0, 0],
  renderer: 'svg',
};

// g2 的默认组件需要2个参数，一是配置项，二是chart实例
export const onMount = (
  {
    data: { data: val, header },
    cols = 4,
    x = 0,
    y = 1,
    max = 100,
    innerPercent = 60,
    facet = 'list',
    outterPercent = 100,
    fontSize = 16,
    fontWeight = 'normal',
    fontColor = '#ffffff',
    theme = 'cbpc',
    needRerverse,
  },
  chart,
) => {
  const data = val.map((item) => ({ type: item[x], value: item[y] }));

  chart.data(data);
  chart.legend(false);
  //别名
  chart.scale({
    type: {
      alias: header[x],
    },
    value: {
      alias: header[y],
    },
  });

  chart.tooltip(false);
  let colors = getColors(theme, needRerverse);
  chart.facet(facet, {
    fields: ['type'],
    cols,
    showTitle: false,
    eachView: function eachView(view, facet) {
      const data = facet.data;
      data.push({ type: '其他', value: max - data[0].value });
      view.data(data);
      view.coordinate('theta', {
        radius: outterPercent / 100,
        innerRadius: innerPercent / 100,
      });

      // list 模式下，需要手工计算行列
      let idx = facet.rowIndex * facet.columnValuesLength + facet.columnIndex;

      view
        .interval()
        .adjust('stack')
        .position('value')
        .color('type', [colors[idx], '#eceef133'])
        .style({
          opacity: 1,
        });
      view.interaction('element-active');

      view.annotation().text({
        position: ['50%', '50%'],
        content: (obj) => {
          return obj[0].type + '\n' + obj[0].value + '%';
        },
        style: {
          fill: fontColor,
          fontSize,
          fontWeight,
          stroke: null,
          textAlign: 'center',
        } as ShapeAttrs,
      });
    },
  });

  chart.render();
};

export default onMount;
