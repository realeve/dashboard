import React, { useState, useRef, useEffect } from 'react';
// 水球图只在该组件中用到，不应封装到echarts全局组件中
import echarts from './echarts.min';
import './echarts-liquidfill.min';
import * as R from 'ramda';
import getOption, { mock, config, apiConfig } from './water';
import elementResizeEvent from 'element-resize-event';

export { mock, config, apiConfig };

// TODO 升级至ECharts 5.0版支持的模式，此时用4.9版实现

export default ({ option: props }) => {
  const watch = R.pick(['data', 'x', 'valueFontSize', 'percentFontSize', 'titleFontSize'], props);
  const ref = useRef(null);
  const [chart, setChart] = useState(null);

  useEffect(() => {
    const dom = ref.current;
    if (!dom) {
      return;
    }
    const chartInstance = echarts.init(dom, { renderer: 'canvas' });
    setChart(chartInstance);
    elementResizeEvent(dom, () => {
      chartInstance.resize();
    });

    return () => {
      try {
        elementResizeEvent.unbind(dom, () => {});
        dom?.dispose?.();
      } catch (e) {}
    };
  }, []);

  useEffect(() => {
    if (Object.keys(watch).length === 0) {
      return;
    }
    const option = getOption(props);
    chart?.setOption?.(option);
  }, [watch]);

  return <div ref={ref} style={{ width: '100%', height: '100%' }}></div>;
};
