import { Channels } from './advisor';
const MAP: { [type: string]: Channels } = {
  Line: {
    x: 'xField',
    y: 'yField',
    color: 'seriesField',
  },
  Area: {
    x: 'xField',
    y: 'yField',
  },
  Bar: {
    x: 'xField',
    y: 'yField',
    color: 'colorField',
  },
  Column: {
    x: 'xField',
    y: 'yField',
    color: 'colorField',
  },
  Pie: {
    angle: 'angleField',
    color: 'colorField',
  },
  // Donut
  Ring: {
    angle: 'angleField',
    color: 'colorField',
  },
  // GroupedBar
  GroupBar: {
    y: 'yField',
    y2: 'groupField',
    x: 'xField',
  },
  // StackedBar
  StackBar: {
    y: 'yField',
    y2: 'stackField',
    x: 'xField',
  },
  // PercentageStackedBar
  PercentageStackBar: {
    y: 'yField',
    y2: 'stackField',
    x: 'xField',
  },
  // GroupedColumn
  GroupColumn: {
    x: 'xField',
    x2: 'groupField',
    y: 'yField',
  },
  // StackedColumn
  StackColumn: {
    x: 'xField',
    x2: 'stackField',
    y: 'yField',
  },
  // PercentageStackedColumn
  PercentageStackColumn: {
    x: 'xField',
    x2: 'stackField',
    y: 'yField',
  },
  // StackedArea
  StackArea: {
    x: 'xField',
    x2: 'stackField',
    y: 'yField',
  },
  // PercentageStackedArea
  PercentageStackArea: {
    x: 'xField',
    x2: 'stackField',
    y: 'yField',
  },
  Radar: {
    angle: 'angleField',
    radius: 'radiusField',
    series: 'seriesField',
  },
  Scatter: {
    x: 'xField',
    y: 'yField',
    color: 'colorField',
  },
  Bubble: {
    x: 'xField',
    y: 'yField',
    size: 'sizeField',
    color: 'colorField',
  },
};

export default MAP;
