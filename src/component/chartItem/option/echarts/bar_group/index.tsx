import type { IChartMock } from '@/component/chartItem/interface';
import { handleData, handlePlanData, planTooltipFormatter, getAxisMaxNum } from './lib';
import { array2Json } from '@/utils/lib';
import { getUniqByIdx } from '@/component/chartItem/option/lib';
import * as R from 'ramda';
import type { ISeriesItemProps, ISeriesStyle } from './lib';

export { mock, apiConfig, config, defaultOption } from './mock';

interface IBarGroupProps {
  data: IChartMock;
  product: string;
  barWidth: number;
  legend: number;
  x: number;
  y: number;
  planName?: string;
}
export default ({
  data: _data,
  barWidth,
  legend: _legend,
  x: _x,
  y: _y,
  planName,
}: IBarGroupProps) => {
  const data = array2Json(_data);
  const x = data.header[_x];
  const y = data.header[_y];
  const legend = data.header[_legend];

  const xAxisData = getUniqByIdx({ key: x, data: data.data });

  const stackData = R.reject(R.propEq(legend, planName))(data.data);

  const planSeries = handlePlanData({
    data: data.data,
    legend,
    planName,
    barWidth,
    y,
    xAxisLength: xAxisData.length,
  });

  // 当前数据下，Y轴的最大值（含计划量）
  const axisMaxNum = getAxisMaxNum({ data: data.data, y });

  const seriesStyle: Partial<ISeriesStyle> = {
    type: 'bar',
    stack: 'total',
    label: {
      show: true,
      formatter(e) {
        const percent = 0.1;
        // 较短的bar不显示label
        return axisMaxNum * percent > e.value ? '' : `${e.name}: ${e.value}`;
      },
      position: 'insideRight',
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
    backgroundColor: '#080226',
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
      right: 30,
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      splitLine: null,
      axisLabel: { color: '#fff' },
    },
    yAxis: {
      type: 'category',
      data: xAxisData,
      axisTick: false,
      axisLine: false,
      axisLabel: { color: '#fff' },
    },
    series,
  };
};
