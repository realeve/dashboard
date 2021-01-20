import React, { useState, Suspense, useEffect, useRef, useMemo } from 'react';

import type { IPanelConfig, IApiProps } from '@/models/common';
import type { IAxiosState } from '@/utils/axios';

import * as R from 'ramda';
import { Skeleton, Spin } from 'antd';
import useFetch from '@/component/hooks/useFetch';

import { isArray } from '@antv/util';
import { chartList } from '@/component/chartItem/option';
import { getApiConfig, getAxiosParam, handleCarouselData } from './lib';
import Carousel from './Carousel';

export type tRender = 'canvas' | 'svg';

const Echarts = React.lazy(() => import('@/component/echarts'));
const G2 = React.lazy(() => import('@/component/g2'));
const G2Plot = React.lazy(() => import('@/component/g2plot'));

interface ChartInstanceProps {
  config: IPanelConfig;
  style?: React.CSSProperties;
  title?: string;
  chartid?: string;
  onLoad?: (e: string) => void;
  onDataLoad?: (e: {
    data: IAxiosState;
    param: { reportParam?: string; showReport?: boolean; [key: string]: any };
  }) => void;
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
  onDataLoad,
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
    callback: (e) => {
      onDataLoad?.({
        data: e,
        param: {
          showReport: api.showReport || false,
          reportParam: api.reportParam || '',
        },
      });
      return handleCarouselData(e, { isCarousel, carouselKey: config.api.carouselKey, onLoad });
    },
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
    if (injectProps?.data?.length === 1) {
      return (
        <Suspense fallback={<Spin spinning />}>
          <Echarts
            ref={ref}
            option={method({ data: injectProps.data[0], ...api }, chart)}
            renderer={appendConfig.renderer || 'canvas'}
            style={style}
          />
        </Suspense>
      );
    }
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

    if (injectProps?.data?.length === 1) {
      const option = method({
        data: injectProps.data[0],
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
        <Suspense fallback={<Spin spinning />}>
          <G2Plot
            option={{ ...option, appendPadding }}
            renderer={appendConfig.renderer || 'canvas'}
            style={style}
          />
        </Suspense>
      );
    }
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
    if (injectProps?.data?.length === 1) {
      return (
        <Suspense fallback={<Spin spinning />}>
          <G2
            option={{
              onMount: method,
              transformer: lib.transformer || null,
              data: injectProps.data[0],
              ...api,
            }}
            style={style}
          />
        </Suspense>
      );
    }

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
    if (injectProps?.data?.length === 1) {
      return (
        <Suspense fallback={<Spin spinning />}>
          <ChartInst
            panelStyle={config.style}
            option={{ data: injectProps.data[0], ...api }}
            chartid={chartid}
            style={style}
          />
        </Suspense>
      );
    }
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
