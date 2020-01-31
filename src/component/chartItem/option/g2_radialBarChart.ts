import { getBarMax } from './radialBarChart';
import { textColor } from './index';
import * as R from 'ramda';

// 数据转换器，外部数据变更时，将计算结果注入至source
export const transformer = ({ data: val, x, y }) => {
  let data = R.sort((a, b) => a[y] - b[y])(val);
  let max = getBarMax(data, y);

  return {
    data,
    scaleConfig: {
      [y]: {
        max,
      },
    },
  };
};

export const onMount = (
  { data: val, header, title = '', x = 0, y = 1, color = '#8543e0', innerPercent = 20 },
  chart,
) => {
  let res = transformer({ data: val, x, y });
  let { data, scaleConfig } = res;
  chart.source(data, scaleConfig);

  // dv.transform({
  //   type: 'sort',
  //   callback(a, b) {
  //     return a.year - b.year;
  //   }
  // });

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
