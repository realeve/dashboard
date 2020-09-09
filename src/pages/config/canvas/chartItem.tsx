import React, { useState, useEffect } from 'react';
import Echarts from '@/component/echarts';

import * as chartLib from '@/component/chartItem/option';
import { connect } from 'dva';
import { ICommon, IPage, IPanelConfig } from '@/models/common';
import styles from './chartItem.less';
import * as R from 'ramda';
import ErrorBoundary from './ErrorBoundary';
import { BorderItem } from '@/component/widget';
import { Skeleton } from 'antd';
import useFetch from '@/component/hooks/useFetch';

const Item = ({
  config,
  title,
  style = {},
  onLoad,
}: {
  config: IPanelConfig;
  style?: React.CSSProperties;
  title?: string;
  onLoad?: (e: string) => void;
}) => {
  const { default: method, ...lib } = chartLib[config.key];
  let api = config.api || {};
  let mock = api.mock ? JSON.parse(api.mock) : lib?.mock;
  let valid = api?.api_type === 'url' && api?.url?.length > 0;
 
  let { data, loading, error } = useFetch({
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

  if (valid && (loading || !data)) {
    return <Skeleton />;
  }

  if (config.engine === 'echarts') {
    return (
      <Echarts
        option={method({
          data: valid ? data : mock,
          legend: 1,
          x: 0,
          y: 2,
          ...(config.componentConfig || {}),
        })}
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
  panel: IPanelConfig;
}) => {
  // 对于已经添加的组件，在首次渲染后如果需要对属性做深度修改，editor未提供组件更新的选项，需要重新从设置中搜出并渲染
  let config = R.find<IPanelConfig[]>(R.propEq('id', chartid))(panel) as IPanelConfig;
  let page = R.clone(_page);
  if (config.useGeneralStyle) {
    page = { ...config.general, ...page };
  } else {
    page = { ...page, ...config.general };
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

  return (
    <>
      {config.showTitle && <div style={page.head}>{title}</div>}
      <BorderItem
        name={page.border}
        style={{
          background: page.chartBackground,
          width: '100%',
          height: config.showTitle ? `calc(100% - 50px)` : '100%',
        }}
      >
        <Item config={config} title={title} onLoad={setTitle} />
      </BorderItem>
    </>
  );
};

const ChartPage = props => (
  <ErrorBoundary>
    <Index {...props} />
  </ErrorBoundary>
);

export default connect(({ common }: { common: ICommon }) => ({
  page: common.page,
  panel: common.panel,
}))(ChartPage);
