import React from 'react';
import Echarts from '@/component/echarts';
import { IChartConfig } from '../panel/components/db'; 
import * as chartLib from '@/component/chartItem/option';
import { connect } from 'dva';
import { ICommon, IPage, IPanelConfig } from '@/models/common';
import styles from './chartItem.less';
import * as R from 'ramda';

import { BorderItem } from '@/component/widget';

const Item = ({ config, style = {} }: { config: IChartConfig; style?: React.CSSProperties }) => {
  if (config.engine === 'echarts') {
    const { default: method, ...lib } = chartLib[config.key];
    return (
      <Echarts
        option={method({
          data: lib.defaultValue,
          legend: 1,
          x: 0,
          y: 2,
        })}
        style={style}
      />
    );
  }

  return <div style={{ color: '#fff', fontSize: 20, ...style }}>{config.title}</div>;
};

const Index = ({ chartid, page, panel }: { chartid: string; page: IPage; panel: IPanelConfig }) => {
  // 对于已经添加的组件，在首次渲染后如果需要对属性做深度修改，editor未提供组件更新的选项，需要重新从设置中搜出并渲染
  let config = R.find<IChartConfig[]>(R.propEq('id', chartid))(panel) as IChartConfig;

  return (
    <>
      {config.showTitle && <div style={page.head}>{config.title}</div>}
      <BorderItem
        name={page.border}
        style={{
          background: page.chartBackground,
          width: '100%',
          height: config.showTitle ? `calc(100% - 50px)` : '100%',
        }}
      >
        <Item config={config} />
      </BorderItem>
    </>
  );
};

export default connect(({ common }: { common: ICommon }) => ({
  page: common.page,
  panel: common.panel,
}))(Index);
