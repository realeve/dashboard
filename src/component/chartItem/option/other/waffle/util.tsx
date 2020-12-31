import { isArray } from '@antv/util';
import * as R from 'ramda';

/**
 * 根据品种获取冠字列表的行列式
 * @param prod 品种
 */
const getTemplate = (prod) => {
  const FormatPos40 = ['9602A', '9603A', '9602T', '9603T'].includes(prod);
  const colRow = FormatPos40 ? [25, 10] : [26, 11];
  const arr = [];
  for (let i = 0; i < colRow[1]; i++) {
    for (let j = 0; j < colRow[0]; j++) {
      arr.push([j, i]);
    }
  }
  return arr;
};

export enum EStatus {
  /** 未印刷 */
  NOT_PRINT,
  /** 正常 */
  NORMAL,
  /** 跳号 */
  ERROR,
  /** 无印码 */
  NO_CODE,
}
export const handleScatterData = ({ y: _y = 1, data: { data, header }, prod }) => {
  const dataType = isArray(data[0]);
  const y = dataType ? _y : header[_y];
  const res = R.clone(data);

  // 从此id开始产品未印刷，小于它的视为跳号
  const id = R.reverse(data).findIndex((item) => item[y] === 1);
  const idx = res.length - id;

  const template = getTemplate(prod);

  return template.map((temp, j) => {
    const item = res[j];
    if (!item) {
      temp[2] = EStatus.NO_CODE; // 印码未印刷
      return temp;
    }
    let status = Number(item[y]);
    if (j < idx && status === 0) {
      status = EStatus.ERROR;
    }
    (temp[2] = status), (temp[3] = item);
    return temp;
  });
};

export const handleData = ({
  x: _x = 0,
  y: _y = 1,
  legend: _legend = 2,
  cart: _cart = 3,
  data: { data, header },
  gzMode,
  colorArr = ['#aaa', '#749cff', '#fb0348'],
}) => {
  const dataType = isArray(data[0]);
  const x = dataType ? _x : header[_x];
  const y = dataType ? _y : header[_y];
  const legend = dataType ? _legend : header[_legend];
  const cart = dataType ? _cart : header[_cart];
  const res = R.clone(data);

  // 从此id开始产品未印刷，小于它的视为跳号
  let idx = res.length;
  if (gzMode) {
    const id = R.reverse(data).findIndex((item) => item[y] === 1);
    idx -= id;
  }
  let _warnIdx = -1;

  const nextData = res.map((item, i) => {
    let color = colorArr[item[y]] || '#23d';
    let _warn = false;
    if (gzMode) {
      // 前面未印刷的产品，显示红色
      if (i < idx && item[y] === 0) {
        color = colorArr[2];
        _warn = true;
        _warnIdx++;
      }
    }
    return {
      ...item,
      backgroundColor: color,
      title: item[x],
      legend: item[legend],
      cart: item[cart],
      _warn,
      _warnIdx,
    };
  });

  return { data: nextData, warnNum: _warnIdx };
};
