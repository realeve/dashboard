import React, { useState, Suspense, useEffect, useRef, useMemo } from 'react';

import type { IPanelConfig, IApiProps } from '@/models/common';

import * as R from 'ramda';
import { Skeleton, Spin } from 'antd';
import useFetch from '@/component/hooks/useFetch';

import { isArray } from '@antv/util';
import type { Dayjs } from 'dayjs';
import ranges from '@/utils/range';
import qs from 'qs';
import { chartList } from '@/component/chartItem/option';

export type tRender = 'canvas' | 'svg';

// const Echarts = React.lazy(() => import('@/component/echarts'));
// const G2 = React.lazy(() => import('@/component/g2'));
// const G2Plot = React.lazy(() => import('@/component/g2plot'));

export const getDefaultValue = (arr: { key?: string; defaultValue: any }[] = []) => {
  const obj = {};
  arr.forEach((item) => {
    item.key && (obj[item.key] = item.defaultValue);
  });
  return obj;
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
 * 从默认的config列表中提取defaultValue，注入到组件中，这样不用再到组件中重复定义默认值
 */
export const getApiConfig = (config, lib) => {
  let api: IApiProps = config.api || { dateType: '本月' };

  const objComponent = getDefaultValue(lib?.config);
  const objApi = getDefaultValue(lib?.apiConfig?.config);
  api = { ...objComponent, ...(config.componentConfig || {}), ...objApi, ...api };
  return api;
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

interface ChartInstanceProps {
  config: IPanelConfig;
  style?: React.CSSProperties;
  title?: string;
  chartid?: string;
  onLoad?: (e: string) => void;
}

type ChartRenderProps = {
  chartLib: any;
} & ChartInstanceProps;

const ChartRender = ({
  config,
  title,
  style = {},
  onLoad,
  chartid,
  chartLib,
}: ChartRenderProps) => {
  const [inited, setInited] = useState(false);
  const ref = useRef(null);

  const { default: method, defaultOption = {}, ...lib } = chartLib;

  const api: IApiProps = getApiConfig(config, lib);

  const valid = config.ajax && api?.api_type === 'url' && api?.url?.length > 0;

  const param = useMemo(() => {
    return getAxiosParam({
      api_type: api.api_type,
      url: api.url,
      dataType: api.dataType,
      dateType: api.dateType,
      cache: api.cache,
      appendParam: api.appendParam,
    });
  }, [api.api_type, api.url, api.dateType, api.cache, api.appendParam]);

  const { data, loading, error } = useFetch({
    param,
    valid: () => valid,
    interval:
      typeof api.interval === 'undefined' ? 0 : parseInt(`${Number(api.interval) * 60}`, 10),
    callback(e) {
      if (e && e.title) {
        onLoad(e.title);
      }
      return e;
    },
  });

  // let ChartInst = null;
  // if (config.engine === 'other') {
  //   ChartInst = method;
  // } else {
  //   ChartInst = React.lazy(() => import(`../../../component/${config.engine}`));
  // }

  if (error) {
    return <div style={{ color: '#eee' }}>数据请求出错</div>;
  }

  // 在callback中会触发该效果，无需再次调用
  // if (api?.api_type === 'mock' && mock && mock.title) {
  //   onLoad(mock.title);
  // }

  if (valid && ((loading && !inited) || !data)) {
    return <Skeleton />;
  }

  if (!inited) {
    setInited(true);
  }
  // defaultOption 可能为函数，由config计算得出
  let appendConfig: { renderer: tRender } = { renderer: 'canvas' };

  if (defaultOption) {
    appendConfig = R.type(defaultOption) === 'Function' ? defaultOption(config) : defaultOption;
  }

  const mock = api.mock ? JSON.parse(api.mock) : lib?.mock;
  // 合并后的属性
  const injectProps = {
    data: valid ? data : mock,
    ...api,
  };

  if (config.engine === 'echarts') {
    const chart = ref?.current?.echartsInstance;
    const Echarts = React.lazy(() => import('@/component/echarts'));
    return (
      <Suspense fallback={<Spin spinning />}>
        <Echarts
          ref={ref}
          option={method(injectProps, chart)}
          renderer={appendConfig.renderer || 'canvas'}
          style={style}
        />
      </Suspense>
    );
  }
  if (config.engine === 'g2plot') {
    const G2Plot = React.lazy(() => import('@/component/g2plot'));
    const option = method({
      ...injectProps,
      autoFit: true,
    });

    let appendPadding = config.showBorder ? 20 : 0;

    // 处理边距
    if (option.appendPadding) {
      appendPadding = isArray(option.appendPadding)
        ? option.appendPadding.map((item) => item + appendPadding)
        : appendPadding + option.appendPadding;
    }
    return (
      <Suspense fallback={<Spin spinning />}>
        <G2Plot
          option={{ ...option, appendPadding }}
          renderer={appendConfig.renderer || 'canvas'}
          style={style}
        />
      </Suspense>
    );
  }
  if (config.engine === 'g2') {
    const G2 = React.lazy(() => import('@/component/g2'));
    return (
      <Suspense fallback={<Spin spinning />}>
        <G2
          option={{
            onMount: method,
            transformer: lib.transformer || null,
            ...injectProps,
          }}
          style={style}
        />
      </Suspense>
    );
  }
  if (config.engine === 'other') {
    const ChartInst = method;
    return (
      <ChartInst panelStyle={config.style} option={injectProps} chartid={chartid} style={style} />
    );
  }

  return <div style={{ color: '#fff', fontSize: 20, ...style }}>{title}</div>;
};

export default (props: ChartInstanceProps) => {
  if (!chartList.includes(props.config.key)) {
    return (
      <div style={{ color: '#eee', fontSize: 30, lineHeight: 2 }}>
        组件渲染出错：
        <br />
        @/component/chartItem/option 中 未导出函数 {props.config.key}，请仔细检查
      </div>
    );
  }

  const [chartLib, setChartLib] = useState(null);
  useEffect(() => {
    import(`../../../component/chartItem/charts/${props.config.key}`).then((res) => {
      setChartLib({ ...res.default });
    });
  }, []);

  if (!chartLib) {
    return <Spin spinning />;
  }
  return <ChartRender {...props} chartLib={chartLib} />;
};
