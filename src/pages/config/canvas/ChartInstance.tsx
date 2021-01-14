import React, { useState, Suspense, useEffect, useRef, useMemo } from 'react';

import type { IPanelConfig, IApiProps } from '@/models/common';
import type { IAxiosState } from '@/utils/axios';

import * as R from 'ramda';
import { Skeleton, Spin } from 'antd';
import useFetch from '@/component/hooks/useFetch';

import { isArray } from '@antv/util';
import type { Dayjs } from 'dayjs';
import ranges from '@/utils/range';
import qs from 'qs';
import { chartList } from '@/component/chartItem/option';
import { getDataType } from '@/utils/lib';

import Carousel from './Carousel';

export type tRender = 'canvas' | 'svg';

const Echarts = React.lazy(() => import('@/component/echarts'));
const G2 = React.lazy(() => import('@/component/g2'));
const G2Plot = React.lazy(() => import('@/component/g2plot'));

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
  const api: IApiProps = config.api || { dateType: '本月' };

  const objComponent = getDefaultValue(lib?.config);
  const objApi = getDefaultValue(lib?.apiConfig?.config);
  const initApi = {
    url: lib?.apiConfig?.url,
    cache: lib?.apiConfig?.cache,
    interval: lib?.apiConfig?.interval,
    dataType: getDataType(lib.mock),
    api_type: lib?.apiConfig?.type,
  };

  return {
    ...initApi,
    ...objComponent,
    ...(config.componentConfig || {}),
    ...objApi,
    ...api,
  };
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

const handleCarouselData = (data, { isCarousel, onLoad, carouselKey }) => {
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

  const valid =
    api?.api_type === 'mock' || (config.ajax && api?.api_type === 'url' && api?.url?.length > 0);

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

  const isCarousel = config.api.isCarousel || false;

  const mock =
    api?.api_type === 'mock' || !config.ajax
      ? (api.mock && JSON.parse(api.mock)) || lib?.mock
      : null;

  const { data, error } = useFetch({
    param,
    initData: mock,
    valid: () => valid,
    interval:
      typeof api.interval === 'undefined' ? 0 : parseInt(`${Number(api.interval) * 60}`, 10),
    callback: (e) =>
      handleCarouselData(e, { isCarousel, carouselKey: config.api.carouselKey, onLoad }),
  });

  if (error) {
    return (
      <div style={{ color: '#eee', fontSize: 18 }}>
        数据请求出错
        <br />
        {error}
      </div>
    );
  }

  if (valid && !data && !inited) {
    return <Skeleton />;
  }

  if (!inited) {
    setInited(true);
  }

  // 合并后的属性
  const injectProps = {
    data: valid ? data : mock,
    ...api,
  };

  // 在callback中会触发该效果，无需再次调用
  // if (api?.api_type === 'mock' && mock && mock.title) {
  //   onLoad(mock.title);
  // }

  // defaultOption 可能为函数，由config计算得出
  let appendConfig: { renderer: tRender } = { renderer: 'canvas' };

  if (defaultOption) {
    appendConfig = R.type(defaultOption) === 'Function' ? defaultOption(config) : defaultOption;
  }

  if (config.engine === 'echarts') {
    const chart = ref?.current?.echartsInstance;
    return (
      <Suspense fallback={<Spin spinning />}>
        <Carousel
          injectProps={injectProps}
          onLoad={onLoad}
          Slide={({ dataItem }) => (
            <Echarts
              ref={ref}
              key={dataItem.key || dataItem.hash}
              option={method({ data: dataItem, ...api }, chart)}
              renderer={appendConfig.renderer || 'canvas'}
              style={style}
            />
          )}
        />
      </Suspense>
    );
  }
  if (config.engine === 'g2plot') {
    let appendPadding = config.showBorder ? 20 : 0;

    return (
      <Suspense fallback={<Spin spinning />}>
        <Carousel
          injectProps={injectProps}
          onLoad={onLoad}
          Slide={({ dataItem }) => {
            const option = method({
              data: dataItem,
              ...api,
              autoFit: true,
            });

            // 处理边距
            if (option.appendPadding) {
              appendPadding = isArray(option.appendPadding)
                ? option.appendPadding.map((item) => item + appendPadding)
                : appendPadding + option.appendPadding;
            }
            return (
              <G2Plot
                option={{ ...option, appendPadding }}
                renderer={appendConfig.renderer || 'canvas'}
                style={style}
              />
            );
          }}
        />
      </Suspense>
    );
  }
  if (config.engine === 'g2') {
    return (
      <Suspense fallback={<Spin spinning />}>
        <Carousel
          injectProps={injectProps}
          onLoad={onLoad}
          Slide={({ dataItem }) => (
            <G2
              option={{
                onMount: method,
                transformer: lib.transformer || null,
                data: dataItem,
                ...api,
              }}
              style={style}
            />
          )}
        />
      </Suspense>
    );
  }
  if (config.engine === 'other') {
    const ChartInst = method;
    return (
      <Carousel
        injectProps={injectProps}
        onLoad={onLoad}
        Slide={({ dataItem }) => (
          <ChartInst
            panelStyle={config.style}
            option={{ data: dataItem, ...api }}
            chartid={chartid}
            style={style}
          />
        )}
      />
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
