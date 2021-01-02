import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import lib from './plot';
import type { ContainerProps, Base, Options } from './hooks/useChart';
import useChart from './hooks/useChart';
import { getChart, utils } from './util';
import type { ChartRefOptions, TChartType } from './interface';
import { ErrorBoundary } from './base';
import ChartLoading from './util/createLoading';
import './theme';
import styles from './index.less';
import classnames from 'classnames';

export { palette } from './palette';

export type ChartConfig = {
  /** 图表类型 area | bar | box | bullet | column | funnel | histogram | line | liquid | heatmap | pie | progress | radar | ringprogress | rose | scatter | tinyarea | tinycolumn | tinyline | waterfall | wordcloud | sunburst | dualaxes | stock | radialbar | gauge */
  readonly chartType: TChartType;
} & Options;

export type G2PlotChartProps = {
  chartRef?: ChartRefOptions;
  /** 图表配置项 */
  option: ChartConfig;
  /** 使用 canvas 或 svg 渲染 */
  readonly renderer?: 'canvas' | 'svg';
} & ContainerProps;

const G2Plot = (props) => {
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
    ref,
    instance,
  } = props;

  const { chart, container } = useChart<Base, Options>(instance, {
    renderer,
    chartType,
    theme: 'cbpc',
    ...option,
  });
  useEffect(() => {
    getChart(chartRef, chart.current);
  }, [chart.current]);

  useImperativeHandle(ref, () => ({
    getChart: () => chart.current,
  }));

  return (
    <ErrorBoundary errorTemplate={errorTemplate}>
      {loading && <ChartLoading loadingTemplate={loadingTemplate} />}
      <div className={classnames(className, styles.g2plot)} style={style} ref={container} />
    </ErrorBoundary>
  );
};

const G2PlotChart = (props) => {
  const chartType = props?.option?.chartType || 'Area';
  const instance = lib[utils.camelCase(chartType)];
  if (!instance) {
    return <h5>图表类型无效</h5>;
  }
  return <G2Plot {...props} instance={instance} />;
};

export default forwardRef(G2PlotChart);
