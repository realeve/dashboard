import { registerShape, Chart } from '@antv/g2';
import { IChartMock, IChartConfig, IChartProps, IApiConfig } from '@/component/chartItem/interface';
import * as R from 'ramda';
const isArray = arr => R.type(arr) == 'Array';

/**
 * g2 组件需要导入的函数
 *
 * 1.mock:MOCK数据
 * 2.config:组件相关设置项
 * 3.apiConfig:API相关配置项
 * 4.defaultOption:默认配置项，如padding/renderer等信息
 * 5.transformer:部分组件需要对数据做计算/转换，该函数用于数据转换，当data变更时触发 onMount(transformer(data))
 * 6.onMount/default：首次渲染的函数，不设置onMount时调用默认项
 *
 */
export let mock: IChartMock = {
  header: ['类别', '数值'],
  data: [
    ['日用品', 120],
    ['伙食费', 900],
    ['交通费', 200],
    ['水电费', 300],
    ['房租', 1200],
    ['商场消费', 1000],
    ['应酬红包', -200],
  ],
  title: '瀑布图示例_mock',
  rows: 14,
  hash: 'mockdata',
};

/**
 * 组件自身配置项
 *
 * 需要对外暴露的配置信息均定义在此处
 */
export const config: IChartConfig[] = [
  {
    key: 'color_rising',
    defaultValue: 'rgb(240,102,74)',
    title: '颜色_正值',
    type: 'purecolor',
  },
  {
    key: 'color_falling',
    defaultValue: 'rgb(48,191,120)',
    title: '颜色_负值',
    type: 'purecolor',
  },
  {
    key: 'color_total',
    defaultValue: '#1890ff',
    title: '颜色_合计',
    type: 'purecolor',
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/03_waterfall.json',
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
  renderer: 'svg', // https://antv-g2.gitee.io/zh/docs/manual/tutorial/renderer
};

function getRectPath(points) {
  const path = [];
  for (let i = 0; i < points.length; i++) {
    const point = points[i];
    if (point) {
      const action = i === 0 ? 'M' : 'L';
      path.push([action, point.x, point.y]);
    }
  }

  const first = points[0];
  path.push(['L', first.x, first.y]);
  path.push(['z']);
  return path;
}

function getFillAttrs(cfg) {
  const defaultAttrs = {
    lineWidth: 0,
    fill: '#1890FF',
    fillOpacity: 0.85,
  };

  return {
    ...defaultAttrs,
    ...cfg.style,
    fill: cfg.color,
    stroke: cfg.color,
    fillOpacity: cfg.opacity,
  };
}

// 自定义 Shape
registerShape('interval', 'waterfall', {
  draw(cfg, container) {
    const attrs = getFillAttrs(cfg);
    let rectPath = getRectPath(cfg.points);
    rectPath = this.parsePath(rectPath);

    const group = container.addGroup();
    group.addShape('path', {
      attrs: {
        ...attrs,
        path: rectPath,
      },
    });

    if (cfg.nextPoints) {
      let linkPath = [
        ['M', cfg.points[2].x, cfg.points[2].y],
        ['L', cfg.nextPoints[0].x, cfg.nextPoints[0].y],
      ];

      if (cfg.nextPoints[0].y === 0) {
        linkPath[1] = ['L', cfg.nextPoints[1].x, cfg.nextPoints[1].y];
      }
      linkPath = this.parsePath(linkPath);
      group.addShape('path', {
        attrs: {
          path: linkPath,
          stroke: '#8c8c8c',
          lineDash: [4, 2],
        },
      });
    }

    return group;
  },
});

export const handleAxisStyle = (chart, { x, y }) => {
  let textColor = 'rgba(255, 255, 255, 0.95)';

  let fieldColor = {
    label: {
      textStyle: {
        fill: textColor,
      },
    },
  };

  chart.axis(x, {
    tickLine: {
      visible: false,
    },
    ...fieldColor,
  });
  chart.axis(y, {
    grid: {
      lineStyle: {
        stroke: 'rgba(255, 255, 255, 0.15)',
        lineWidth: 1,
        lineDash: [0, 0],
      },
    },
    ...fieldColor,
  });
};

// 数据转换器，外部数据变更时，将计算结果注入至source
export const transformer = ({ data: val, x, y }) => {
  let sum = val.reduce((a, b) => a + b[1], 0);
  let data = [...R.clone(val), ['总计', sum]];

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (i > 0 && i < data.length - 1) {
      if (isArray(data[i - 1][y])) {
        item[y] = [data[i - 1][y][1], item[y] + data[i - 1][y][1]];
      } else {
        item[y] = [data[i - 1][y], item[y] + data[i - 1][y]];
      }
    }
  }
  return { data };
};

// g2 的默认组件需要2个参数，一是配置项，二是chart实例
export const onMount = (
  {
    data: { data: val, header },
    x = 0,
    y = 1,
    color_falling = 'rgb(240,102,74)', //正值柱形填充颜色
    color_rising = 'rgb(48,191,120)', //负值柱形填充颜色
    color_total = '#1890ff', // 总计值柱形填充颜色，可选
  }: IChartProps,
  chart: Chart,
) => {
  let { data } = transformer({ data: val, x, y });
  chart.data(data);

  handleAxisStyle(chart, { x, y });

  chart.scale(y, { nice: true });
  chart.legend(false);
  chart
    .interval()
    .position(`${x}*${y}`)
    .color(`${x}*${y}`, (type, money) => {
      if (type === '总计') {
        return color_total;
      }
      if (isArray(money) && money[0] - money[1] > 0) {
        return color_falling;
      }
      return color_rising;
    })
    .tooltip(`${x}*${y}`, (type, value) => {
      if (isArray(value)) {
        return {
          name: header[x],
          value: value[1] - value[0],
        };
      }
      return {
        name: header[x],
        value: value,
      };
    })
    .shape('waterfall');

  chart.render();
};

export default onMount;
