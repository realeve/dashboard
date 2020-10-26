export const textColor = '#9aa8d4';

export { default as percent } from './other/percent';

export { default as g2Facet3 } from './g2/g2_facet3';
export { default as g2Facet2 } from './g2/g2_facet2';

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

/*
    时间：2020-10-22 11:08:00
    类型: g2
    序号：14
    名称：带详情的饼图
*/

import * as pie_detail from './g2/pie_detail';
export { pie_detail };

/*
    时间：2020-10-22 11:49:04
    类型: echarts
    序号：15
    名称：玉玦图
*/

import * as bar_polar from './echarts/bar_polar';
export { bar_polar };

/*
    时间：2020-10-22 22:09:52
    类型: g2
    序号：16
    名称：玫瑰图
*/
import * as g2_pie_rose from './g2/g2_pie_rose';
export { g2_pie_rose };

/*
    时间：2020-10-25 22:34:36
    类型: g2
    序号：17
    名称：分面饼图
*/
import * as facet_pie from './g2/facet_pie';
export { facet_pie };

/*
    时间：2020-10-26 09:20:22
    类型: g2
    序号：18
    名称：旋风图
*/
import * as whirlwind from './g2/whirlwind';
export { whirlwind };

/*
    时间：2020-10-26 10:46:18
    类型: other
    序号：19
    名称：翻牌器
*/ 
import * as flipboard from './other/flipboard';
export { flipboard }; 

/*
    时间：2020-10-26 13:24:53
    类型: other
    序号：20
    名称：滚动翻牌器
*/ 
import * as scroll_digit from './other/scroll_digit';
export { scroll_digit }; 
