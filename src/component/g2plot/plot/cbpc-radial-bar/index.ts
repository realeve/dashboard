import { Plot } from '@antv/g2plot/lib/core/plot';
import { deepAssign } from '@antv/g2plot/lib/utils';
import { Adaptor } from '@antv/g2plot/lib/core/adaptor';
import { RadialBarOptions } from './types';
import { adaptor } from './adaptor';

export { RadialBarOptions };

/**
 * 玉珏图
 */
export class CbpcRadialBar extends Plot<RadialBarOptions> {
  /** 图表类型 */
  public type: string = 'radial-bar';

  /**
   * 获取默认配置
   */
  protected getDefaultOptions(): Partial<RadialBarOptions> {
    return deepAssign({}, super.getDefaultOptions(), {
      interactions: [{ type: 'element-active' }],
      legend: false,
      tooltip: {
        showMarkers: false,
      },
      xAxis: {
        grid: null,
        tickLine: null,
        line: null,
      },
      maxAngle: 240,
      transpose: true,
      axisType: 'polar',
    });
  }

  /**
   * 获取适配器
   */
  protected getSchemaAdaptor(): Adaptor<RadialBarOptions> {
    return adaptor;
  }
}
