import moment from 'dayjs';
import * as axios from './axios';
import * as R from 'ramda';
import type { IPanelConfig, ICommon } from '@/models/common';
import { MAX_HISTORY_STEP } from '@/models/common';
import type { IAxiosState } from './axios';
import { isArray } from '@antv/util';

export const now = () => moment().format('YYYY-MM-DD HH:mm:ss');
export const ymd = () => moment().format('YYYYMMDD');

/**
 *
 * @param {file文件对象，input type="file"} file
 * @param {回调函数} callback
 * @desc 将file图像文件对象转换为BASE64
 */
export const loadDataFile: (file: File | Blob) => Promise<null | string | ArrayBuffer> = async (
  file: File,
) => {
  // if (typeof FileReader === 'undefined') {
  //   return Promise.resolve(null);
  // }

  const reader: FileReader = new FileReader();

  // 1、readAsText，以纯文本的形式读取文件，将读取到的文件保存到result属性中；
  // 2、readAsDataURL，读取文件，并将文件数据URL保存到result属性中；
  // 3、readAsArrayBuffer，读取文件，并将

  try {
    reader.readAsText(file);
  } catch (e) {
    return Promise.reject(e.message);
  }

  return new Promise((resolve) => {
    reader.onload = ({ target: { result } }: { target: { result: string | ArrayBuffer } }) => {
      resolve(result);
    };
  });
};

// 数字
export const isNumOrFloat = (str) => /^(-|\+|)\d+(\.)\d+$|^(-|\+|)\d+$/.test(String(str));

interface CartReelReg {
  (str: string | number): boolean;
}

export const isDateTime: CartReelReg = (str) =>
  /^\d{4}(-|\/|)[0-1]\d(-|\/|)[0-3]\d$|^\d{4}(-|\/|)[0-1]\d(-|\/|)[0-3]\d [0-2][0-9]:[0-5][0-9](:[0-5][0-9])$|^[0-2][0-9]:[0-5][0-9](:[0-5][0-9])$/.test(
    String(str).trim(),
  );

export const isDate: CartReelReg = (str) =>
  /^\d{4}(-|\/|)[0-1]\d(-|\/|)[0-3]\d$|^\d{4}(-|\/|)[0-1]\d(-|\/|)[0-3]\d$/.test(
    String(str).trim(),
  );
export const isTime: CartReelReg = (str) =>
  /^\d{4}(-|\/|)[0-1]\d(-|\/|)[0-3]\d [0-2][0-9]:[0-5][0-9](:[0-5][0-9])|^[0-2][0-9]:[0-5][0-9](:[0-5][0-9])(|.\d)/.test(
    String(str).trim(),
  );

// 整数
export const isInt: CartReelReg = (str) => /^(-|\+|)?[0-9]\d*$/.test(String(str));

/**
 * cart:车号
 * reel:轴号
 * reel_cart:纸张上下5千车号
 * reel_patch:纸张批次号
 * pallet:纸张拍号
 * plate:印版
 */
interface Rules {
  cart: RegExp;
  reel: RegExp;
  reel_cart: RegExp;
  reel_patch: RegExp;
  pallet: RegExp;
  plate: RegExp;
  phone: RegExp;
  url: RegExp;
  [key: string]: RegExp;
}
export const rules: Rules = {
  cart: /^[0-9]\d{3}[A-Za-z]\d{3}(|[a-bA-B])$|^BP\d{2}[A-Z]\d{3}$/, // 车号
  // reel: /^[1-9]\d{6}(|[A-Ca-c])$|[A-Z]\d{11}[A-Z]/, //^[1-9]\d{4}[A-Ca-c]$|
  reel: /^[0-9]\d{6}([A-Ca-c]|)$|[A-Z]\d{11}([A-Z]|)|^\d{3}[A-Z]\d{5}(|[A-Z])$/, // 轴号 //^[1-9]\d{4}[A-Ca-c]$|
  reel_cart: /^[0-9]\d{3}[A-Za-z]\d{3}([A-B]|[a-b])$/,
  reel_patch: /^\d{5}([A-Z|a-z])\d$/,
  pallet: /^\d{2}(0[1-9]|1[0-2])\d{2}(1|2)\d{6}$/,
  plate: /^[A-Z|a-z]{2}\d{6}$|^[A-Z|a-z]{2}\d{8}$|^\d{8}$|^\d{6}$/,
  phone: /^\d{8}$|^\d{11}$/,
  url: /^http(s|):\/\//,
};

export const isCartOrReel: CartReelReg = (str) => {
  return rules.cart.test(String(str).trim()) || rules.reel.test(String(str).trim());
};

export const isCart: CartReelReg = (str) => rules.cart.test(String(str).trim());
export const isReel: CartReelReg = (str) => rules.reel.test(String(str).trim());
export const isPlate: CartReelReg = (str) => rules.plate.test(String(str).trim());

export const isUrl = (str) => rules.url.test(String(str).trim());

// 浮点
export const isFloat: CartReelReg = (str) =>
  !isCart(str) &&
  (isNumOrFloat(str) ||
    /^(-|\+|)\d+\.\d+(|e|E)(|-|\+)\d+$|^(-|\+|)\d+(|e|E)(|-|\+)\d+$/.test(String(str)));

export const isChineseWord = (str) => new RegExp(/[\u00A1-\uFFFF]/).test(str);

// 中文宽1，其余宽0.7
export const getStringWidth = (str) => {
  if (isFloat(str)) {
    str = Number(str).toFixed(2);
  }
  return String(str)
    .trim()
    .split('')
    .reduce((x, y) => x + (isChineseWord(y) ? 1 : 0.7), 0);
};

export const loadDashboard = async (file: File | Blob) =>
  loadDataFile(file)
    .then((str) => JSON.parse(str as string))
    .catch((e) => {
      return Promise.reject(e);
    });

export const encodeBase64 = (str: string) => window.btoa(unescape(encodeURIComponent(str)));
export const decodeBase64 = (str: string) => decodeURIComponent(escape(window.atob(str)));

/**
 * 千分位格式化数字
 * @param {数字} num
 * @param {小数位数} decimalLength
 */
export const thouandsNum: {
  (num: number, len?: number): string;
} = (num, decimalLength = 0) => {
  if (String(num).length === 0) {
    return '';
  }

  const numStr: string = Number(num).toLocaleString();
  if (numStr.includes('.')) {
    const [integer, decimal] = numStr.split('.');
    return `${integer}.${decimal.padEnd(decimalLength, '0')}`;
  }
  if (decimalLength === 0) {
    return numStr;
  }
  return `${numStr}.${''.padEnd(decimalLength, '0')}`;
};

export const noncer = () => Math.random().toString(16).slice(2);

export const { getType } = axios;

export interface Store {
  payload: any;
}
export const setStore: <T = ICommon>(prevState: T, store: Store) => T = (
  prevState,
  store: Store,
) => {
  let { payload } = store;
  if (typeof payload === 'undefined') {
    payload = store;
    // throw new Error('需要更新的数据请设置在payload中');
  }
  const nextState = R.clone(prevState);
  Object.keys(payload).forEach((key) => {
    const val = payload[key];
    if (getType(val) === 'object') {
      nextState[key] = { ...nextState[key], ...val };
    } else {
      nextState[key] = val;
    }
  });
  return nextState;
};

export const handleHistoryPanel: (
  prevState: ICommon,
  nextState: ICommon,
  store: Store,
) => ICommon = (prevState, nextState, store: Store) => {
  const panel = store.payload?.panel;
  // 需要记录历史记录
  const recordHistory = store.payload?.recordHistory === true;

  // console.log({ recordHistory, panel });

  if (panel && recordHistory) {
    let nextHistory: { panel: IPanelConfig[]; title: string | null }[] = prevState.history;
    const title: string | null = store.payload?.historyTitle || null;

    // 需要覆盖后面的历史记录
    const coverPrev = prevState.curHistoryIdx < nextHistory.length - 1;

    // 写入一项panel
    nextHistory = coverPrev
      ? [...nextHistory.slice(0, prevState.curHistoryIdx + 1), { panel, title }]
      : [...nextHistory, { panel, title }];

    if (nextHistory.length > MAX_HISTORY_STEP) {
      nextHistory.shift();
    }
    // nextHistory = R.reject((item) => item.panel.length == 0, nextHistory);

    // 在删除组件的场景中，此处的panel为空，需要重新处理
    // console.log({ title, nextHistory, panel });
    nextState = {
      ...nextState,
      history: nextHistory,
      curHistoryIdx: Math.max(nextHistory.length - 1, 0),
    };
  }
  return nextState;
};

export const json2Array: <T extends any[] | axios.TDbWrite>(data: IAxiosState) => IAxiosState<T> = (
  data: IAxiosState,
) => {
  if (!data?.data?.length) {
    return data;
  }
  const res = data.data[0];
  if (isArray(res)) {
    return data;
  }

  const _data = R.clone(data.data).map((item) => Object.values(item));
  return { ...data, data: _data };
};

// array2json
export const array2Json: <T extends any[] | axios.TDbWrite>(data: IAxiosState) => IAxiosState<T> = (
  data: IAxiosState,
) => {
  if (!data?.data?.length) {
    return data;
  }
  const res = data.data[0];
  if (!isArray(res)) {
    return data;
  }
  const { header } = data;
  const _data = R.clone(data.data).map((item) => {
    const obj = {};
    item.forEach((td, i) => {
      obj[header[i]] = td;
    });
    return obj;
  });
  return { ...data, data: _data };
};

export const getDataType = (mock: IAxiosState) => {
  if (!mock || !mock.data) {
    return 'array';
  }
  return isArray(mock.data[0]) ? 'array' : 'json';
};

export const getTableExtraLabel = ({ header, data }) => {
  if (R.isNil(data) || data.length === 0) {
    return [];
  }
  return header.map((item, idx) => `${item}:${data[0][idx]}`);
};

// /**
//  * 处理js中的小数显示
//  *
//  * @param num 需要处理的数据
//  */
// export const prettyNumber = (num:string|number)=>{
//   let nextNum = Number(num)
// }
