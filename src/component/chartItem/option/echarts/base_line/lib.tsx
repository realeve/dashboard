import type { IChartConfig } from '@/component/chartItem/interface';
import type { ISeries } from './interface';
import { getUniqByIdx } from '@/component/chartItem/option/lib';

import * as R from 'ramda';
/**
 * 获取标记区域配置项
 * @param num 数量
 * @param step 默认步长
 * @param split 分隔符号
 */
export const getMarkArea: (num: number, step?: number, split?: string) => IChartConfig[] = (
  num,
  step = 1,
  split = '~',
) => {
  const arr: IChartConfig[] = R.range(1, num + 1).map((i: number) => [
    {
      key: `markTitle${i}`,
      defaultValue: '',
      type: 'input',
      valueType: 'text',
      title: `区域${i}标题`,
    },
    {
      key: `markArea${i}`,
      type: 'slider',
      defaultValue: [10, 20],
      title: `区域${i}范围`,
      step,
      split,
    },
  ]);
  return R.flatten(arr);
};
/**
 * 获取标记区域配置项
 * @param markTitle 标题
 * @param markArea 区域范围
 */
export const getMarkAreaData: (
  markTitle: string,
  markArea: [number, number],
  isReverse?: boolean,
) => {
  name?: string;
  label?: {
    position: string;
    offset: number[];
    color: string;
  };
  itemStyle?: { color: string };
  yAxis: number;
}[] = (markTitle, markArea, isReverse = false) => {
  if (markTitle.length > 0) {
    return [
      {
        name: markTitle,
        label: {
          position: 'right',
          offset: [-(markTitle.length * 9), 0],
          color: '#fff',
          rotate: isReverse ? 90 : 0,
        },
        [isReverse ? 'xAxis' : 'yAxis']: markArea[0],
      },
      {
        [isReverse ? 'xAxis' : 'yAxis']: markArea[1],
      },
    ];
  }
  return [];
};

/**
 * 获取坐标轴名称
 * @param isReverse 翻转XY轴
 * @param isPolar 极坐标
 * @param type 坐标轴类型（横/纵）
 */
export const getAxisName = ({ isReverse, isPolar, type = 'x' }) => {
  const arr = ['xAxis', 'yAxis', 'angleAxis', 'radiusAxis'];
  if (!isPolar) {
    if (isReverse) {
      return type === 'x' ? arr[0] : arr[1];
    }
    return type === 'x' ? arr[1] : arr[0];

    // return isReverse ? (type === 'x' ? arr[0] : arr[1]) : type === 'x' ? arr[1] : arr[0];
  }
  if (isReverse) {
    return type === 'x' ? arr[2] : arr[3];
  }
  return type === 'x' ? arr[3] : arr[2];

  // return isReverse ? (type === 'x' ? arr[2] : arr[3]) : type === 'x' ? arr[3] : arr[2];
};

/**
 * 处理百分比逻辑
 * @param series 数据系列
 */
export const handlePercent = (series: ISeries[]) => {
  const arrSum: number[] = [];
  series.forEach(({ data }, idx: number) => {
    if (idx > 0) {
      data.forEach((td, i: number) => {
        arrSum[i] += Number(td) || 0;
      });
    } else {
      data.forEach((td, i: number) => {
        arrSum[i] = Number(td) || 0;
      });
    }
  });

  return R.map((item) => {
    const data = item.data.map((td, i) =>
      arrSum[i] === 0 ? 0 : Number(((100 * +td) / arrSum[i]).toFixed(2)),
    );
    return { ...item, data };
  }, series);
};

export const getMarkAreaInfo = ({
  showMarkArea,
  isReverse = false,
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
}) => {
  let markAreaInfo = {};
  if (showMarkArea) {
    let markData = [getMarkAreaData(markTitle1, markArea1, isReverse)];
    markData = [...markData, getMarkAreaData(markTitle2, markArea2, isReverse)];
    markData = [...markData, getMarkAreaData(markTitle3, markArea3, isReverse)];
    markData = [...markData, getMarkAreaData(markTitle4, markArea4, isReverse)];
    markData = [...markData, getMarkAreaData(markTitle5, markArea5, isReverse)];
    markData = markData.filter((item) => item.length);
    markData = markData.filter((item, i) => {
      const nextItem = R.clone(item);
      if (i % 2 === 1) {
        nextItem[0].itemStyle = { color: markAreaColor2 };
      }
      return nextItem;
    });
    markAreaInfo = {
      markArea: {
        silent: true,
        itemStyle: {
          color: markAreaColor,
        },
        data: markData,
      },
    };
  }
  return markAreaInfo;
};

export const handleTimeAxis = (
  { data, header },
  {
    legend,
    x,
    y,
  }: {
    legend?: number | string | undefined;
    x: number | string;
    y: number | string;
  },
) => {
  const series = [];
  if (typeof legend === 'undefined') {
    const arr = [];
    data.forEach((item) => {
      arr.push({
        value: [item[x], item[y]],
      });
    });

    series.push({
      name: header[y],
      arr,
    });
  } else {
    const legendArr = getUniqByIdx({ key: legend, data });
    legendArr.forEach((name) => {
      const arr = [];
      const legendData = data.filter((itemData) => itemData[legend] === name);
      legendData.forEach((item) => {
        arr.push({
          value: [item[x], item[y]],
        });
      });
      series.push({
        name,
        arr,
      });
    });
  }
  return { series, xArr: [] };
};
