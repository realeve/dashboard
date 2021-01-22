import type { IChartMock } from '@/component/chartItem/interface';
import { handleData, handlePlanData, planTooltipFormatter, getAxisMaxNum } from './lib';
import { array2Json } from '@/utils/lib';
import { getUniqByIdx } from '@/component/chartItem/option/lib';
import * as R from 'ramda';
import type { ISeriesItemProps, ISeriesStyle } from './lib';
import { getColors } from '../../g2plot/lib';

export { mock, apiConfig, config, defaultOption } from './mock';

interface IBarGroupProps {
  data: IChartMock;
  product: string;
  barWidth: number;
  legend: number;
  x: number;
  y: number;
  planName?: string;
  theme: number | string;
  needRerverse: boolean;
  isStack: boolean;
  isReverse: boolean;
  showBackground: boolean;
  barBackgroundColor: string;
}
export default ({
  data: _data,
  barWidth,
  legend: _legend,
  x: _x,
  y: _y,
  planName,
  theme = 18,
  needRerverse,
  isStack,
  isReverse = false,
  showBackground,
  barBackgroundColor,
}: IBarGroupProps) => {
  const data = array2Json(_data);
  const x = data.header[_x];
  const y = data.header[_y];
  const legend = data.header[_legend];

  const color = getColors(theme, needRerverse);

  const xAxisData = getUniqByIdx({ key: x, data: data.data });

  const stackData = R.reject(R.propEq(legend, planName))(data.data);

  const planSeries = handlePlanData({
    data: data.data,
    legend,
    planName,
    barWidth,
    y,
    xAxisLength: xAxisData.length,
    isReverse,
  });

  // 当前数据下，Y轴的最大值（含计划量）
  const axisMaxNum = getAxisMaxNum({ data: data.data, y });

  const seriesStyle: Partial<ISeriesStyle> = {
    type: 'bar',
    stack: isStack,
    label: {
      show: true,
      formatter(e) {
        const percent = 0.1;
        // 较短的bar不显示label
        return axisMaxNum * percent > e.value
          ? ''
          : `${e.name}${isReverse ? '\n' : ':'} ${e.value}`;
      },
      position: `inside${!isReverse ? 'Right' : 'Top'}`,
    },
    showBackground,
    backgroundStyle: {
      color: barBackgroundColor,
    },
  };

  const seriesData = handleData({
    data: stackData,
    xAxisData,
    x,
    y,
    legend,
  });

  let series = R.map((item: ISeriesItemProps) => ({
    ...item,
    ...seriesStyle,
  }))(seriesData);

  series = [planSeries, ...series];

  return {
    color,
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        // Use axis to trigger tooltip
        type: 'shadow', // 'shadow' as default; can also be 'line' or 'shadow'
      },
      formatter(e) {
        return planTooltipFormatter(e, planName);
      },
    },
    grid: {
      top: 20,
      right: 30,
      containLabel: true,
    },
    [!isReverse ? 'xAxis' : 'yAxis']: {
      type: 'value',
      splitLine: null,
      axisLabel: { color: '#fff' },
    },
    [isReverse ? 'xAxis' : 'yAxis']: {
      type: 'category',
      data: xAxisData,
      axisTick: false,
      axisLine: false,
      axisLabel: { color: '#fff' },
    },
    series,
  };
};
