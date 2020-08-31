import echarts from 'echarts';
import * as R from 'ramda';
import * as lib from '@/component/chartItem/option/lib';
import jStat from 'jstat';
import { IChartDefaultValue, IChartConfig, IChartProps } from '@/component/chartItem/interface';

/**
 * // TODO 自定义组件文档说明 更新自2020-08-31
 *
 * 组件按以下规则的约定来完成：
 * 一、默认导出部分
 *  export default ({data,...config})=>
 *  默认导出的函数将作为主函数用于数据处理，接收参数为 data及其它参数，其中data为数据部分，其余参数为设置信息。
 *
 * 二、defaultValue:IChartDefaultValue
 * 导出该项数据用于在没有配置api接口的时候如何显示数据；
 *
 * 三、config
 * 组件自身所需的配置项，内容为
 *
 * -------
 *
 * 注：组件配置信息写在组件定义中，不定义在public/components.json文件中，通过json文件中的key在组件中索引配置项，更方便扩展。
 */

export let defaultValue: IChartDefaultValue = {
  data: [
    ['周一', '收入', 320],
    ['周一', '付出', 120],
    ['周二', '收入', 302],
    ['周二', '付出', 132],
    ['周三', '收入', 341],
    ['周三', '付出', 101],
    ['周四', '收入', 374],
    ['周四', '付出', 134],
    ['周五', '收入', 390],
    ['周五', '付出', 190],
    ['周六', '收入', 450],
    ['周六', '付出', 230],
    ['周日', '收入', 420],
    ['周日', '付出', 210],
  ],
  title: '水平正负柱状图',
  header: ['星期', '类型', '交易发生值'],
  rows: 14,
  hash: 'mockdata',
};

const handleData = ({ data }: IChartDefaultValue, { legend, x, y }) => {
  (legend = Number(legend)), (x = Number(x)), (y = Number(y));

  let max = jStat.max(R.pluck([String(y)])(data));

  let result = lib.handleMinMax({ min: 0, max });
  let legendArr = lib.getUniqByIdx({ key: legend, data });
  let xArr = lib.getUniqByIdx({ key: x, data });
  let series = [];
  legendArr.map((name, idx) => {
    let arr = [];
    xArr.forEach(xItem => {
      let item = data.find(item => item[legend] == name && item[x] == xItem);
      arr.push(item ? Number(item[y]) * (idx === 0 ? -1 : 1) : '-');
    });
    series.push({
      name,
      arr,
    });
  });

  return {
    xArr,
    series,
    max: result.max,
  };
};

/**
 * 组件自身配置项
 *
 * 需要对外暴露的配置信息均定义在此处
 */
export const config: IChartConfig[] = [
  // {
  //   key: 'legend',
  //   title: 'legend 字段',
  //   defaultValue: 0,
  //   min: 0,
  // },
  // {
  //   key: 'x',
  //   title: 'x 字段',
  //   defaultValue: 1,
  //   min: 0,
  // },
  // {
  //   key: 'y',
  //   title: 'y 字段',
  //   defaultValue: 2,
  //   min: 0,
  // },
  {
    key: 'barWidth',
    defaultValue: 20,
    title: '柱状宽度',
    step: 2,
    min: 20,
  },
  {
    key: 'roundBorder',
    defaultValue: true,
    title: '圆角样式',
    type: 'radio',
    option: [
      {
        title: '圆角',
        value: true,
      },
      {
        title: '半角',
        value: false,
      },
    ],
  },
];

/**
 *  默认导出的主函数,参数说明如下：
 *  data 为前台接口拿到的数据，也可以为配置的假数据；
 *  其它参数为父组件传入的内容
 *
 *  返回结果为 echarts 或其它图表库渲染所需的配置项
 */
export default ({
  data,
  legend = 0,
  x = 1,
  y = 2,
  barWidth = 20,
  roundBorder = true,
}: IChartProps) => {
  let res = handleData(data, { legend, x, y });

  const color = '#ddd';
  const axisColor = '#203651';

  return {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    legend: {
      icon: 'circle',
      textStyle: {
        color,
      },
      top: 15,
      left: 'center',
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'value',
        splitLine: {
          show: false,
        },
        position: 'top',
        axisTick: {
          show: false,
        },
        axisLabel: {
          formatter: Math.abs,
          color,
        },
        axisLine: {
          lineStyle: {
            color: axisColor,
          },
        },
        min: -res.max,
        max: res.max,
      },
    ],
    yAxis: [
      {
        type: 'category',
        axisTick: {
          show: false,
        },
        data: res.xArr,
        axisLine: {
          lineStyle: {
            color: axisColor,
          },
        },
        axisLabel: {
          color,
          margin: 0,
        },
      },
    ],
    series: [
      {
        name: res.series[0].name,
        type: 'bar',
        stack: '总量',
        barWidth,
        label: {
          show: true,
          position: 'left',
          formatter: e => Math.abs(e.value),
          color: '#ff3e8b',
        },
        itemStyle: {
          normal: {
            barBorderRadius: roundBorder ? [barWidth / 2, 0, 0, barWidth / 2] : 0,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {
                offset: 0,
                color: '#ef00ff',
              },
              {
                offset: 1,
                color: '#ba00ff',
              },
            ]),
          },
        },
        data: res.series[0].arr,
      },
      {
        name: res.series[1].name,
        type: 'bar',
        stack: '总量',
        barWidth,
        label: {
          show: true,
          position: 'right',
          color: '#00baff',
        },
        itemStyle: {
          normal: {
            barBorderRadius: [0, barWidth / 2, barWidth / 2, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              {
                offset: 0,
                color: '#2846ff',
              },
              {
                offset: 1,
                color: '#00baff',
              },
            ]),
          },
        },
        data: res.series[1].arr,
      },
    ],
  };
};
