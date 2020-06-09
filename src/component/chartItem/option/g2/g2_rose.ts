import G2 from '@antv/g2';

export default (
  {
    data,
    header,
    x = 0,
    y = 1,
    innerPercent = 20,
    startAngle = 0,
    endAngle = 360,
    legend = true,
    color = 'rainbow',
  },
  chart,
) => {
  chart.source(data);

  //别名
  chart.scale(header.map(alias => ({ alias })));

  chart.coord('polar', {
    innerRadius: innerPercent / 100,
    startAngle: startAngle === 0 ? 0 : Math.PI * (startAngle / 180), // 起始角度
    endAngle: endAngle === 0 ? 0 : Math.PI * (endAngle / 180), // 结束角度
  });

  chart.axis(false);

  let interval = chart
    .interval()
    .position(`${x}*${y}`)
    .label(String(x), {
      offset: -15,
    })
    .style({
      lineWidth: 1,
      stroke: '#fff',
    });

  if (color) {
    interval.color(String(x), color === 'rainbow' ? G2.Global.colors_pie_16 : color);
  }

  chart.legend(legend);

  chart.render();
  var idx = data.length;
  setInterval(() => {
    chart.changeData(data.slice(0, idx));
    idx--;
    if (idx < 1) {
      idx = data.length;
    }
  }, 3000);
};