import React, { useState, Suspense, useEffect, useRef } from 'react';

import { IPanelConfig, IApiProps } from '@/models/common';

import * as R from 'ramda';
import { Skeleton, Spin } from 'antd';
import useFetch from '@/component/hooks/useFetch';

import { isArray } from '@antv/util';
import { Dayjs } from 'dayjs';
import ranges from '@/utils/range';

import { chartList } from '@/component/chartItem/option';

export type tRender = 'canvas' | 'svg';

const Echarts = React.lazy(() => import('@/component/echarts'));
const G2 = React.lazy(() => import('@/component/g2'));
const G2Plot = React.lazy(() => import('@/component/g2plot'));

const getDefaultValue = (arr: { key?: string; defaultValue: any }[] = []) => {
  let obj = {};
  arr.forEach((item) => {
    item.key && (obj[item.key] = item.defaultValue);
  });
  return obj;
};

const getRange = ({ dateType = '本月' }: { dateType: string }) => {
  let [start, end]: [Dayjs, Dayjs] = ranges[dateType];
  let tstart = start.format('YYYYMMDD'),
    tend = end.format('YYYYMMDD');
  return { tstart, tend, tstart2: tstart, tend2: tend, tstart3: tstart, tend3: tend };
};

interface ChartInstanceProps {
  config: IPanelConfig;
  style?: React.CSSProperties;
  title?: string;
  chartid?: string;
  onLoad?: (e: string) => void;
}

interface ChartRenderProps extends ChartInstanceProps {
  chartLib: any;
}

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

  let api: IApiProps = config.api || { dateType: '本月' };
  /**
   * 从默认的config列表中提取defaultValue，注入到组件中，这样不用再到组件中重复定义默认值
   */
  let objComponent = getDefaultValue(lib?.config);
  let objApi = getDefaultValue(lib?.apiConfig?.config);
  api = { ...objApi, ...api };

  let mock = api.mock ? JSON.parse(api.mock) : lib?.mock;
  let valid = config.ajax && api?.api_type === 'url' && api?.url?.length > 0;

  let { data, loading, error } = useFetch({
    param: {
      url: api?.api_type === 'url' ? api?.url : null,
      params: { ...getRange(api), cache: api.cache ?? 2 },
    },
    valid: () => valid,
    interval: typeof api.interval === 'undefined' ? 0 : parseInt('' + Number(api.interval) * 60),
    callback(e) {
      if (e && e.title) {
        onLoad(e.title);
      }
      return e;
    },
  });

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
  // console.log({ data, valid, inited });

  if (!inited) {
    setInited(true);
  }
  // defaultOption 可能为函数，由config计算得出
  let appendConfig: { renderer: tRender } = { renderer: 'canvas' };

  if (defaultOption) {
    appendConfig = R.type(defaultOption) == 'Function' ? defaultOption(config) : defaultOption;
  }

  // 合并后的属性
  const injectProps = {
    data: valid ? data : mock,
    ...objComponent,
    ...(config.componentConfig || {}),
    ...api,
  };


  if (config.engine === 'echarts') {
    let chart = ref?.current?.echartsInstance;  
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
  } else if (config.engine === 'g2plot') {
    let option = method({
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
  } else if (config.engine === 'g2') {
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
  } else if (config.engine === 'other') {
    const Item = method;
    return <Item panelStyle={config.style} option={injectProps} chartid={chartid} style={style} />;
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
