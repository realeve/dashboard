import { saveAs } from 'file-saver';
import moment from 'dayjs';
import beautify from 'js-beautify';
import * as axios from './axios';
import * as R from 'ramda';

export const now = () => moment().format('YYYY-MM-DD HH:mm:ss');
export const ymd = () => moment().format('YYYYMMDD');

export const saveDashboard = layout => {
  const beautyOption = {
    indent_size: 2,
    wrap_line_length: 80,
    jslint_happy: true,
  };
  const code: string = beautify(JSON.stringify(layout), beautyOption);
  const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
  saveAs(blob, '仪表盘_' + now() + '.dashboard');
};

/**
 *
 * @param {file文件对象，input type="file"} file
 * @param {回调函数} callback
 * @desc 将file图像文件对象转换为BASE64
 */
export let loadDataFile: (file: File) => Promise<null | Blob> = async (file: File) => {
  if (typeof FileReader === 'undefined') {
    return Promise.resolve(null);
  }

  let reader: FileReader = new FileReader();

  //   　1、readAsText，以纯文本的形式读取文件，将读取到的文件保存到result属性中；
  // 　　2、readAsDataURL，读取文件，并将文件数据URL保存到result属性中；
  // 　　3、readAsArrayBuffer，读取文件，并将

  reader.readAsText(file);

  return new Promise(resolve => {
    reader.onload = ({ target: { result } }: { target: { result: Blob } }) => {
      resolve(result);
    };
  });
};

export const loadDashboard = async file => {
  let str = await loadDataFile(file).then(buffer => buffer || '[]');
  return JSON.parse(str as string);
};

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

  let numStr: string = Number(num).toLocaleString();
  if (numStr.includes('.')) {
    let [integer, decimal] = numStr.split('.');
    return integer + '.' + decimal.padEnd(decimalLength, '0');
  }
  if (decimalLength === 0) {
    return numStr;
  }
  return numStr + '.' + ''.padEnd(decimalLength, '0');
};

export const noncer = () =>
  Math.random()
    .toString(16)
    .slice(2);

export const getType = axios.getType;

interface Store {
  payload: any;
}
export const setStore = (state, store: Store) => {
  let { payload } = store;
  if (typeof payload === 'undefined') {
    payload = store;
    // throw new Error('需要更新的数据请设置在payload中');
  }
  let nextState = R.clone(state);
  Object.keys(payload).forEach(key => {
    let val = payload[key];
    if (getType(val) == 'object') {
      nextState[key] = Object.assign({}, nextState[key], val);
    } else {
      nextState[key] = val;
    }
  });
  return nextState;
};
