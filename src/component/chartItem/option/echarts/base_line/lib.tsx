import { IChartConfig } from '@/component/chartItem/interface';
import { ISeries } from './interface';

import * as R from 'ramda';
/**
 * 获取标记区域配置项
 * @param num 数量
 * @param step 步长
 * @param split 分隔符号
 */
export const getMarkArea: (num: number, step?: number, split?: string) => IChartConfig[] = (
  num,
  step = 1,
  split = '~',
) => {
  let arr: IChartConfig[] = R.range(1, num + 1).map((i: number) => [
    {
      key: 'markTitle' + i,
      defaultValue: '',
      type: 'input',
      valueType: 'text',
      title: `区域${i}标题`,
    },
    {
      key: 'markArea' + i,
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
) => {
  name?: string;
  label?: {
    position: string;
    offset: number[];
    color: string;
  };
  itemStyle?: {};
  yAxis: number;
}[] = (markTitle, markArea) => {
  if (markTitle.length > 0) {
    return [
      {
        name: markTitle,
        label: {
          position: 'right',
          offset: [-(markTitle.length * 9), 0],
          color: '#fff',
        },
        yAxis: markArea[0],
      },
      {
        yAxis: markArea[1],
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
  let arr = ['xAxis', 'yAxis', 'angleAxis', 'radiusAxis'];
  if (!isPolar) {
    return isReverse ? (type == 'x' ? arr[0] : arr[1]) : type == 'x' ? arr[1] : arr[0];
  }
  return isReverse ? (type == 'x' ? arr[2] : arr[3]) : type == 'x' ? arr[3] : arr[2];
};

/**
 * 处理百分比逻辑
 * @param series 数据系列
 */
export const handlePercent = (series: ISeries[]) => {
  let arrSum: number[] = [];
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
    item.data = item.data.map((td, i) =>
      arrSum[i] == 0 ? 0 : Number(((100 * +td) / arrSum[i]).toFixed(2)),
    );
    return item;
  }, series);
};

export const getMarkAreaInfo = ({
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
}) => {
  let markAreaInfo = {};
  if (showMarkArea) {
    let markData = [getMarkAreaData(markTitle1, markArea1)];
    markData = [...markData, getMarkAreaData(markTitle2, markArea2)];
    markData = [...markData, getMarkAreaData(markTitle3, markArea3)];
    markData = [...markData, getMarkAreaData(markTitle4, markArea4)];
    markData = [...markData, getMarkAreaData(markTitle5, markArea5)];
    markData = markData.filter((item) => item.length);
    markData = markData.filter((item, i) => {
      if (i % 2 == 1) {
        item[0].itemStyle = { color: markAreaColor2 };
      }
      return item;
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
