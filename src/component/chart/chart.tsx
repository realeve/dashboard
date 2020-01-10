import React, { useState, useEffect } from 'react';
import { AChart } from './ava';
// g2 plot 原生
// import { AChart  as AutoChart  } from './g2plot';

import { IAChart, TMockChange } from './lib';
import getOption from './option';

const AVA_COMPONENT = true;

let init = ({ type, ...config }, onMockChange) => {
  let option: IAChart = config.data ? config : getOption(type);
  if (AVA_COMPONENT) {
    option = {
      ...option,
      onMockChange,
    };
  }
  return option;
};

export interface IChartConfig extends IAChart {
  type: string;
  [key: string]: any;
}
export default ({ config, onMockChange }: { config: IChartConfig; onMockChange: TMockChange }) => {
  //   if (!type || String(type).length === 0) {
  //     return <div style={{ width: '100%', height: '100%' }} />;
  //   }
  const [option, setOption] = useState(null);
  useEffect(() => {
    setOption(init(config, onMockChange));
    console.log(config);
  }, [config]);

  return option && <AChart option={option} />;
};
