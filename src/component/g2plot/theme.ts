import { antvDark } from '@antv/g2/lib/theme/style-sheet/dark';
import { createThemeByStyleSheet } from '@antv/g2/lib/theme/util/create-by-style-sheet';
import type { LooseObject } from '@antv/g2/lib/interface';
import { G2 } from '@antv/g2plot';
import { deepMix } from '@antv/util';

// 主题注册，生效，参照以下文档
// https://github.com/antvis/G2/blob/master/docs/api/advanced/registertheme.zh.md
// https://github.com/antvis/G2/blob/master/src/theme/util/create-theme.ts
// https://github.com/antvis/G2/blob/master/src/theme/index.ts

const defaultTheme = createThemeByStyleSheet(antvDark);

const labelColor = '#E0E0E3';
const lineColor = '#ccc';
const fontFamily =
  '"Unica One","-apple-system", "Segoe UI", Roboto, "Helvetica Neue", Arial,\n  "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol","Noto Color Emoji"';

const axis = {};
['top', 'bottom', 'left', 'right', 'circle', 'radius'].forEach((key) => {
  axis[key] = {
    label: {
      style: {
        fill: labelColor,
        fontFamily,
      },
    },
  };
});

const legend = {};
['top', 'bottom', 'left', 'right'].forEach((key) => {
  legend[key] = {
    itemName: {
      style: {
        fill: labelColor,
        fontFamily,
      },
    },
  };
});
export const tooltip = {
  domStyles: {
    'g2-tooltip': {
      background: 'rgba(48, 54, 64, 0.8)',
      backdropFilter: 'saturate(180%) blur(20px)',
      color: labelColor,
      fontFamily,
    },
  },
  crosshairs: {
    line: {
      style: {
        stroke: lineColor,
      },
    },
  },
};
const themeObject: LooseObject = {
  background: 'transparent',
  labels: {
    style: {
      fill: labelColor,
      fontFamily,
    },
  },
  geometries: {
    point: {
      circle: {
        active: {
          style: {
            r: 4,
            fillOpacity: 1,
            stroke: '#ddd',
            lineWidth: 2,
          },
        },
      },
    },
  },
  components: {
    axis,
    legend,
    tooltip,
  },
};
const cbpcTheme = deepMix({}, defaultTheme, themeObject);

/**
 * 堆叠柱状图区域连通
 * 2020-11-20 官方已经支持，无需自行处理
 *
 * 注册action可参考 https://github.com/antvis/G2Plot/blob/master/src/plots/scatter/interaction/index.ts
 * G2 Plot interactions定义：https://github.com/antvis/G2Plot/blob/master/src/types/interaction.ts
 */
// G2.registerInteraction('element-link', {
//   start: [{ trigger: 'interval:mouseenter', action: 'element-link-by-color:link' }],
//   end: [{ trigger: 'interval:mouseleave', action: 'element-link-by-color:unlink' }],
// });

/**
 * 注册自定义样式
 */
G2.registerTheme('cbpc', cbpcTheme);
// console.log(cbpcTheme);

export default cbpcTheme;
