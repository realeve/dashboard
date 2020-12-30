import { isArray } from '@antv/util';
import * as R from 'ramda';

/**
 * 根据品种获取冠字列表的行列式
 * @param prod 品种
 */
let getTemplate = (prod) => {
  let FormatPos40 = ['9602A', '9603A', '9602T', '9603T'].includes(prod);
  let colRow = FormatPos40 ? [25, 10] : [26, 11];
  let arr = [];
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
  let dataType = isArray(data[0]);
  let y = dataType ? _y : header[_y];
  let res = R.clone(data);

  // 从此id开始产品未印刷，小于它的视为跳号
  let id = R.reverse(data).findIndex((item) => item[y] == 1);
  let idx = res.length - id;

  let template = getTemplate(prod);

  return template.map((temp, j) => {
    let item = res[j];
    if (!item) {
      temp[2] = EStatus.NO_CODE; // 印码未印刷
      return temp;
    }
    let status = Number(item[y]);
    if (j < idx && status == 0) {
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
  let dataType = isArray(data[0]);
  let x = dataType ? _x : header[_x],
    y = dataType ? _y : header[_y],
    legend = dataType ? _legend : header[_legend],
    cart = dataType ? _cart : header[_cart];
  let res = R.clone(data);

  // 从此id开始产品未印刷，小于它的视为跳号
  let idx = res.length;
  if (gzMode) {
    let id = R.reverse(data).findIndex((item) => item[y] == 1);
    idx = idx - id;
  }
  let _warnIdx = -1;

  let nextData = res.map((item, i) => {
    let color = colorArr[item[y]] || '#23d';
    let _warn = false;
    if (gzMode) {
      // 前面未印刷的产品，显示红色
      if (i < idx && item[y] == 0) {
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
