import React from 'react';
import { AChart as AutoChart, AChart } from './ava';
// g2 plot 原生
// import { AChart  as AutoChart  } from './g2plot';

import getOption from './option';

export default ({ type }) => {
  //   if (!type || String(type).length === 0) {
  //     return <div style={{ width: '100%', height: '100%' }} />;
  //   }

  return <AChart option={getOption(type)} />;
};
