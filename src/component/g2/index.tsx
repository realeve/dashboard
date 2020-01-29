import React, { useState, useEffect, useRef } from 'react';
import G2 from '@antv/g2';
// import { useSize } from 'react-use';

export default ({
  className = '',
  style = {},
  option: {
    data,
    height = 0,
    padding = [20, 20, 40, 20],
    onMount = ({ data: [] }, e: any) => null,
    ...props
  },
  renderer = 'canvas',
}) => {
  const ref = useRef(null);
  const [chart, setChart] = useState(null);
  useEffect(() => {
    if (!ref) {
      return;
    }
    height = height || ref.current.offsetHeight;

    const _chart = new G2.Chart({
      container: ref.current,
      forceFit: true,
      height,
      padding,
      renderer,
    });
    setChart(_chart);
    onMount && onMount({ data, ...props }, _chart);
  }, []);

  // 数据更新
  useEffect(() => {
    if (!chart) {
      return;
    }
    chart.changeData(data);
  }, [data]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        ...style,
      }}
    />
  );
};
