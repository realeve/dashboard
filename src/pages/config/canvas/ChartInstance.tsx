import React, { useState } from 'react';
import Echarts from '@/component/echarts';

import * as chartLib from '@/component/chartItem/option';
import { IPanelConfig, IApiProps } from '@/models/common';

import * as R from 'ramda';
import { Skeleton } from 'antd';
import useFetch from '@/component/hooks/useFetch';
import { tRender } from '@/component/echarts/';
import G2 from '@/component/g2';
import G2Plot from '@/component/g2plot';
import { isArray } from '@antv/util';
import { Dayjs } from 'dayjs';
import ranges from '@/utils/range';

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

export default ({
  config,
  title,
  style = {},
  onLoad,
  chartid,
}: {
  config: IPanelConfig;
  style?: React.CSSProperties;
  title?: string;
  chartid?: string;
  onLoad?: (e: string) => void;
}) => {
  const [inited, setInited] = useState(false);

  if (!chartLib[config.key]) {
    return (
      <div style={{ color: '#ddd', fontSize: 30, lineHeight: 2 }}>
        组件渲染出错：
        <br />
        @/component/chartItem/option 中 未导出函数 {config.key}，请仔细检查
        {/* <br />
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <img src="/img/no-data.svg" style={{ width: 200 }} />
          </div> */}
      </div>
    );
  }
  const { default: method, defaultOption = {}, ...lib } = chartLib[config.key];

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
    return (
      <Echarts
        option={method(injectProps)}
        renderer={appendConfig.renderer || 'canvas'}
        style={style}
      />
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
      <G2Plot
        option={{ ...option, appendPadding }}
        renderer={appendConfig.renderer || 'canvas'}
        style={style}
      />
    );
  } else if (config.engine === 'g2') {
    return (
      <G2
        option={{
          onMount: method,
          transformer: lib.transformer || null,
          ...injectProps,
        }}
        style={style}
      />
    );
  } else if (config.engine === 'other') {
    const Item = method;
    return <Item option={injectProps} chartid={chartid} style={style} />;
  }

  return <div style={{ color: '#fff', fontSize: 20, ...style }}>{title}</div>;
};
