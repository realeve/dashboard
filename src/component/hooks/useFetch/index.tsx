import { useState, useEffect } from 'react';
import type { AxiosError } from '@/utils/axios';
import { mock, axios } from '@/utils/axios';
import type { AxiosRequestConfig } from 'axios';
import http from 'axios';
import * as R from 'ramda';
import { useInterval } from 'react-use';

import { isDocumentVisible, limit } from './lib';
import { now } from '@/utils/lib';
import subscribeFocus from './windowFocus';
import subscribeVisible from './windowVisible';

/**
 *
 * @param axios所返回数据的自动解析，在返回数据只有单个对象时使用
 * @example: callback({[key:string]:value}) === value
 * @return value 此处无论key为何值，
 */
export const callback = <T extends Record<string, any>>(data: Record<string, any>): T =>
  Object.values(data)[0];

const { CancelToken } = http;

export interface IFetchProps<T> {
  param?: AxiosRequestConfig | null;
  initData?: T;
  valid?: (e?: any) => boolean;
  callback?: (data: any) => T;
  interval?: number;
  pollingWhenHidden?: boolean;
  refreshOnWindowFocus?: boolean;
  focusTimespan?: number;
  [key: string]: any;
}
export interface IFetchResponse<T> {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
  setData: (data: T) => void;
  reFetch: () => void;
}

/**
 * React hooks，数据获取
 * @param param axios请求的参数
 * @param initData 模拟数据请求时传入的初始数据，如果传入了数据则优先使用模拟数据，否则使用param的接口参数发起请求
 * @param callback 对数据的回调处理
 * @param valid 数据发起前有效性校验,返回true时正常发起请求调用，为False中断调用
 * @param interval 定时刷新
 * @param refreshOnWindowFocus 窗口聚焦刷新
 * @param pollingWhenHidden 窗体隐藏时是否继续刷新数据
 * @param focusTimespan focus后几秒重新加载数据
 * 
 * @return data 接口返回的数据
   @return loading 数据载入状态
   @return error 抛错
   @return setData 函数，手工设置data的数据值，如初始化的值
   @return reFetch 函数，手工强制刷新，由于是监听param的值(url,data,params)，在它们不变更的时候也应有刷新的机制
 */
const useAxios = <T extends {} | void>({
  param,
  initData,
  callback: onFetchData = (e) => e,
  interval = 0,
  valid = () => true,
  refreshOnWindowFocus = true,
  pollingWhenHidden = false,
  focusTimespan = 5,
}: IFetchProps<T>): IFetchResponse<T> => {
  // unmounted时才更新数据
  let unmounted = false;

  // 初始化数据
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);

  // 用于强制刷新
  const [innerTrigger, setInnerTrigger] = useState(0);

  const [pollingWhenVisibleFlag, setPollingWhenVisibleFlag] = useState(true);

  const [unscribe, setUnscribe] = useState([]);

  // 首次加载
  useEffect(() => {
    // 同时未传时，返回空值
    // 部分场景允许不设置param时，返回默认状态为空的数据
    // 如，多个tab条的切换点击
    if (R.isNil(param) || (!param && !initData)) {
      !unmounted && setData(null);
      return;
    }
    // 数据请求前校验
    if (typeof param.url === 'undefined' || !param.url || param.url.length === 0 || !valid()) {
      !unmounted && setData(null);
      return;
    }

    !unmounted && setLoading(true);

    // 数据mock
    if (initData) {
      mock<T>(initData).then((v) => {
        // 如果为空就不再进行设置
        // if (v.length === 0) {
        //   return;
        // }
        !unmounted && setData(v);
        !unmounted && setLoading(false);
      });
      return;
    }

    const source = CancelToken.source();

    param.cancelToken = source.token;

    // 从后端发起请求
    axios(param as AxiosRequestConfig)
      .then((response: any) => {
        if (unmounted) {
          return;
        }
        if (onFetchData) {
          setData(onFetchData(response));
        } else {
          setData(response);
        }
        setLoading(false);
      })
      .catch((e: any) => {
        !unmounted && setError(e);
        !unmounted && setLoading(false);
        throw e;
      })
      .finally(() => {
        // 如果屏幕隐藏，并且 !pollingWhenHidden, 则停止轮询，并记录 flag，等 visible 时，继续轮询
        const needRefresh = !isDocumentVisible() && !pollingWhenHidden;
        setPollingWhenVisibleFlag(!needRefresh);
      });

    // 路由变更时，取消axios
    // eslint-disable-next-line
    return () => {
      unmounted = true;
      source.cancel();
    };
    // 监听axios数据请求中 url、get/post关键参数
  }, [param.url, JSON.stringify(param.params), JSON.stringify(param.data), initData, innerTrigger]);

  const reFetch = () => {
    // 数据刷新的场景中，重置innerTrigger，在useFetch中会
    console.log('即将刷新:', now());
    setInnerTrigger(+new Date());
  };

  const limitRefresh = limit(reFetch, focusTimespan * 1000);
  const rePolling = () => {
    setPollingWhenVisibleFlag(true);
    console.log('页面获得焦点，触发刷新', now());
  };

  // 初始时
  useEffect(() => {
    const next = [];
    if (interval > 0) {
      next.push(subscribeVisible(rePolling));
    }
    if (refreshOnWindowFocus) {
      next.push(subscribeFocus(limitRefresh));
    }
    setUnscribe(next);
    return () => {
      unscribe.forEach((s) => {
        s();
      });
    };
  }, []);

  // 定时自动刷新
  useInterval(reFetch, pollingWhenVisibleFlag && interval > 0 ? interval * 1000 : null);

  return {
    data,
    loading,
    error,
    setData,
    reFetch,
  };
};

export default useAxios;
