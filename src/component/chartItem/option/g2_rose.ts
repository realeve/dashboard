// import util from '@/component/echarts/themeColor';
import G2 from '@antv/g2';

export default (
  {
    data,
    header,
    x = 0,
    y = 1,
    innerPercent = 20,
    startAngle = 0,
    colorful = true,
    endAngle = 360,
    legend = true,
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
  if (colorful) {
    interval.color(String(x), G2.Global.colors_pie_16); // util.getColor(data.length)) //
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
