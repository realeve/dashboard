import { antvDark } from '@antv/g2/lib/theme/style-sheet/dark';
import { createThemeByStyleSheet } from '@antv/g2/lib/theme/util/create-by-style-sheet';
import type { LooseObject } from '@antv/g2/lib/interface';
import { deepMix } from '@antv/util';
import { tooltip } from './theme';

const defaultTheme = createThemeByStyleSheet(antvDark);

const labelColor = '#E0E0E3';
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
export default deepMix({}, defaultTheme, themeObject);
