import { IChartMock, IChartConfig, IApiConfig } from '@/component/chartItem/interface';
// import { IG2Config } from '@/component/chartItem/option/g2plot/config';
import { textColor } from '../index';
import * as R from 'ramda';
import React from 'react';
import { getColors, getAntThemePanel } from '../g2plot/lib';

import { BarChartOutlined, PieChartOutlined } from '@ant-design/icons';

export let mock: IChartMock = {
  data: [
    ['微博1', 13.33],
    ['微博2', 23.33],
    ['微博3', 36.33],
    ['微博4', 30.33],
    ['论坛', 1.77],
    ['网站', 1.44],
    ['微信', 1.12],
    ['客户端', 1.05],
    ['新闻', 0.81],
    ['视频', 0.39],
    ['博客', 0.37],
    ['报刊', 0.17],
  ],
  header: ['类型', '数值'],
  title: '带详情的饼图_MOCK数据',
  rows: 10,
  hash: 'mockdata',
};

export const config: IChartConfig[] = [
  {
    type: 'label',
    title: '已知bug:属性设置后需要刷新页面查看效果',
  },
  {
    key: 'otherChart',
    title: '详情图表类型',
    type: 'radio',
    defaultValue: 'bar',
    option: [
      {
        title: <PieChartOutlined style={{ color: '#fff' }} />,
        value: 'pie',
      },
      {
        title: <BarChartOutlined style={{ color: '#fff' }} />,
        value: 'bar',
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
    key: 'pieItem',
    defaultValue: 6,
    title: '饼数量',
    type: 'range',
    min: 1,
    max: 12,
    step: 1,
  },
  {
    key: 'innerPercent',
    defaultValue: 10,
    title: '内径比例',
    type: 'range',
    min: 0,
    max: 95,
    step: 1,
  },
  {
    key: 'fontSize',
    defaultValue: 14,
    title: '字号',
    type: 'range',
    min: 10,
    max: 60,
    step: 2,
  },
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: 'http://localhost:8000/mock/14_pie_detail.json',
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
  padding: [0, 30, 0, 0],
  renderer: 'svg',
};

export const transformer = ({ data: { data: val }, x, y, pieItem }, chart) => {
  let _data = R.map((item) => ({ type: item[x], value: item[y], percent: 0 }))(val);
  _data = _data.sort((b, a) => a.value - b.value);

  let sum = _data.reduce((a, b) => a + b.value, 0);
  _data = _data.map((item) => {
    item.percent = item.value / sum;
    return item;
  });

  // 前N个数值
  let data = R.take(pieItem, _data);
  let other = R.takeLast(_data.length - pieItem, _data);

  let otherRatio = other.reduce((a, b) => a + b.percent, 0);
  let otherVal = other.reduce((a, b) => a + b.value, 0);

  const otherOffsetAngle = otherRatio * Math.PI; // other 占的角度的一半

  data.push({ type: '其他', value: otherVal, percent: otherRatio });
  return { data, other, otherOffsetAngle };
};

interface IPieOther {
  pieItem?: number;
  otherChart?: 'pie' | 'bar';
  theme: string | number;
  [key: string]: any;
}

export const onMount = (
  {
    data: val,
    x = 0,
    y = 1,
    pieItem = 6,
    otherChart = 'pie',
    innerPercent = 10,
    fontSize = 20,
    theme = 'cbpc',
    needRerverse,
  }: IPieOther,
  chart,
) => {
  let { data, other, otherOffsetAngle } = transformer({ data: val, x, y, pieItem }, chart);

  chart.legend(false);
  chart.tooltip({
    showMarkers: false,
  });

  const view1 = chart.createView({
    region: {
      start: {
        x: 0,
        y: 0,
      },
      end: {
        x: 0.5,
        y: 1,
      },
    },
  });

  view1.coordinate('theta', {
    radius: 0.95,
    innerRadius: innerPercent / 100,
    startAngle: 0 + otherOffsetAngle,
    endAngle: Math.PI * 2 + otherOffsetAngle,
  });
  view1.data(data);
  view1.interaction('element-highlight');

  let color = getColors(theme, needRerverse);
  let startColor = R.nth((data.length - 1) % 10)(color);
  view1
    .interval()
    .adjust('stack')
    .position('value')
    .color('type', color)
    .style({
      opacity: 1,
    })
    .label('value', function () {
      return {
        offset: -10,
        style: {
          fontSize,
        },
        content: (obj) => {
          return obj.type + '\n' + (100 * obj.percent).toFixed(2) + '%';
        },
      };
    });

  const view2 = chart.createView({
    region: {
      start: {
        x: 0.5,
        y: 0.1,
      },
      end: {
        x: 1,
        y: 0.9,
      },
    },
  });

  if (otherChart === 'pie') {
    view2.coordinate('theta', {
      radius: 0.9,
      startAngle: 0 + otherOffsetAngle,
      endAngle: Math.PI * 2 + otherOffsetAngle,
    });
  }
  view2.axis(false);
  view2.data(other, {
    value: {
      nice: false,
    },
  });
  view2.interaction('element-highlight');

  view2
    .interval()
    .adjust('stack')
    .position('value')
    .color('type', `${startColor}-#e1e2ee`)
    .label('value', {
      position: 'right',
      offsetX: 5,
      offsetY: 10,
      style: {
        fill: textColor,
        fontSize,
      },
      content: (obj) => {
        return obj.type + ' ' + (100 * obj.percent).toFixed(2) + '%';
      },
    });

  chart.render();

  drawLinkArea();

  chart.on('afterpaint', function () {
    drawLinkArea();
  });

  /* ---------绘制连接区间-----------*/
  function drawLinkArea() {
    const canvas = chart.getCanvas();
    const container = chart.backgroundGroup;
    const view1_coord = view1.getCoordinate();
    const center = view1_coord.getCenter();
    const radius = view1_coord.getRadius();
    const interval_geom = view2.geometries[0];
    const interval_container = interval_geom.container;
    const interval_bbox = interval_container.getBBox();
    const view2_coord = view2.getCoordinate();
    // area points
    const pie_start1 = {
      x: center.x + Math.cos(Math.PI * 2 - otherOffsetAngle) * radius,
      y: center.y + Math.sin(Math.PI * 2 - otherOffsetAngle) * radius,
    };
    const pie_start2 = {
      x: center.x + Math.cos(otherOffsetAngle) * radius,
      y: center.y + Math.sin(otherOffsetAngle) * radius,
    };
    const interval_end1 = {
      x: interval_bbox.minX,
      y: view2_coord.end.y,
    };
    const interval_end2 = {
      x: interval_bbox.minX,
      y: view2_coord.start.y,
    };

    const path =
      otherChart === 'bar'
        ? [
            ['M', pie_start1.x, pie_start1.y],
            ['L', pie_start2.x, pie_start2.y],
            ['L', interval_end2.x, interval_end2.y],
            ['L', interval_end1.x, interval_end1.y],
            ['Z'],
          ]
        : [
            ['M', pie_start1.x, pie_start1.y],
            ['L', pie_start2.x, pie_start2.y],
            ['L', view2_coord.start.x, view2_coord.start.y],
            ['L', view2_coord.end.x, view2_coord.start.y],
            ['L', view2_coord.end.x, view2_coord.end.y],
            ['L', view2_coord.start.x, view2_coord.end.y],
            ['Z'],
          ];
    container.addShape('path', {
      attrs: {
        path,
        fill: startColor,
        opacity: 0.3,
      },
    });
    canvas.draw();
  }
};

export default onMount;
