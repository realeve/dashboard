import React from 'react';
// AVA 图表
import G2Plot from '@/component/chart/chart';

import { AChart } from '@/component/chart/g2plot';

import { CloseOutlined } from '@ant-design/icons';

import 'react-resizable/css/styles.css';
import 'react-grid-layout/css/styles.css';
import { BorderItem, Decotation, Blank } from '@/component/widget';

import * as g2PlotLib from './option/g2plot';
export default ({ config, initState, onChange, onMockChange, onRemoveItem, idx, ...props }) => {
  const itemType = (config.type || '').toLowerCase();

  switch (itemType) {
    case 'decotation':
      return (
        <Decotation name="粉色蓝色透明圆形科技图标内容容器" {...props}>
          <span>65%</span>
        </Decotation>
      );
  }

  const Detail = () => {
    switch (itemType) {
      case '_blank':
        return <Blank config={initState} onChange={onChange} />;
      case 'bar':
        let stack = Math.random() > 0.5;
        let group = !stack;
        let option = g2PlotLib.line({
          header: ['类型', '日期', '数值'],
          data: [
            ['download', '2018/8/1', 4623],
            ['register', '2018/8/1', 2208],
            ['bill', '2018/8/1', 182],
            ['download', '2018/8/2', 6145],
            ['register', '2018/8/2', 2016],
            ['bill', '2018/8/2', 257],
            ['download', '2018/8/3', 508],
            ['register', '2018/8/3', 2916],
            ['bill', '2018/8/3', 289],
            ['download', '2018/8/4', 6268],
            ['register', '2018/8/4', 4512],
            ['bill', '2018/8/4', 428],
            ['download', '2018/8/5', 6411],
            ['register', '2018/8/5', 8281],
            ['bill', '2018/8/5', 619],
          ],
          showLegend: true,
          type: 'bar',
          stack,
          group,
        });
        return <AChart option={option} />;
      case 'line':
        option = g2PlotLib.line({
          header: ['类型', '日期', '数值'],
          data: [
            ['download', '2018/8/1', 4623],
            ['register', '2018/8/1', 2208],
            ['bill', '2018/8/1', 182],
            ['download', '2018/8/2', 6145],
            ['register', '2018/8/2', 2016],
            ['bill', '2018/8/2', 257],
            ['download', '2018/8/3', 508],
            ['register', '2018/8/3', 2916],
            ['bill', '2018/8/3', 289],
            ['download', '2018/8/4', 6268],
            ['register', '2018/8/4', 4512],
            ['bill', '2018/8/4', 428],
            ['download', '2018/8/5', 6411],
            ['register', '2018/8/5', 8281],
            ['bill', '2018/8/5', 619],
          ],
          legend: 0,
          x: 1,
          y: 2,
          type: 'line',
          // step: 'hv',
          percent: true,
          area: true,
          // stack: true,
          // group: true,
          showLegend: false,
          point: false,
          smooth: false,
          thumbnail: false,
        });

        return <AChart option={option} />;

      case 'radar':
        option = g2PlotLib.radar({
          header: ['角色', '维度', '数值'],
          data: [
            ['孙尚香', '防御', 5],
            ['黄忠', '防御', 49],
            ['孙尚香', '攻击', 6],
            ['黄忠', '攻击', 44],
            ['孙尚香', '速度', 61],
            ['黄忠', '速度', 33],
            ['孙尚香', '穿透', 55],
            ['黄忠', '穿透', 75],
            ['孙尚香', '护甲', 68],
            ['黄忠', '护甲', 4],
            ['孙尚香', '暴击', 45],
            ['黄忠', '暴击', 75],
          ],
          legend: 0,
          x: 1,
          y: 2,
          showLegend: false,
        });

        return <AChart option={option} />;

      default:
        return <G2Plot config={config} onMockChange={(result) => onMockChange(result, idx)} />;
    }
  };

  return (
    <BorderItem name={initState.border} {...props}>
      <CloseOutlined className="remove" onClick={() => onRemoveItem(idx)} />
      <Detail />
    </BorderItem>
  );
};
