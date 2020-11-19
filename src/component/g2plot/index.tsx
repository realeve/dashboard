import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import * as lib from '@antv/g2plot';
import useChart, { ContainerProps, Base, Options } from './hooks/useChart';
import { getChart, utils } from './util';
import { ChartRefOptions, TChartType } from './interface';
import { ErrorBoundary } from './base';
import ChartLoading from './util/createLoading';
// import { antvDark } from '@antv/g2/lib/theme/style-sheet/dark';

// 主题注册，暂时不生效，需要查看g2源码
// G2.registerTheme('_dark', { ...antvDark, brandColor: '#f23' });

import { G2 } from '@antv/g2plot';
const { registerTheme } = G2;
registerTheme('_dk', {
  colors10: ['#FACDAA', '#F4A49E', '#EE7B91', '#E85285', '#BE408C', '#BE408C'],
  /** 20色板 */
  colors20: ['#FACDAA', '#F4A49E', '#EE7B91', '#E85285', '#BE408C', '#BE408C', '#942D93'],
});
export interface ChartConfig extends Options {
  /** 图表类型 area | bar | box | bullet | column | funnel | histogram | line | liquid | heatmap | pie | progress | radar | ringprogress | rose | scatter | tinyarea | tinycolumn | tinyline | waterfall | wordcloud | sunburst | dualaxes | stock | radialbar | gauge */
  readonly chartType: TChartType;
}

export interface G2PlotChartProps extends ContainerProps {
  chartRef?: ChartRefOptions;
  /** 图表配置项 */
  option: ChartConfig;
  /** 使用 canvas 或 svg 渲染 */
  readonly renderer?: 'canvas' | 'svg';
}

const G2PlotChart = forwardRef((props: G2PlotChartProps, ref) => {
  const {
    chartRef,
    style = {
      height: '100%',
    },
    className,
    loading,
    loadingTemplate,
    errorTemplate,
    option: { chartType = 'Area', ...option },
    renderer = 'canvas',
  } = props;
  const chartInstance = lib[utils.camelCase(chartType)];
  if (!chartInstance) {
    return <h5>图表类型无效</h5>;
  }

  const { chart, container } = useChart<Base, Options>(chartInstance, {
    ...option,
    renderer,
    theme: '_dk',
  });

  useEffect(() => {
    getChart(chartRef, chart.current);
  }, [chart.current]);
  useImperativeHandle(ref, () => ({
    getChart: () => chart.current,
  }));

  useEffect(() => {
    let instance = chart.current;
    if (!instance) {
      return;
    }
    instance.update(option);
  }, [JSON.stringify(option)]);

  return (
    <ErrorBoundary errorTemplate={errorTemplate}>
      {loading && <ChartLoading loadingTemplate={loadingTemplate} />}
      <div className={className} style={style} ref={container} />
    </ErrorBoundary>
  );
});

export default G2PlotChart;
