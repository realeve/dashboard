import type { Chart } from '@antv/g2';
import type {
  IChartMock,
  IChartConfig,
  IChartProps,
  IApiConfig,
} from '@/component/chartItem/interface';

import { getColors, getAntThemePanel } from '../../g2plot/lib';

// 可考虑用echarts实现  treemap,这样无需引入 data-set
// 参考 @antv/data-set 源码 https://github.com/antvis/data-set/blob/master/src/transform/hierarchy/treemap.ts
import type { Node } from './transform';
import { transform } from './transform';

export const mock: IChartMock = {
  data: [
    { name: '分类 1', value: 560 },
    { name: '分类 2', value: 500 },
    { name: '分类 3', value: 150 },
    { name: '分类 4', value: 140 },
    { name: '分类 5', value: 115 },
    { name: '分类 6', value: 95 },
    { name: '分类 7', value: 90 },
    { name: '分类 8', value: 75 },
    { name: '分类 9', value: 98 },
    { name: '分类 10', value: 60 },
    { name: '分类 11', value: 45 },
    { name: '分类 12', value: 40 },
  ],
  title: '某数据_MOCK数据',
  header: ['name', 'value'],
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
  url: '/mock/42_treemap.json',
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
  padding: [20, 20, 40, 40],
  renderer: 'svg',
};

const getNodes = ({ data, x, y }) => {
  const dv: typeof Node = transform(
    { dataType: 'hierarchy', children: data },
    {
      field: y,
      tile: 'treemapResquarify',
      as: ['x', 'y'],
    },
  );

  // 将 DataSet 处理后的结果转换为 G2 接受的数据
  const nodes = [];
  const nodeList = dv.getAllNodes();

  nodeList.forEach((node) => {
    if (node.data.name === 'root') {
      return;
    }
    const eachNode: any = {
      name: node.data[x],
      x: node.x,
      y: node.y,
      value: node.data[y],
    };

    nodes.push(eachNode);
  });
  return nodes;
};

// 数据转换器，外部数据变更时，将计算结果注入至source
export const transformer = ({ data, header, x, y }) => {
  const nodes = getNodes({ data, x: header[x], y: header[y] });
  return { data: nodes };
};

// g2 的默认组件需要2个参数，一是配置项，二是chart实例
export const onMount = (
  {
    data: { data, header },
    x: _x = 0,
    y: _y = 1,
    coord = 'rect',
    theme = 'cbpc',
    needRerverse,
    innerRadius = 0.2,
  }: IChartProps,
  chart: Chart,
) => {
  const colors = getColors(theme, needRerverse);
  const x = header[_x];
  const y = header[_y];

  const nodes = getNodes({ data, x, y });

  chart.data(nodes);

  chart.scale({
    x: {
      nice: true,
    },
    y: {
      nice: true,
    },
  });

  chart.axis(false);

  if (coord === 'polar') {
    chart.coordinate(coord, {
      innerRadius,
    });
  }

  chart.legend(false);
  chart.tooltip({
    showTitle: false,
    showMarkers: false,
    itemTpl: `<li style="list-style: none;height:30px;">{name}：{value}</span</li>`,
  });
  chart
    .polygon()
    .position('x*y')
    .color(x, colors)
    .tooltip(`${x}*${y}`, (name, value) => {
      return {
        name,
        value,
      };
    })
    .style({
      lineWidth: 1,
      stroke: '#fff',
    })
    .label(x, {
      offset: 0,
      style: {
        textBaseline: 'middle',
      },
      content: (obj) => {
        if (obj[x] !== 'root') {
          return obj[x];
        }
        return null;
      },
    });
  chart.interaction('element-active');

  chart.render();
};

export default onMount;
