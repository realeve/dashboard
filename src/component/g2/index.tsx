import React, { useState, useEffect, useRef } from 'react';
import G2 from '@antv/g2';

export default ({
  className = '',
  style = {},
  option: {
    data,
    height = 0,
    padding = [20, 20, 40, 20],
    onMount, // = ({ data: [] }, e: any) => null,
    transformer,
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

    // onMount返回数据转换器，在部分数据处理中需要对原始数据做加工
    onMount && onMount({ data, ...props }, _chart);
  }, []);

  // 数据更新
  useEffect(() => {
    // console.log('will update');
    if (!chart || !data) {
      return;
    }

    // 数据转换器
    let { data: dv } = transformer ? transformer({ data, ...props }, chart) : { data };

    chart.changeData(dv);
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
