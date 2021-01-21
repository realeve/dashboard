import { getDataType } from '@/utils/lib';
import type { IApiProps } from '@/models/common';
import type { Dayjs } from 'dayjs';
import ranges from '@/utils/range';
import qs from 'qs';
import type { IAxiosState } from '@/utils/axios';
import * as R from 'ramda';

export const getDefaultValue = (arr: { key?: string; defaultValue: any }[] = []) => {
  const obj = {};
  arr.forEach((item) => {
    item.key && (obj[item.key] = item.defaultValue);
  });
  return obj;
};

/**
 * 从默认的config列表中提取defaultValue，注入到组件中，这样不用再到组件中重复定义默认值
 */
export const getApiConfig = (config, lib) => {
  const api: IApiProps = config.api || { dateType: '本月' };

  const objComponent = getDefaultValue(lib?.config);
  const objApi = getDefaultValue(lib?.apiConfig?.config);
  const apiConfig = R.clone(lib?.apiConfig || {});
  apiConfig.api_type = lib?.apiConfig.type || '';
  Reflect.deleteProperty(apiConfig, 'type');
  Reflect.deleteProperty(apiConfig, 'config');

  const initApi = {
    showReport: api?.showReport || false,
    reportParam: api?.reportParam || '',
    ...apiConfig,
    dataType: getDataType(lib.mock),
  };

  return {
    ...initApi,
    ...objComponent,
    ...(config.componentConfig || {}),
    ...objApi,
    ...api,
  };
};

export const getRange = ({ dateType = '本月' }: { dateType?: string }) => {
  const currentRange = ranges[dateType];
  if (!currentRange) {
    return {};
  }
  const [start, end]: [Dayjs, Dayjs] = currentRange;
  const tstart = start.format('YYYYMMDD');
  const tend = end.format('YYYYMMDD');
  return { tstart, tend, tstart2: tstart, tend2: tend, tstart3: tstart, tend3: tend };
};

/**
 *
 * @param api 基础设置
 */
export const getAxiosParam = (api: {
  api_type: 'url' | 'mock';
  url: string;
  dateType: string;
  dataType: 'array' | 'json';
  cache?: number;
  appendParam?: string;
}) => {
  const params = { ...getRange(api), cache: api.cache ?? 2 };
  let url = api?.api_type === 'url' ? api?.url : null;
  if (!url) {
    return { url, params };
  }

  let append = api?.appendParam || '';
  if (append[0] === '?') {
    append = append.slice(1);
  }

  // 处理追加的参数
  let param = qs.parse(append);
  // 处理url中的参数
  if (url.includes('?')) {
    const [_url, _append] = url.split('?');
    const param2 = qs.parse(_append);
    param = { ...param, ...param2 };
    url = _url;
  }

  // url中不包含数据类型  array/json的
  if (!/(.*)+(\.|\/)(array|json)$/.test(url)) {
    if (api.dataType === 'array') {
      url += '/array';
    }
  }
  return { url, params: { ...params, ...param } };
};

export const handleCarouselData = (data, { isCarousel, onLoad, carouselKey }) => {
  if (!data) {
    return data;
  }
  if (!isCarousel) {
    onLoad(data.title);
    return [data];
  }

  // 处理数据滚动逻辑
  const arrayRow = getDataType(data) === 'array';
  const keyName: string = arrayRow ? carouselKey : data.header[carouselKey];
  const groupData = R.groupBy<IAxiosState>(R.prop<string>(keyName))(data.data);
  const nextCarouselData = Object.entries(groupData).map(([name, value]: [string, []]) => ({
    ...data,
    title: `${data.title}(${name})`,
    data: value,
    rows: value.length,
    key: name,
  }));

  // 第一组数据的标题更新
  onLoad(nextCarouselData[0].title);

  return nextCarouselData;
};
