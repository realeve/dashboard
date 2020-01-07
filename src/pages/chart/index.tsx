import React, { useEffect, useRef } from 'react';
import { autoChart, AutoChartOptions } from '@antv/chart-advisor/src';
import { Row, Col } from 'antd';
/**
 * 主页:https://www.npmjs.com/package/@antv/chart-advisor
 *
 *
 *  Comparison -- 比较
    Trend -- 趋势
    Distribution -- 分布
    Rank -- 排行
    Proportion -- 比例
    Composition -- 组成

 * 示例：https://observablehq.com/@jiazhewang/autochart-automatic-chart-dev-library-by-antv
 */

export interface IAChart extends AutoChartOptions {
  data: any[];
  [key: string]: any;
}

export const AChart = ({ option: { data = [], ...option }, ...props }) => {
  const instance = useRef(null);
  useEffect(() => {
    if (!instance) {
      return;
    }
    autoChart(instance.current, data, option || {}).then(chart => {
      console.log(chart);
    });
  }, [option, data]);
  return <div ref={instance} style={{ width: '100%', height: '100%' }} {...props} />;
};
