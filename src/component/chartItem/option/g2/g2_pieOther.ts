import insertCss from 'insert-css'; 
import { getTheme } from '@antv/g2';
const defaultTheme = getTheme();
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
  { data: val, x = 0, y = 1, pieItem = 6, otherChart = 'pie', innerPercent = 0 }: IPieOther,
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

  let color = R.clone(defaultTheme.colors10);
  let startColor = R.nth((data.length - 1) % 10)(color);
  view1
    .interval()
    .adjust('stack')
    .position('value')
    .color('type', color)
    .style({
      opacity: 1,
    })
    .label('value', function() {
      return {
        offset: -10,
        content: obj => {
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
      },
      content: obj => {
        return obj.type + ' ' + (100 * obj.percent).toFixed(2) + '%';
      },
    });

  chart.render();

  drawLinkArea();

  chart.on('afterpaint', function() {
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
