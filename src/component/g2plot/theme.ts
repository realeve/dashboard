// import * as G2Plot from './plot/g2plot.min';
// import cbpcTheme from './cbpc';

// 主题注册，生效，参照以下文档
// https://github.com/antvis/G2/blob/master/docs/api/advanced/registertheme.zh.md
// https://github.com/antvis/G2/blob/master/src/theme/util/create-theme.ts
// https://github.com/antvis/G2/blob/master/src/theme/index.ts

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
// G2Plot.G2.registerTheme('cbpc', cbpcTheme);

import cbpcTheme from './cbpc';

export default cbpcTheme;

const labelColor = '#E0E0E3';
const lineColor = '#ccc';
const fontFamily =
  '"Unica One","-apple-system", "Segoe UI", Roboto, "Helvetica Neue", Arial,\n  "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol","Noto Color Emoji"';

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
