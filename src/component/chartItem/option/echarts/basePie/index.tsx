import { json2Array } from '@/utils/lib';
export { mock, apiConfig, defaultOption } from './mock';
export { config } from './config';
import * as lib from '../../lib';
import { getColors } from '../../g2plot/lib';
import { textColor } from '@/component/chartItem/option';
import { IBasePieProps } from './interface';

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
  let chartWidth = chart?.getWidth?.() || 400;
  let { data } = json2Array<any[]>(_data);

  let color = getColors(theme);

  let rose =
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
        labelLayout: function (params) {
          var isLeft = params.labelRect.x < chartWidth / 2;
          var points = params.labelLinePoints;
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
