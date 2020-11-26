import React, { useState, useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import * as R from 'ramda';
import elementResizeEvent from 'element-resize-event';

export default ({
  className = '',
  style = {},
  option: { data, padding = [20, 20, 20, 20], renderer = 'canvas', onMount, transformer, ...props },
}) => {
  const ref = useRef(null);
  const [chart, setChart] = useState(null);
  useEffect(() => {
    if (!ref) {
      return;
    }

    const _chart: Chart = new Chart({
      container: ref.current,
      autoFit: true,
      padding,
      renderer,
      supportCSSTransform: true,
    });

    setChart(_chart);

    elementResizeEvent(ref.current, () => {
      _chart.forceFit();
    });

    // onMount返回数据转换器，在部分数据处理中需要对原始数据做加工
    onMount && onMount({ data, ...props }, _chart);

    return () => {
      try {
        elementResizeEvent.unbind(ref.current);
        _chart.destroy();
      } catch (_) {}
    };
  }, []);

  // 数据更新
  useEffect(() => {
    if (!chart || !data) {
      return;
    }

    let _data = R.clone(data.data);

    // 数据转换器
    let { data: dv } = transformer
      ? transformer({ data: _data, header: data.header, ...props }, chart)
      : { data: _data };

    chart.changeData(dv);
  }, [data]);

  useEffect(() => {
    if (!chart) {
      return;
    }
    onMount && onMount({ data, ...props }, chart);
  }, [JSON.stringify(props)]);

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
