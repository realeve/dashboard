import React, { Suspense, useState } from 'react';
import type { ICommon, IPage, IPanelConfig, IHistoryProps } from '@/models/common';
import type { IAxiosState } from '@/utils/axios';
import * as R from 'ramda';
import ErrorBoundary from '@/component/ErrorBoundary';
import BorderItem from '@/component/widget/border';
import { connect } from 'react-redux';
import ChartInstance from './ChartInstance';
import { ASSETS_URL } from '@/utils/setting';

// import Report from './Report';

const Report = React.lazy(() => import('./Report'));

interface IChartItemProps {
  page: IPage;
  config: IPanelConfig;
}
export const ChartItem = ({ page, config }: IChartItemProps) => {
  const [title, setTitle] = useState(JSON.parse(config.api.mock || '{}').title || config?.title);
  const [data, setData] = useState<{
    data: IAxiosState;
    param: {
      reportParam?: string;
      showReport?: boolean;
    };
  }>(null);

  if (!config || config.hide) {
    return null;
  }
  // console.log(config, config.showTitle);
  const instanceHeight = config.showTitle && config.showBorder ? `calc(100% - 50px)` : '100%';

  return (
    <ErrorBoundary>
      {config.showTitle && <div style={page.head}>{title}</div>}
      <BorderItem
        engine={config.engine}
        borderSlice={page.borderSlice}
        name={ASSETS_URL + page.border}
        style={{
          background: config.showBackground ? ASSETS_URL + page.chartBackground : 'unset',
          width: '100%',
          height: instanceHeight,
          borderRadius: (config?.general?.borderRadius || [0, 0, 0, 0])
            .map((item) => `${item}px`)
            .join(' '),
        }}
        showBackground={config.showBackground}
        showBorder={config.showBorder}
      >
        {data?.param?.showReport && data?.data?.hash && (
          <Suspense fallback={null}>
            <Report data={data} />
          </Suspense>
        )}
        <ChartInstance
          style={{ height: config.showBorder ? '100%' : instanceHeight }}
          config={config}
          title={title}
          onLoad={setTitle}
          chartid={config.id}
          onDataLoad={setData}
        />
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
