import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import * as lib from '@antv/g2plot';
import useChart, { ContainerProps, Base, Options } from './hooks/useChart';
import { getChart, utils } from './util';
import { ChartRefOptions, TChartType } from './interface';
import { ErrorBoundary } from './base';
import ChartLoading from './util/createLoading';
import './theme';
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
    theme: 'cbpc',
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
