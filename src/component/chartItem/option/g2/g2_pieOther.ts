import insertCss from 'insert-css';
import G2 from '@antv/g2';
import { IG2Config } from './g2_wind';
import { textColor } from '../index';
import * as R from 'ramda';
export const transformer = ({ data: val, x, y, pieItem }, chart) => {
  let _data = R.map(item => ({ type: item[x], value: item[y] }))(val);
  _data = _data.sort((b, a) => a.value - b.value);

  let sum = _data.reduce((a, b) => a + b.value, 0);
  _data = _data.map(item => {
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

interface IPieOther extends IG2Config {
  pieItem?: number;
  otherChart?: 'pie' | 'bar';
}
export const onMount = (
  {
    data: val,
    header,
    title = '',
    x = 0,
    y = 1,
    pieItem = 6,
    otherChart = 'pie',
    innerPercent = 0,
  }: IPieOther,
  chart,
) => {
  insertCss(`
  .g2-label-item {
    font-size: 12px;
    color: #ffffff;
    text-shadow: 0px 0px 2px #595959;
  }
  .g2-label {
		width: 100px;
  }
`);

  let { data, other, otherOffsetAngle } = transformer({ data: val, x, y, pieItem }, chart);

  chart.legend(false);
  const view1 = chart.view({
    start: {
      x: 0,
      y: 0,
    },
    end: {
      x: 0.5,
      y: 1,
    },
  });
  view1.coord('theta', {
    radius: 0.95,
    innerRadius: innerPercent / 100,
    startAngle: 0 + otherOffsetAngle,
    endAngle: Math.PI * 2 + otherOffsetAngle,
  });
  view1.source(data);

  let color = R.clone(G2.Global.colors);
  color = color.reverse();

  view1
    .intervalStack()
    .position('value')
    .color('type', color)
    .opacity(1)
    .label('value', function() {
      return {
        offset: -30,
        useHtml: true,
        htmlTemplate: (text, item) => {
          const d = item.point;
          const percent = Number(text).toFixed(2) + '%';
          return '<span class="g2-label-item">' + d.type + '<br/>' + percent + '</span>';
        },
      };
    });

  const view2 = chart.view({
    start: {
      x: 0.6,
      y: 0.1,
    },
    end: {
      x: 1,
      y: 0.9,
    },
  });

  if (otherChart === 'pie') {
    view2.coord('theta', {
      radius: 0.5,
      startAngle: 0 + otherOffsetAngle,
      endAngle: Math.PI * 2 + otherOffsetAngle,
    });
  }
  view2.axis(false);
  view2.source(other, {
    value: {
      nice: false,
    },
  });
  view2
    .intervalStack()
    .position(otherChart === 'bar' ? '1*value' : 'value')
    .color('type', [
      '#063d8a',
      '#0b53b0',
      '#1770d6',
      '#2593fc',
      '#47abfc',
      '#6dc1fc',
      '#94d6fd',
      '#bbe7fe',
    ]) // '#2255cc-#8899ee')
    .label('value', {
      position: 'right',
      offsetX: 5,
      offsetY: 10,
      formatter: (text, item) => {
        const d = item.point;
        return d.type + ' ' + d.value.toFixed(2) + '%';
      },
      textStyle: {
        fill: textColor,
      },
    });

  chart.render();

  drawLinkArea();

  chart.on('afterpaint', function() {
    drawLinkArea();
  });

  /* ---------绘制连接区间-----------*/
  function drawLinkArea() {
    const canvas = chart.get('canvas');
    const container = chart.get('backPlot');
    const view1_coord = view1.get('coord');
    const center = view1_coord.center;
    const radius = view1_coord.radius;
    const interval_geom = chart.getAllGeoms()[1];
    const interval_container = interval_geom.get('shapeContainer');
    const interval_bbox = interval_container.getBBox();
    const view2_coord = view2.get('coord');
    // area points
    const pie_start1 = {
      x: center.x + Math.cos(Math.PI * 2 - otherOffsetAngle) * radius,
      y: center.y + Math.sin(Math.PI * 2 - otherOffsetAngle) * radius,
    };
    const pie_start2 = {
      x: center.x + Math.cos(otherOffsetAngle) * radius,
      y: center.y + Math.sin(otherOffsetAngle) * radius,
    };
    let offset = otherChart === 'bar' ? 0 : 30;
    const interval_end1 = {
      x: interval_bbox.minX - offset,
      y: view2_coord.end.y + offset,
    };
    const interval_end2 = {
      x: interval_bbox.minX - offset,
      y: view2_coord.start.y - offset,
    };
    const path = [
      ['M', pie_start1.x, pie_start1.y],
      ['L', pie_start2.x, pie_start2.y],
      ['L', interval_end2.x, interval_end2.y],
      ['L', interval_end1.x, interval_end1.y],
      ...(otherChart === 'pie'
        ? [
            ['M', interval_end2.x, interval_end2.y],
            ['L', interval_end1.x, interval_end1.y],
            ['L', interval_end2.x + 330, interval_end1.y],
            ['L', interval_end1.x + 330, interval_end2.y],
            ['Z'],
          ]
        : [['Z']]),
    ];
    container.addShape('path', {
      attrs: {
        path,
        // fill: '#e9f4fe',
        fill: color[data.length - 1],
        opacity: 0.2,
      },
    });
    canvas.draw();
  }
};
