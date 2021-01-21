import * as R from 'ramda';
import { getDataByIdx } from '@/component/chartItem/option/lib';

/**
 *获取当前数据中的最大值
 * @param data 数据数组
 * @param y 值索引
 */
export const getAxisMaxNum = ({ data, y }) => {
  const yAxisValues = getDataByIdx({ key: y, data });
  return Math.max(...yAxisValues);
};

export const planTooltipFormatter = (e, planName) => {
  const arr = e.filter((item) => item.value !== '-' && item.seriesName !== planName);

  const str = arr.map((item) => `<div>${item.marker} ${item.name}: ${item.value}</div>`).join('');
  const sum = arr.reduce((b, a) => a.value + b, 0);
  const baseText =
    arr.length === 0
      ? ''
      : `${str}<div style="border-top:1px solid #ddd;margin-top:8px;padding-top:8px">合计: ${sum}</div>`;

  // 计划量
  const plan = e.find((item) => item.seriesName === planName);
  const planText = !plan ? '' : `<div>${plan.seriesName}: ${plan.value}</div>`;

  return `<div><b>${e[0].axisValue}</b><br/>${baseText}${planText}</div>`;
};

interface ILabelProp {
  show: boolean;
  formatter: (e: any) => string;
  position: string;
  rotate: number;
  offset: number[];
  color: string;
}

export interface ISeriesItemProps {
  data?: (
    | number
    | string
    | {
        name: string;
        value: number;
      }
  )[];
}
export interface ISeriesStyle extends ISeriesItemProps {
  type: string;
  stack: boolean;

  name: string;
  lineStyle: {
    width: number;
  };
  symbolOffset: number[];
  color: string;
  symbolSize: number[];
  symbol: string;
  showBackground: boolean;
  backgroundStyle: {
    color: string;
  };

  label: Partial<ILabelProp>;
}
interface IPlanDataProp {
  data: any[];
  legend: string;
  planName: string;
  barWidth: number;
  y: string;
  xAxisLength: number;
  isReverse: boolean;
}
/**
 * 获取计划量数据配置项
 * @param param0
 */
export const handlePlanData = ({
  data,
  legend,
  planName,
  barWidth,
  xAxisLength,
  y,
  isReverse,
}: IPlanDataProp) => {
  const plans = R.filter(R.propEq(legend, planName))(data);
  const planData = R.pluck(y, plans).map(Number);
  const series: Partial<ISeriesStyle> = {
    name: planName,
    type: 'line',
    data: planData,
    lineStyle: {
      width: 0,
    },
    color: '#e23',
    symbolSize: isReverse ? [2 * barWidth + 20, 3] : [3, 22 + barWidth],
    symbol: 'rect',
    symbolOffset: isReverse ? [-8, 0] : [0, -6],
    label: {
      show: true,
      position: 'center',
      offset: isReverse ? [0, -12] : [-24 + barWidth, 0],
      color: '#fff',
      formatter(e) {
        if (e.dataIndex === xAxisLength - 1) {
          return `${planName}\n${e.value}`;
        }
        return e.value;
      },
    },
  };
  return series;
};

interface IBarGroupProps {
  data: {}[];
  xAxisData: string[];
  x: string;
  y: string;
  legend: string;
}

export const handleData = ({ data, xAxisData, legend, x, y }: IBarGroupProps) => {
  const allProcessGroup = R.groupBy((c) => c[x])(data);

  const yAxisGroup: number[] = [];

  R.mapObjIndexed((value: any[]) => {
    yAxisGroup.push(value.length);
  })(allProcessGroup);

  const yAxisData: ISeriesItemProps[] = R.map(() => ({ data: R.repeat('-', xAxisData.length) }))(
    new Array(Math.max(...yAxisGroup)),
  );

  const processGroup = R.groupBy((item) => item[x])(data);

  R.mapObjIndexed((value: any[], key: string) => {
    const no = R.indexOf(key)(xAxisData);

    for (let loop = 0; loop < value.length; loop++) {
      yAxisData[loop].data[no] = {
        name: value[loop][legend],
        value: Number(value[loop][y]),
      };
    }
  })(processGroup);

  return yAxisData;
};