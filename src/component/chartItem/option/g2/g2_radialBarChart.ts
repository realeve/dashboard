import { textColor } from '../index';
import { DataSet } from '@antv/data-set';

export default (
  { data, header, title = '', x = 0, y = 1, color = '#8543e0', innerPercent = 20 },
  chart,
) => {
  const ds = new DataSet();
  const dv = ds.createView().source(data);
  dv.transform({
    type: 'sort',
    callback(a, b) {
      return a[y] - b[y];
    },
  });

  chart.data(dv, {
    [y]: { scale: true },
  });

  //别名
  chart.scale(header.map(alias => ({ alias })));

  chart.coord('theta', {
    innerRadius: innerPercent / 100,
    endAngle: Math.PI,
  });

  chart
    .interval()
    .position(`${x}*${y}`)
    .color(String(color))
    .shape('line')
    .select(false)
    .style({
      lineAppendWidth: 10,
    }); // 线状柱状图
  chart
    .point()
    .position(`${x}*${y}`)
    .color(String(color))
    .shape('circle');
  for (let i = 0, l = data.length; i < l; i++) {
    const obj = data[i];
    chart.guide().text({
      position: [obj[x], 0],
      content: obj[x] + ' ',
      style: {
        textAlign: 'right',
        fill: textColor,
      },
    });
  }
  if (title.length > 0) {
    chart.guide().text({
      position: [`${50 - title.length / 2}%`, '50%'],
      content: title,
      style: {
        textAlign: 'center',
        fontSize: 18,
        fill: String(color).length > 3 ? color : textColor,
      },
    });
  }
  chart.legend(false);
  chart.render();
};
