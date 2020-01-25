import Charts from '@jiaminghi/charts';
import React, { useRef, useEffect, useState } from 'react';

export default ({ option }) => {
  const ref = useRef(null);
  const [chart, setChart] = useState(null);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    let _chart = new Charts(ref.current);
    setChart(_chart);
    _chart.setOption(option);
  }, []);
  useEffect(() => {
    if (!chart) {
      return;
    }
    chart.setOption(option);
  }, [option]);

  return <div ref={ref} style={{ width: '100%', height: '100%' }} />;
};
