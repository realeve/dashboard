import {
  interaction,
  animation,
  theme,
  tooltip,
  legend,
  annotation,
} from '@antv/g2plot/lib/adaptor/common';
import type { Params } from '@antv/g2plot';
import { flow, deepAssign } from '@antv/g2plot/lib/utils';
import { interval } from '@antv/g2plot/lib/adaptor/geometries';
import type { RadialBarOptions } from './types';
import { meta, axis } from '@antv/g2plot/lib/plots/radial-bar/adaptor';

/**
 * geometry 处理
 * @param params
 */
function geometry(params: Params<RadialBarOptions>): Params<RadialBarOptions> {
  const { chart, options } = params;
  const { data, barStyle: style, color, tooltip, colorField, type, xField, yField } = options;
  chart.data(data);
  const p = deepAssign({}, params, {
    options: {
      tooltip,
      seriesField: colorField,
      interval: {
        style,
        color,
        shape: type === 'line' ? 'line' : 'intervel',
      },
    },
  });
  interval(p);
  if (type === 'line') {
    chart.point().position(`${xField}*${yField}`).shape('circle');
  }
  return params;
}

/**
 * coordinate 配置
 * @param params
 */
function coordinate(params: Params<RadialBarOptions>): Params<RadialBarOptions> {
  const { chart, options } = params;
  const { radius, innerRadius, coordinate = 'polar', transpose = true } = options;

  const coord = chart.coordinate({
    type: coordinate,
    cfg: {
      radius,
      innerRadius,
    },
  });
  if (transpose) {
    coord.transpose();
  }
  return params;
}

/**
 * 图适配器
 * @param chart
 * @param options
 */
export function adaptor(params: Params<RadialBarOptions>) {
  return flow(
    geometry,
    meta,
    axis,
    coordinate,
    interaction,
    animation,
    theme,
    tooltip,
    legend,
    annotation(),
  )(params);
}
