import React from 'react';
// AVA 图表
import G2Plot from '@/component/chart/chart';

import { AChart } from '@/component/chart/g2plot';

import { CloseOutlined } from '@ant-design/icons';

import 'react-resizable/css/styles.css';
import 'react-grid-layout/css/styles.css';
import {
  BorderItem,
  FlipBoard,
  Percent,
  DigitalScroll,
  Decotation,
  Blank,
} from '@/component/widget';
import G2 from '@/component/g2';
import * as lib from './option';
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
      case 'percent':
        return <Percent option={{ value: 45.3, title: '某指标', half: Math.random() > 0.5 }} />;
      case 'flipboard':
        return <FlipBoard title="某指标" value={1336.647} decimals={2} suffix="元" />;
      case 'digitalscroll':
        return <DigitalScroll title="活动参与人数" value={138248} theme="theme1" suffix="人" />;

      case 'facet3':
        let seed = Math.random();
        let type: 'line' | 'bar' | 'column' | 'point' =
          seed > 0.75 ? 'point' : seed > 0.5 ? 'line' : seed > 0.25 ? 'column' : 'bar';
        let padding = {
          line: [20, 20, 30, 0],
          bar: [20, 20, 30, 0],
          point: [20, 20, 30, 0],
          column: [20, 0, 0, 10],
        };
        return (
          <G2
            option={{
              data: [
                ['转基因作物种植面积', '印度', 10.8],
                ['转基因作物种植面积', '美国', 72.9],
                ['转基因作物种植面积', '中国', 2.8],
                ['转基因作物种植面积', '巴西', 49.1],
                ['转基因作物种植面积', '加拿大', 11.6],
                ['转基因作物种植面积', '阿根廷', 23.8],
                ['转基因作物种植面积', '巴基斯坦', 2.9],
                ['转基因作物种植面积', '南非', 2.7],
                ['转基因作物种植面积', '巴拉圭', 3.6],
                ['转基因作物种植面积', '乌拉圭', 1.3],
                ['耕地总面积', '印度', 175.4],
                ['耕地总面积', '美国', 165.2],
                ['耕地总面积', '中国', 108.4],
                ['耕地总面积', '巴西', 73.2],
                ['耕地总面积', '加拿大', 46.9],
                ['耕地总面积', '阿根廷', 38.6],
                ['耕地总面积', '巴基斯坦', 22],
                ['耕地总面积', '南非', 12.1],
                ['耕地总面积', '巴拉圭', 5.5],
                ['耕地总面积', '乌拉圭', 1.8],
                ['转基因作物种植占比（%）', '印度', 6.2],
                ['转基因作物种植占比（%）', '美国', 44.1],
                ['转基因作物种植占比（%）', '中国', 2.6],
                ['转基因作物种植占比（%）', '巴西', 67],
                ['转基因作物种植占比（%）', '加拿大', 24.7],
                ['转基因作物种植占比（%）', '阿根廷', 61.6],
                ['转基因作物种植占比（%）', '巴基斯坦', 13.2],
                ['转基因作物种植占比（%）', '南非', 22.4],
                ['转基因作物种植占比（%）', '巴拉圭', 65.7],
                ['转基因作物种植占比（%）', '乌拉圭', 73],
              ],
              header: ['类型', '国家', '数值'],
              showLegend: false,
              legend: 0,
              x: 1,
              y: 2,
              padding: padding[type],
              onMount: lib.g2Facet3,
              type,
            }}
            renderer="svg"
          />
        );
      case 'facet2':
        seed = Math.random();
        type = seed > 0.75 ? 'point' : seed > 0.5 ? 'line' : seed > 0.25 ? 'column' : 'bar';
        padding = {
          line: [10, 20, 20, 0],
          point: [20, 20, 20, 0],
          bar: [10, 20, 20, 0],
          column: [20, 90, 40, 80],
        };
        return (
          <G2
            option={{
              data: [
                ['办公用品', '收纳', 340],
                ['办公用品', '笔', 20760],
                ['办公用品', '纸张', 28750],
                ['技术', '配件', 4090],
                ['技术', '电话', 9880],
                ['技术', '复印机', 40988],
                ['家具', '桌子', 14870],
                ['家具', '椅子', 37098],
                ['家具', '书架', 49099],
              ],
              header: ['类型', '国家', '数值'],
              showLegend: true,
              legend: 0,
              x: 1,
              y: 2,
              padding: padding[type],
              onMount: lib.g2Facet2,
              type,
            }}
            renderer="svg"
          />
        );
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
