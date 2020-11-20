import React, { useState, useEffect } from 'react';
import Echarts from '@/component/echarts';

import * as chartLib from '@/component/chartItem/option';
import { connect } from 'dva';
import { ICommon, IPage, IPanelConfig } from '@/models/common';
// import styles from './chartItem.less';
import * as R from 'ramda';
import ErrorBoundary from '@/component/ErrorBoundary';
import { BorderItem } from '@/component/widget';
import { Skeleton } from 'antd';
import useFetch from '@/component/hooks/useFetch';
import { tRender } from '@/component/echarts/';
import G2 from '@/component/g2';
import G2Plot from '@/component/g2plot';
import { isArray } from '@antv/util';

const Item = ({
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
  let api = config.api || {};
  let mock = api.mock ? JSON.parse(api.mock) : lib?.mock;
  let valid = api?.api_type === 'url' && api?.url?.length > 0;

  let { data, loading } = useFetch({
    param: { url: api?.api_type === 'url' ? api?.url : null },
    valid: () => valid,
    interval: typeof api.interval === 'undefined' ? 0 : Number(api.interval),
    callback(e) {
      if (e && e.title) {
        onLoad(e.title);
      }
      return e;
    },
  });

  // 在callback中会触发该效果，无需再次调用
  // if (api?.api_type === 'mock' && mock && mock.title) {
  //   onLoad(mock.title);
  // }

  if (valid && (loading || !data)) {
    return <Skeleton />;
  }

  // defaultOption 可能为函数，由config计算得出
  let appendConfig: { renderer: tRender } = { renderer: 'canvas' };

  if (defaultOption) {
    appendConfig = R.type(defaultOption) == 'Function' ? defaultOption(config) : defaultOption;
  }

  if (config.engine === 'echarts') {
    return (
      <Echarts
        option={method({
          data: valid ? data : mock,
          ...(config.componentConfig || {}),
        })}
        renderer={appendConfig.renderer || 'canvas'}
        style={style}
      />
    );
  } else if (config.engine === 'g2plot') {
    let option = method({
      data: valid ? data : mock,
      ...(config.componentConfig || {}),
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
          data: valid ? data : mock,
          onMount: method,
          ...(config.componentConfig || {}),
          transformer: lib.transformer || null,
          ...appendConfig,
        }}
        style={style}
      />
    );
  } else if (config.engine === 'other') {
    const Item = method;
    return (
      <Item
        option={{
          data: valid ? data : mock,
          ...(config.componentConfig || {}),
          ...appendConfig,
        }}
        chartid={chartid}
        style={style}
      />
    );
  }

  return <div style={{ color: '#fff', fontSize: 20, ...style }}>{title}</div>;
};

const Index = ({
  chartid,
  page: _page,
  panel,
}: {
  chartid: string;
  page: IPage;
  panel: IPanelConfig[];
}) => {
  // 对于已经添加的组件，在首次渲染后如果需要对属性做深度修改，editor未提供组件更新的选项，需要重新从设置中搜出并渲染
  let config = R.find<IPanelConfig>(R.propEq<string>('id', chartid))(panel);
  if (!config) {
    return null;
  }
  let page = R.clone(_page);
  if (config.useGeneralStyle) {
    page = { ...config.general, ...page };
  } else {
    page = { ...page, ...config.general };
  }
  return <ChartItem page={page} config={config} />;
};

export default connect(({ common }: { common: ICommon }) => ({
  page: common.page,
  panel: common.panel,
}))(Index);

interface IChartItemProps {
  page: IPage;
  config: IPanelConfig;
}
export const ChartItem = ({ page, config }: IChartItemProps) => {
  if (!config) {
    return null;
  }

  const [title, setTitle] = useState(config.title);

  useEffect(() => {
    if (config?.api?.api_type === 'mock') {
      try {
        setTitle(JSON.parse(config.api.mock || '{}').title || title);
      } catch (e) {
        console.error('mock数据读取出错:', config.api.mock);
        console.error(e);
      }
    }
  }, [config?.api?.api_type]);
  if (config.hide) {
    return null;
  }
  return (
    <ErrorBoundary>
      {config.showTitle && <div style={page.head}>{title}</div>}
      <BorderItem
        engine={config.engine}
        name={page.border}
        style={{
          background: config.showBackground ? page.chartBackground : 'unset',
          width: '100%',
          height: config.showTitle ? `calc(100% - 50px)` : '100%',
        }}
        showBackground={config.showBackground}
        showBorder={config.showBorder}
      >
        <Item config={config} title={title} onLoad={setTitle} chartid={config.id} />
      </BorderItem>
    </ErrorBoundary>
  );
};
