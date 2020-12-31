import type { AxiosRequestConfig, AxiosResponse, AxiosError as _AxiosError } from 'axios';
import http from 'axios';
import qs from 'qs';
import { host } from './setting';
import { notification } from 'antd';
import * as R from 'ramda';
import localforage from 'localforage';

export { DEV } from './setting';

export interface GlobalAxios {
  host: string;
  token: string;
}

/**
 * @param affected_rows 数据写操作返回的成功条数
 */
export interface TDbWrite { affected_rows?: number; id?: number; [key: string]: any }
export type TAxiosData = TDbWrite | any[];
/**
 * @param title:标题
 * @param rows 数据行
 * @param data 数据
 * @param header 字段列表，报表头
 * @param ip IP地址
 * @param date 请求日期
 * @param source 数据来源:某数据库
 * @param time 当前时间
 * @param serverTime 服务器时间
 * @param hash 当前数据的hash值，数据变更时hash变更
 */
export interface IAxiosState<T = TAxiosData> {
  title: string;
  rows: number;
  data: T[];
  header: string[];
  ip?: string;
  date?: string[];
  source?: string;
  time?: number;
  serverTime: string;
  hash: string;
  token?: string;
  [key: string]: any;
}

declare global {
  interface Window {
    g_axios: GlobalAxios;
  }
}

const refreshNoncer =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1NDM4NTI0NDcsIm5iZiI6MTU0Mzg1MjQ0NywiZXhwIjoxNTQzODU5NjQ3LCJ1cmwiOiJodHRwOlwvXC9sb2NhbGhvc3Q6OTBcL3B1YmxpY1wvbG9naW4uaHRtbCIsImV4dHJhIjp7InVpZCI6MSwiaXAiOiIwLjAuMC4wIn19.65tBJTAMZ-i2tkDDpu9DnVaroXera4h2QerH3x2fgTw';

export const codeMessage: Record<number, string> = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

export const _commonData: IAxiosState = {
  rows: 1,
  data: [{ affected_rows: 1, id: Math.ceil(Math.random() * 100) }],
  time: 20,
  ip: '127.0.0.1',
  title: '数据更新/插入/删除返回值',
  hash: 'hash',
  header: ['affected_rows', 'id'],
  serverTime: '2020-12-31 00:00:00',
};

// 导出数据，随机时长
export type MockFn = <T>(path: T, time?: number) => Promise<T>;
export const mock: MockFn = (path, time = Math.random() * 1000) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(path);
    }, time);
  });

type TypeList =
  | 'object'
  | 'number'
  | 'boolean'
  | 'string'
  | 'null'
  | 'array'
  | 'regexp'
  | 'function'
  | 'undefined'
  | 'symbol';
export const getType: (data: any) => TypeList = (data) => R.type(data).toLowerCase() as TypeList;

export const loadUserInfo = (user) => {
  if (user == null) {
    window.g_axios.token = refreshNoncer;
    saveToken();
    return {
      token: refreshNoncer,
    };
  }

  window.g_axios.token = user.token;
  return { token: user.token };
};

// let refreshNoncer = () => {
// 此时可将引用url链接作为 url 参数请求登录，作为强校验；
// 本部分涉及用户名和密码，用户需自行在服务端用curl申请得到token，勿放置在前端;
// let url: string = window.g_axios.host + 'authorize.json?user=admin_username&psw=yourpassword';
// return http.get(url).then(res => res.data.token);
// };

const saveToken = () => {
  localforage.setItem('user', {
    token: window.g_axios.token,
  });
};
export interface AxiosError {
  message: string;
  description: string;
  url: string;
  params: any;
  status?: number;
}
export const handleError: (error: _AxiosError) => Promise<AxiosError | null> = async (error) => {
  const config = error.config || {};
  const str = config.params || config.data || {};
  const { id, nonce, ...params } = typeof str === 'string' ? qs.parse(str) : str;
  Reflect.deleteProperty(params, 'tstart2');
  Reflect.deleteProperty(params, 'tend2');
  Reflect.deleteProperty(params, 'tstart3');
  Reflect.deleteProperty(params, 'tend3');

  if (typeof error.message === 'undefined') {
    // 路由取消
    return null;
  }

  config.url += `${id ? `${id  }/${  nonce}` : ''}?${qs.stringify(params)}`;
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    const { data, status } = error.response;
    // if (status === 401) {
    //   history.push('/unlogin');
    // }

    const errortext = (codeMessage[status] || '') + (data.msg || '');
    notification.error({
      message: `请求错误 ${status}: ${config.url}`,
      description: errortext || '',
      duration: 10,
    });
    return Promise.reject({
      status,
      message: `请求错误: ${config.url}`,
      description: `${errortext || ''}`,
      url: error.config.url || '',
      params,
    });
  } if (error.request) {
    // The request was made but no response was received
    // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
    // http.ClientRequest in node.js
    // console.log(error.request);
  }
  return Promise.reject({
    message: '请求错误',
    description: error.message || '',
    url: (config && config.url) || '',
    params,
  });
};

export const handleData: <T extends IAxiosState>({ data }: AxiosResponse<T>) => T = ({ data }) => {
  // 刷新token
  if (typeof data.token !== 'undefined') {
    window.g_axios.token = data.token;
    saveToken();
    // 移除token
    Reflect.deleteProperty(data, 'token');
  }
  return data;
};

export const handleUrl = (option) => {
  if (option.url && option.url[0] === '.') {
    option.url = window.location.origin + option.url.slice(1);
  }
  return option;
};

type IAxiosConfig = {
  url?: string | IAxiosState;
} & Omit<AxiosRequestConfig, 'url'>

// 自动处理token更新，data 序列化等
export const axios: <T = TAxiosData>(params: IAxiosConfig) => Promise<IAxiosState<T>> = ({
  baseURL = host,
  ..._option
}) => {
  if (typeof _option.url === 'object') {
    return mock(_option.url);
  }
  window.g_axios = window.g_axios || {
    host,
    token: '',
  };
  // token为空时自动获取
  if (window.g_axios.token === '') {
    localforage.getItem('user').then(loadUserInfo);
  }

  let option: AxiosRequestConfig = handleUrl(_option);

  option = Object.assign(option, {
    headers: {
      Authorization: window.g_axios.token,
    },
    method: option.method || 'get',
  });

  return http
    .create({
      baseURL,
      timeout: 30 * 1000,
      transformRequest: [
        function (data) {
          const dataType = getType(data);
          switch (dataType) {
            case 'object':
            case 'array':
              data = qs.stringify(data);
              break;
            default:
              break;
          }
          return data;
        },
      ],
    })(option)
    .then(handleData)
    .catch(handleError);
};
