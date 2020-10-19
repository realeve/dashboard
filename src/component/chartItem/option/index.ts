export const textColor = '#9aa8d4';

export { default as roundBar } from './roundBar';
export { default as pie } from './pie';

export { default as ringchart } from './ringchart';
export { default as radialBarChart } from './radialBarChart';
export { default as percent } from './percent';
export { default as pictorialBar } from './pictorialBar';

// g2
import * as waffle from './g2/waffle';
export { waffle };

export { default as gardientLine } from './gardientLine';
export { default as g2Rose } from './g2/g2_rose';
export { default as g2RadialBarChart } from './g2/g2_radialBarChart';
export { default as g2Wind } from './g2/g2_wind';
export { default as g2Facet3 } from './g2/g2_facet3';
export { default as g2Facet2 } from './g2/g2_facet2';
export { default as g2PieList } from './g2/g2_pieList';
import * as g2PieOther from './g2/g2_pieOther';
export { g2PieOther };

export { default as g2PieSpider } from './g2/g2_pieSpider';

// min-max-average区间图
import * as rangeLine from './g2/rangeLine';
export { rangeLine };

// -------------    自定义接口配置项     ----------

// 01.水平正负柱状图
import * as barChartPositiveNegative from './barChart/positiveNegative';
export { barChartPositiveNegative };

// 02.折线柱图
import * as barChartLine from './barChart/line';
export { barChartLine };

// 03.瀑布图
import * as waterfall from './g2/waterfall';
export { waterfall };

// 04.进度条
import * as progressBar from './other/progress_bar';
export { progressBar };

// 05.水球图
import * as water from './water';
export { water };
