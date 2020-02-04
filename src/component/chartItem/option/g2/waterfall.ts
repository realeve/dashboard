import { Util, Shape, Global } from '@antv/g2';
// import { textColor } from '../index';
let textColor = 'rgba(255, 255, 255, 0.45)';
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
  const defaultAttrs = Global.shape.interval;
  const attrs = Util.mix({}, defaultAttrs, cfg.style, {
    fill: cfg.color,
    stroke: cfg.color,
    fillOpacity: cfg.opacity,
  });
  return attrs;
}

// 数据转换器，外部数据变更时，将计算结果注入至source
export const transformer = ({ data: val, x, y }) => {
  let sum = val.reduce((a, b) => a + b[1], 0);
  let data = [...val, ['总计', sum]];

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (i > 0 && i < data.length - 1) {
      if (Util.isArray(data[i - 1][y])) {
        item[y] = [data[i - 1][y][1], item[y] + data[i - 1][y][1]];
      } else {
        item[y] = [data[i - 1][y], item[y] + data[i - 1][y]];
      }
    }
  }
  return { data };
};

export const onMount = (
  {
    data: val,
    x = 0,
    y = 1,
    header,
    color = {
      rising: 'rgb(240,102,74)', //正值柱形填充颜色
      falling: 'rgb(48,191,120)', //负值柱形填充颜色
      total: '#1890ff', // 总计值柱形填充颜色，可选
    },
  },
  chart,
) => {
  Shape.registerShape('interval', 'waterfall', {
    draw(cfg, container) {
      const attrs = getFillAttrs(cfg);
      let rectPath = getRectPath(cfg.points);
      rectPath = this.parsePath(rectPath);
      const interval = container.addShape('path', {
        attrs: Util.mix(attrs, {
          path: rectPath,
        }),
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
        container.addShape('path', {
          attrs: {
            path: linkPath,
            stroke: '#8c8c8c',
            lineDash: [4, 2],
          },
        });
      }

      return interval;
    },
  });

  let { data } = transformer({ data: val, x, y });

  chart.source(data);
  // 自定义图例
  chart.legend({
    custom: true,
    clickable: false,
    items: [
      { value: header[x], marker: { symbol: 'square', fill: '#1890FF', radius: 5 } },
      { value: '总计', marker: { symbol: 'square', fill: '#8c8c8c', radius: 5 } },
    ],
  });

  let fieldColor = {
    label: {
      textStyle: {
        fill: textColor,
      },
    },
  };

  chart.axis(x, fieldColor);
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

  chart
    .interval()
    .position(`${x}*${y}`)
    .color(`${x}*${y}`, (type, money) => {
      if (type === '总计') {
        return color.total;
      }
      if (Util.isArray(money) && money[0] - money[1] > 0) {
        return color.rising;
      }
      return color.falling;
    })
    .tooltip(y, value => {
      if (Util.isArray(value)) {
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
