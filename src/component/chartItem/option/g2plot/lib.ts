import { uniq, isNumber, isDate } from '@antv/util';

import { palette } from '@/component/g2plot/palette';
import * as R from 'ramda';

export { getAntThemePanel } from '@/component/chartItem/option/lib';

const dict = {
  周一: 1,
  周二: 2,
  周三: 3,
  周四: 4,
  周五: 5,
  周六: 6,
  周日: 7,
  周天: 7,
  星期一: 1,
  星期二: 2,
  星期三: 3,
  星期四: 4,
  星期五: 5,
  星期六: 6,
  星期日: 7,
  星期天: 7,
  一月: 1,
  二月: 2,
  三月: 3,
  四月: 4,
  五月: 5,
  六月: 6,
  七月: 7,
  八月: 8,
  九月: 9,
  十月: 10,
  十一月: 11,
  十二月: 12,
  janurary: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12,
};
const monthOrWeekKeys = Object.keys(dict);

// 数组排序
export const sort = (a, b) => {
  if (isNumber(a)) {
    return a - b;
  }
  if (isDate(a)) {
    return String(a).localeCompare(String(b));
  }
  if (monthOrWeekKeys.includes(a)) {
    return dict[a] - dict[b];
  }
  return 0;
};

// export const handlePercent = (annotations, isPercent = false) => {
//   if (!isPercent) {
//     return annotations;
//   }
//   let sum = 0;
//   annotations.forEach((item) => (sum += item.position[1]));
//   if (sum == 0) {
//     return annotations;
//   }
//   return annotations.map((item) => {
//     item.position = [item.position[0], item.position[1] / sum];
//   });
// };

/**
 * 处理堆叠数据尾部标签位置
 * @param annotations 配置项
 */
export const handleStackPosition = (annotations, isArea) => {
  let legendVal = annotations.map((item) => item.position[1]);

  legendVal = legendVal.reverse();

  for (let i = 1; i < legendVal.length; i++) {
    legendVal[i] += legendVal[i - 1];
  }
  legendVal = [0, ...legendVal];

  // 处理堆叠数据
  const position = annotations
    .map((item, idx) => {
      // 显示在两组数据居中的位置
      const val = isArea ? (legendVal[idx] + legendVal[idx + 1]) / 2 : legendVal[idx + 1];
      return [item.position[0], val];
    })
    .reverse();
  return annotations.map((item, idx) => ({
    ...item,
    position: position[idx],
  }));
};

/**
 * 获取 annotations 配置项
 * @param data {Array} 原始数据，建议传入的数据自行处理对x轴数据的排序，此处只处理月份/星期/日期类型/数值型几种场景。
 * @param xField {String} x字段
 * @param yField {String} y字段
 * @param seriesField {String} series字段
 * @param color {Array} 主题色列表，与配置项中的颜色列表对应，用于填充文字颜色，与曲线保持一致
 *
 * @param offsetX {Number} 偏移量
 * @param maxLabelLength {Number} 文本最大显示长度，超过一定值时显示...
 * @param needSort {Boolean} 是否需要对X轴排序
 * @param isStack {Boolean} 是否为堆叠数据
 * @param xAxisOffset {Number} 堆叠状态下X轴偏移几条数据，默认为0，设置该值后标签将不显示在尾部而是显示在区域内
 * @return annotations 配置项
 */
export const getAnnotations = (
  data,
  { xField, yField, seriesField = null, color = [] },
  {
    offsetX = 16,
    maxLabelLength = 15,
    needSort = false,
    isStack = false,
    xAxisOffset = 0,
    isArea = false,
  },
) => {
  // 不存在序列，只有X/Y轴，无需annotations
  if (!seriesField) {
    return [];
  }
  // 获取legend项，根据seriesField字段去重
  const legend = uniq(data.map((item) => item[seriesField]));

  const annotations = legend.map((content, idx) => {
    // 获取每个legend项的数组
    let arr = data.filter((item) => item[seriesField] === content);

    // 根据X轴逆序排序，取出第0个为最后一项的Y值
    // 如果输入数据已经对X轴做过排序，直接将取出的值逆序即可；
    arr = needSort ? arr.sort((b, a) => sort(a[xField], b[xField])) : arr.reverse();

    return {
      type: 'text',
      // 超过最大长度时显示 ...
      content: content.slice(0, maxLabelLength) + (content[maxLabelLength] ? '...' : ''),
      position: [arr[xAxisOffset][xField], arr[xAxisOffset][yField]],
      style: {
        fill: color[idx],
        textAlign: xAxisOffset > 0 ? 'center' : 'left',
        textBaseline: 'middle',
      },
      offsetX,
    };
  });
  if (!isStack) {
    return annotations;
  }
  return handleStackPosition(annotations, isArea);
};

export const getTheme: (theme: number | string) => { theme?: { colors10: string[] } | 'cbpc' } = (
  theme: number | string,
) => {
  const isDefaultTheme = theme === 'cbpc';
  if (isDefaultTheme) {
    return {};
  }
  const themeCfg: { colors10: string[] } | 'cbpc' = palette[theme].theme;
  return isDefaultTheme ? {} : { theme: themeCfg };
};

// 获取默认主题色列表
export const getColors = (theme: number | string, needReverse = false) => {
  const color = getTheme(theme);
  const defaultColors = [
    '#5B8FF9',
    '#5AD8A6',
    '#5D7092',
    '#F6BD16',
    '#E86452',
    '#6DC8EC',
    '#945FB9',
    '#FF9845',
    '#1E9493',
    '#FF99C3',
  ];
  const colors = [theme, color?.theme].includes('cbpc')
    ? defaultColors
    : color?.colors10 || color?.theme?.colors10;

  return needReverse ? R.clone(colors).reverse() : colors;
};
