import React, { useState, Suspense } from 'react';
import type { ICommon, IPage, IPanelConfig, IHistoryProps } from '@/models/common';
// import styles from './chartItem.less';
import * as R from 'ramda';
import ErrorBoundary from '@/component/ErrorBoundary';
import BorderItem from '@/component/widget/border';
import { Spin } from 'antd';
import { connect } from 'react-redux';

const ChartInstance = React.lazy(() => import('./ChartInstance'));

interface IChartItemProps {
  page: IPage;
  config: IPanelConfig;
}
export const ChartItem = ({ page, config }: IChartItemProps) => {
  const [title, setTitle] = useState(JSON.parse(config.api.mock || '{}').title || config?.title);

  if (!config || config.hide) {
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
            .map((item) => `${item}px`)
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

type IChartProps = {
  chartid: string;
  page: IPage;
  panel: IPanelConfig[];
} & IHistoryProps;
const Index = ({ chartid, page: _page, history, curHistoryIdx, panel: _panel }: IChartProps) => {
  const panel = history[curHistoryIdx]?.panel || _panel;
  // 对于已经添加的组件，在首次渲染后如果需要对属性做深度修改，editor未提供组件更新的选项，需要重新从设置中搜出并渲染
  const config = R.find<IPanelConfig>(R.propEq<string>('id', chartid))(panel);
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
