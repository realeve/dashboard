import { textColor } from './index';
import util from '@/component/echarts/themeColor';
import echarts from 'echarts';
export interface IGardientLine {
  yAxis?: boolean;
  data: {
    x: any[];
    y: {
      name: string;
      value: any[];
    }[];
  };
  smooth?: boolean;
  scale?: number;
}

export default ({ yAxis = true, smooth = true, data, scale = 1 }: IGardientLine) => {
  let color = util.getColor(data.x.length, 'line');

  let getSeries = data =>
    data.map((item, idx) => ({
      name: item.name,
      type: 'line',
      smooth,
      itemStyle: {
        normal: {
          color: color[idx % data.length],
          borderWidth: 4,
          areaStyle: {
            //渐变色的设置
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: util.hex2rgb(color[idx % data.length], 0.9),
              },
              {
                offset: 0.5,
                color: util.hex2rgb(color[idx % data.length], 0.4),
              },
              {
                offset: 1,
                color: util.hex2rgb(color[idx % data.length], 0.05),
              },
            ]),
          },
          lineStyle: {
            color: color[idx % data.length],
            width: 2,
          },
        },
      },
      label: {
        normal: {
          show: true,
          position: 'top',
        },
      },
      stack: '累计',
      data: item.value,
    }));

  return {
    grid: {
      left: '3%',
      top: 30 * scale,
      right: '3%',
      bottom: 25,
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.x,
      splitLine: {
        show: false,
      },
      boundaryGap: false,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        textStyle: {
          fontSize: 14 * scale,
          color: textColor,
        },
      },
    },
    yAxis: {
      type: 'value',
      splitLine: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisTick: {
        show: yAxis,
        inside: true,
        length: 10 * scale,
        lineStyle: {
          color: textColor,
        },
      },
      axisLabel: {
        show: yAxis,
        textStyle: {
          color: textColor,
          fontSize: 14 * scale,
        },
      },
    },
    tooltip: {},
    legend: { icon: 'circle', textStyle: { color: '#fff' }, left: 'center', bottom: '0' },
    //仅列举一个，其他2个类似
    series: getSeries(data.y),
  };
};
