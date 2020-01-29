import util from '@/component/echarts/themeColor';

export default (
  { data, innerPercent = 20, startAngle = 0, endAngle = 360, legend = true },
  chart,
) => {
  chart.source(data);
  chart.coord('polar', {
    innerRadius: innerPercent / 100,
    startAngle: startAngle === 0 ? 0 : Math.PI * (startAngle / 180), // 起始角度
    endAngle: endAngle === 0 ? 0 : Math.PI * (endAngle / 180), // 结束角度
  });
  chart.axis(false);
  chart
    .interval()
    .position('name*value')
    .color('name', util.getColor(data.length)) // G2.Global.colors_pie_16)
    .label('name', {
      offset: -15,
    })
    .style({
      lineWidth: 1,
      stroke: '#fff',
    });

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
