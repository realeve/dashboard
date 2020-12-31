import type { Chart } from '@antv/g2';
import type { IChartMock, IChartConfig, IApiConfig } from '@/component/chartItem/interface';
import * as R from 'ramda';
import { textColor } from '@/component/chartItem/option';
import { getColors, getAntThemePanel } from '../g2plot/lib';

export const mock: IChartMock = {
  data: [
    ['办公用品', '收纳', 340],
    ['办公用品', '笔', 20760],
    ['办公用品', '纸张', 28750],
    ['技术', '配件', 4090],
    ['技术', '电话', 9880],
    ['技术', '复印机', 40988],
    ['家具', '桌子', 14870],
    ['家具', '椅子', 37098],
    ['家具', '书架', 49099],
  ],
  header: ['类型', '国家', '数值'],
  title: '某数据_MOCK数据',
  rows: 10,
  hash: 'mockdata',
};

export const config: IChartConfig[] = [
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
  url: 'http://localhost:8000/mock/22_group_column.json',
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
  padding: [20, 90, 40, 80],
  renderer: 'svg',
};

// g2 的默认组件需要2个参数，一是配置项，二是chart实例
export const onMount = (
  {
    data: { data, header },
    legend: _legend = 0,
    x: _x = 1,
    y: _y = 2,
    theme = 'cbpc',
    needRerverse,
  },
  chart: Chart,
) => {
  const legend = String(_legend);
  const x = String(_x);
  const y = String(_y);
  chart.data(data);
  chart.scale({
    [y]: {
      alias: header[y],
      sync: true,
    },
  });

  chart.legend({
    position: 'right',
  });

  chart.axis(x, {
    label: {
      style: {
        fill: textColor,
        fontSize: 12,
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
  });
  chart.axis(y, {
    label: null,
    title: {
      offset: 30,
      style: {
        fontSize: 12,
        fontWeight: 300,
      },
    },
    grid: {
      line: {
        style: {
          lineWidth: 0,
        },
      },
    },
  });

  const color = getColors(theme, needRerverse);
  chart.coordinate().transpose();
  chart
    .interval()
    .position(`${x}*${y}`)
    .color(legend, color)
    .label(y, (text) => {
      return {
        style: {
          fill: textColor,
        },
        offset: 10,
        content: String(text).replace(/(\d)(?=(?:\d{3})+$)/g, '$1,'),
      };
    });

  const legendData: string[] = R.compose(R.uniq, R.pluck(legend))(data);

  legendData.forEach((legendItem) => {
    const item = data.find((dataItem) => dataItem[legend] === legendItem);
    chart.annotation().text({
      top: true,
      position: [item[x], 'min'],
      content: legendItem,
      style: {
        stroke: null,
        fill: '#c0c0c0',
        fontSize: 12,
        fontWeight: 300,
        textAlign: 'center',
      },
      offsetY: -40,
      offsetX: -70,
      rotate: Math.PI * -0.5,
    });
  });

  chart.render();
};

export default onMount;
