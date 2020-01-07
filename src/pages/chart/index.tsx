import React, { useEffect, useRef } from 'react';
import { autoChart, AutoChartOptions } from '@antv/chart-advisor/src';
import { Row, Col } from 'antd';
/**
 * 主页:https://www.npmjs.com/package/@antv/chart-advisor
 *
 * Comparison -- 比较
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

const AChart = ({ option: { data = [], ...option }, ...props }) => {
  const instance = useRef(null);
  useEffect(() => {
    if (!instance) {
      return;
    }
    autoChart(instance.current, data, option || {});
  }, [option, data]);
  return <div ref={instance} {...props} />;
};

export default function() {
  const data = [
    {
      x: '2019-03',
      y: 385,
      serie: 'Paris',
    },
    {
      x: '2019-04',
      y: 888,
      serie: 'Paris',
    },
    {
      x: '2019-05',
      y: 349,
      serie: 'Paris',
    },
    {
      x: '2019-06',
      y: 468,
      serie: 'Paris',
    },
    {
      x: '2019-07',
      y: 477,
      serie: 'Paris',
    },
    {
      x: '2019-03',
      y: 291,
      serie: 'London',
    },
    {
      x: '2019-04',
      y: 484,
      serie: 'London',
    },
    {
      x: '2019-05',
      y: 293,
      serie: 'London',
    },
    {
      x: '2019-06',
      y: 147,
      serie: 'London',
    },
    {
      x: '2019-07',
      y: 618,
      serie: 'London',
    },
  ];
  const config = {
    configs: {
      theme: 'dark',
      title: { visible: true, text: '百分比堆叠条形图（G2 Plot配置）' },
      description: { visible: true, text: '一个简单的百分比堆叠条形图（G2 Plot配置）' },
      legend: { flipPage: false },
      xAxis: { label: { visible: true }, title: { visible: true, text: '月份' } },
      yAxis: { title: { text: '数值' } },
      label: { position: 'right' },
      xField: 'x',
      yField: 'y',
      stackField: 'serie',
      smooth: true,
      point: { visible: true },
      // width: 800,
      // height: 600,
    },
    type: 'Area',
  };

  const option: IAChart = {
    data,
    toolbar: true,
    title: '百分比堆叠条形图（advisor配置）',
    description: '一个简单的百分比堆叠条形图（advisor配置）',
    theme: 'dark',
    config,
    development: true,
    preferences: {
      canvasLayout: 'landscape',
    },
  };

  const option2 = {
    data: [
      {
        x: '防御',
        y: 588,
        serie: '马可波罗',
      },
      {
        x: '速度',
        y: 800,
        serie: '马可波罗',
      },
      {
        x: '攻击',
        y: 900,
        serie: '马可波罗',
      },
      {
        x: '躲闪',
        y: 496,
        serie: '马可波罗',
      },
      {
        x: '穿透',
        y: 444,
        serie: '马可波罗',
      },
      {
        x: '防御',
        y: 350,
        serie: '孙尚香',
      },
      {
        x: '速度',
        y: 850,
        serie: '孙尚香',
      },
      {
        x: '攻击',
        y: 900,
        serie: '孙尚香',
      },
      {
        x: '躲闪',
        y: 100,
        serie: '孙尚香',
      },
      {
        x: '穿透',
        y: 550,
        serie: '孙尚香',
      },
    ],
    // purpose: 'Distribution',
    development: true,
    toolbar: true,
    title: '某数据对比图',
    description: '统计区间：2019-2010',
    theme: 'dark',
  };

  return (
    <Row>
      <Col span={12}>
        <AChart option={option} />
      </Col>
      <Col span={12}>
        <AChart option={option2} />
      </Col>
    </Row>
  );
}
