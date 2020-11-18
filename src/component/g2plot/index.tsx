import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import * as lib from '@antv/g2plot';
import {
  Area as G2plotArea,
  Options as G2PlotConfig,
  AreaOptions as G2plotProps,
} from '@antv/g2plot';
import useChart, { ContainerProps } from './hooks/useChart';
import { getChart, utils } from './util';
import { ChartRefOptions, TChartType } from './interface';
import { ErrorBoundary } from './base';
import ChartLoading from './util/createLoading';

export interface ChartConfig extends G2plotProps {
  /** 图表类型 area | bar | box | bullet | column | funnel | histogram | line | liquid | heatmap | pie | progress | radar | ringprogress | rose | scatter | tinyarea | tinycolumn | tinyline | waterfall | wordcloud | sunburst | dualaxes | stock | radialbar | gauge */
  readonly type: TChartType;
}

export interface G2PlotChartProps extends ContainerProps {
  chartRef?: ChartRefOptions;
  /** 图表配置项 */
  option: ChartConfig;
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
    option: { type = 'Area', ...option },
  } = props;
  if (!lib[utils.camelCase(type)]) {
    return <h5>图表类型无效</h5>;
  }
  const { chart, container } = useChart<G2plotArea, G2PlotConfig>(
    lib[utils.camelCase(type)],
    option,
  );
  useEffect(() => {
    getChart(chartRef, chart.current);
  }, [chart.current]);
  useImperativeHandle(ref, () => ({
    getChart: () => chart.current,
  }));
  return (
    <ErrorBoundary errorTemplate={errorTemplate}>
      {loading && <ChartLoading loadingTemplate={loadingTemplate} />}
      <div className={className} style={style} ref={container} />
    </ErrorBoundary>
  );
});

export default G2PlotChart;
