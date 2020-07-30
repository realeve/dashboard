import React from 'react';
import Echarts from '@/component/echarts';
import { IChartConfig } from '../panel/components/db';

import * as chartLib from '@/component/chartItem/option';

export default ({ config }: { config: IChartConfig }) => {
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
      />
    );
  }

  return <div style={{ color: '#fff', fontSize: 20 }}>{config.title}</div>;
};
