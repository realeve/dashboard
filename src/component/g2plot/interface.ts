import { Options as G2PlotConfig } from '@antv/g2plot';

export type ChartRefOptions =
  | ((chart: any) => void)
  | React.MutableRefObject<G2PlotConfig | undefined>;

export type TChartType =
  | 'area'
  | 'bar'
  | 'box'
  | 'bullet'
  | 'column'
  | 'funnel'
  | 'histogram'
  | 'line'
  | 'liquid'
  | 'heatmap'
  | 'pie'
  | 'progress'
  | 'radar'
  | 'ring_progress'
  | 'rose'
  | 'scatter'
  | 'tiny_area'
  | 'tiny_column'
  | 'tiny_line'
  | 'waterfall'
  | 'word_cloud'
  | 'sunburst'
  | 'dual_axes'
  | 'stock'
  | 'radial_bar'
  | 'gauge'
  | 'Area'
  | 'Bar'
  | 'Box'
  | 'Bullet'
  | 'Column'
  | 'Funnel'
  | 'Histogram'
  | 'Line'
  | 'Liquid'
  | 'Heatmap'
  | 'Pie'
  | 'Progress'
  | 'Radar'
  | 'RingProgress'
  | 'Rose'
  | 'Scatter'
  | 'TinyArea'
  | 'TinyColumn'
  | 'TinyLine'
  | 'Waterfall'
  | 'WordCloud'
  | 'Sunburst'
  | 'DualAxes'
  | 'Stock'
  | 'RadialBar'
  | 'Gauge';
