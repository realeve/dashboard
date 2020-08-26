import React from 'react';
import Echarts from '@/component/echarts';
import { IChartConfig } from '../panel/components/db';

import * as chartLib from '@/component/chartItem/option';
import { connect } from 'dva';
import { ICommon, IPage } from '@/models/common';
import styles from './chartItem.less';

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

const Index = ({ config, page }: { config: IChartConfig; page: IPage }) => {
  console.log(config);
  return (
    <>
      <div
        style={{
          color: page.head.color,
          fontSize: page.head.fontSize,
          background: page.head.background,
          padding: 10,
        }}
      >
        {config.title}
      </div>
      <BorderItem
        name={page.border.theme}
        style={{ background: page.chartBackground, width: '100%', height: 'calc(100% - 50px)' }}
      >
        <Item config={config}/>
      </BorderItem>
    </>
  );
};

export default connect(({ common }: { common: ICommon }) => ({
  page: common.page,
}))(Index);
