export const textColor = '#9aa8d4';

export { default as radialBarChart } from './radialBarChart';
export { default as percent } from './other/percent';

// g2
import * as waffle from './g2/waffle';
export { waffle };

export { default as g2Rose } from './g2/g2_rose';
export { default as g2RadialBarChart } from './g2/g2_radialBarChart';
export { default as g2Wind } from './g2/g2_wind';
export { default as g2Facet3 } from './g2/g2_facet3';
export { default as g2Facet2 } from './g2/g2_facet2';
export { default as g2PieList } from './g2/g2_pieList';
import * as g2PieOther from './g2/g2_pieOther';
export { g2PieOther };
 

// min-max-average区间图
import * as rangeLine from './g2/rangeLine';
export { rangeLine };

// -------------    自定义接口配置项     ----------

// 01.水平正负柱状图
import * as barChartPositiveNegative from './echarts/positiveNegative';
export { barChartPositiveNegative };

// 02.折线柱图
import * as barChartLine from './echarts/line';
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

// 06.百分比环图
import * as ringchart from './ringchart';
export { ringchart };

// 07.动态饼图
export { default as pie } from './pie';
import * as dynamicPie from './other/dynamicPie';
export { dynamicPie };

// 08.滚动表单
import * as scrollBoard from './other/scroll_board';
export { scrollBoard };

// 09.排名表
import * as rankingBoard from './other/rankingBoard';
export { rankingBoard };

// 10.渐变柱图
import * as gardient_bar from './echarts/gardient_bar';
export { gardient_bar };

// 11.渐变面积图
import * as gardientLine from './echarts/gardientLine';
export { gardientLine };

/*
    时间：2020-10-21 21:22:01
    类型: echarts
    序号：12
    名称：间隔柱状图
*/ 
import * as pictorial_bar from './echarts/pictorial_bar';
export { pictorial_bar }; 

/*
    时间：2020-10-21 22:13:59
    类型: other
    序号：13
    名称：百分比圆环
*/ 
import * as percent_circle from './other/percent_circle';
export { percent_circle }; 
