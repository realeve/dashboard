import { handleData } from '@/component/chartItem/option/echarts/line';
import * as lib from '@/component/chartItem/option/lib';
import { getColors } from '../../g2plot/lib';
export { config, mock, apiConfig, defaultOption } from './mock';
import * as utils from './lib';
import { ISeries, IEchartsBaselineProps } from './interface';

/**
 * 2020-11-30
 * ECharts 曲线图/面积图/柱状图/堆叠图/条形图/极坐标系/百分比图 等常见图表的综合组件
 * 通过配置项可组合出常见的各类型图表
 * 该示例涉及十余项参数的调整，其它组件可参考该示例完成。
 */
export default ({
  data,
  legend = 0,
  x = 1,
  y = 2,
  theme = 18,
  needRerverse,
  chartType,
  isArea,
  isStep = false,
  isPolar,
  isStack,
  isPercent,
  smooth = true,
  isReverse = false,
  legendShow = true,
  showMarkpoint,
  showMarkline,
  showMarkArea,
  markAreaColor,
  markAreaColor2,
  markTitle1 = '',
  markArea1,
  markTitle2 = '',
  markArea2,
  markTitle3 = '',
  markArea3,
  markTitle4 = '',
  markArea4,
  markTitle5 = '',
  markArea5,
  showBackground,
  barBackgroundColor,
  showLabel,
  legendAlign,
  legendPosition,
  legendOrient,
  area_opacity = 1,
  lineWidth = 8,
  barWidth,
  showSymbol,
  symbol,
  symbolSize,
  roundCap,
  axisPointer = 'shadow',
}: IEchartsBaselineProps) => {
  if (String(legend) == '') {
    return {};
  }
  let res = handleData(data, { legend, x, y });
  let markAreaInfo = utils.getMarkAreaInfo({
    showMarkArea,
    markAreaColor,
    markAreaColor2,
    markTitle1,
    markArea1,
    markTitle2,
    markArea2,
    markTitle3,
    markArea3,
    markTitle4,
    markArea4,
    markTitle5,
    markArea5,
  });

  let series: ISeries[] = res.series.map(({ name, arr: data }, idx: number) => ({
    name,
    coordinateSystem: isPolar ? 'polar' : 'cartesian2d',
    data: isReverse ? data.reverse() : data,
    stack: isStack,
    type: chartType,
    step: isStep,
    smooth,
    lineStyle: {
      width: lineWidth,
    },

    // 只在第一组数据显示标记区域
    ...(idx == 0 ? markAreaInfo : {}),
    ...(isArea ? { areaStyle: { opacity: area_opacity } } : {}),
    ...(showMarkpoint
      ? {
          markPoint: {
            silent: true,
            data:
              showMarkpoint == 'minmax'
                ? [
                    {
                      name: '最大值',
                      type: 'max',
                    },
                    {
                      name: '最小值',
                      type: 'min',
                    },
                  ]
                : showMarkpoint == 'max'
                ? [
                    {
                      name: '最大值',
                      type: 'max',
                    },
                  ]
                : [
                    {
                      name: '最小值',
                      type: 'min',
                    },
                  ],
          },
        }
      : {}),
    ...(!showMarkline
      ? {}
      : {
          markLine: {
            silent: true,
            data: [
              {
                name: '平均值',
                type: 'average',
                label: { formatter: '{b}\n{c}', distance: -10 },
              },
            ],
            symbol: 'none',
            lineStyle: {
              opacity: 0.4,
            },
          },
        }),
    barWidth,
    symbol,
    symbolSize,
    showSymbol,
    label: {
      show: showLabel,
      position: `inside${isReverse ? 'Right' : 'Top'}`,
      color: '#fff',
    },
    showBackground,
    backgroundStyle: {
      color: barBackgroundColor,
    },
    roundCap,
  })) as ISeries[];

  // 处理百分比图
  if (isPercent) {
    series = utils.handlePercent(series);
  }

  let color = getColors(theme, needRerverse);

  return {
    color,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: axisPointer,
      },
    },
    legend: lib.getLegendOption({ legendShow, legendAlign, legendPosition, legendOrient }),
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },

    // 极坐标系必须设置polar
    ...(isPolar ? { polar: {} } : {}),
    [utils.getAxisName({ isPolar, isReverse, type: 'x' })]: [
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
          color: '#ddd',
        },
        axisLine: {
          lineStyle: {
            color: '#ddd',
          },
        },
      },
    ],
    [utils.getAxisName({ isPolar, isReverse, type: 'y' })]: [
      {
        type: 'category',
        axisTick: {
          show: false,
        },
        data: isReverse ? res.xArr.reverse() : res.xArr,
        axisLine: {
          lineStyle: {
            color: '#ddd',
          },
        },
        axisLabel: {
          color: '#ddd',
        },
      },
    ],
    series,
  };
};