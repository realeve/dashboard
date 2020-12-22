import React, { useState, useEffect, Suspense } from 'react';
import { connect } from 'dva';
import { ICommon, IPage, IPanelConfig, IHistoryProps } from '@/models/common';
// import styles from './chartItem.less';
import * as R from 'ramda';
import ErrorBoundary from '@/component/ErrorBoundary';
import BorderItem from '@/component/widget/border';
import { Spin } from 'antd';

const ChartInstance = React.lazy(() => import('./ChartInstance'));
interface IChartProps extends IHistoryProps {
  chartid: string;
  page: IPage;
  panel: IPanelConfig[];
}
const Index = ({ chartid, page: _page, history, curHistoryIdx, panel: _panel }: IChartProps) => {
  let panel = history[curHistoryIdx]?.panel || _panel;
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

export default connect(({ common }: { common: ICommon }) => common)(Index);

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
          borderRadius: (config?.general?.borderRadius || [0, 0, 0, 0])
            .map((item) => item + 'px')
            .join(' '),
        }}
        showBackground={config.showBackground}
        showBorder={config.showBorder}
      >
        <Suspense fallback={<Spin spinning />}>
          <ChartInstance config={config} title={title} onLoad={setTitle} chartid={config.id} />
        </Suspense>
      </BorderItem>
    </ErrorBoundary>
  );
};
