import { json2Array } from '@/utils/lib';
import * as lib from '../../lib';
import { getColors } from '../../g2plot/lib';
import { textColor } from '@/component/chartItem/option';
import type { IBasePieProps } from './interface';

export { mock, apiConfig, defaultOption } from './mock';
export { config } from './config';

export default (
  {
    data: _data,
    chartType,
    x = 0,
    y = 1,
    innerRadius,
    theme = 18,
    legendShow = true,
    legendAlign,
    legendPosition,
    legendOrient,
    labelPosition = 'inner',
    labelAlign = 'edge',
    borderWidth = 1,
    borderColor = '#070125',
    borderRadiusInner,
    borderRadiusOutter,
    edgeDistance = 10,
    valueFontSize,
    labelFontSize,
  }: Readonly<IBasePieProps>,
  chart,
) => {
  const chartWidth = chart?.getWidth?.() || 400;
  const { data } = json2Array<any[]>(_data);

  const color = getColors(theme);

  const rose =
    chartType == 'pie'
      ? {}
      : {
          roseType: chartType,
        };

  return {
    color,
    tooltip: {
      trigger: 'item',
    },
    legend: lib.getLegendOption({ legendShow, legendAlign, legendPosition, legendOrient }),
    series: [
      {
        type: 'pie',
        ...rose,
        radius: [`${innerRadius}%`, '75%'],
        itemStyle: {
          borderColor,
          borderWidth,
          borderRadius: [borderRadiusInner, borderRadiusOutter],
        },
        emphasis: {
          focus: 'series',
        },
        label: {
          position: labelPosition,
          alignTo: labelAlign,
          formatter: '{name|{b}}\n{value|{c}}',
          minMargin: 5,
          edgeDistance: `${edgeDistance}%`,
          lineHeight: labelFontSize * 1.5,
          rich: {
            name: {
              fontSize: labelFontSize,
              color: textColor,
            },
            value: {
              fontSize: valueFontSize,
              color: '#aaa',
            },
          },
        },
        labelLine: {
          length: 15,
          length2: 0,
          maxSurfaceAngle: 80,
        },
        labelLayout (params) {
          const isLeft = params.labelRect.x < chartWidth / 2;
          const points = params.labelLinePoints;
          if (!points) {
            return {};
          }
          // Update the end point.
          points[2][0] = isLeft ? params.labelRect.x : params.labelRect.x + params.labelRect.width;
          return {
            labelLinePoints: points,
          };
        },
        data: data.map((item) => ({ name: item[x], value: item[y] })),
      },
    ],
  };
};
