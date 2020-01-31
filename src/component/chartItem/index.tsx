import React, { useState } from 'react';
// AVA 图表
import GridItem from '@/component/chart/chart';

import { CloseOutlined } from '@ant-design/icons';

import 'react-resizable/css/styles.css';
import 'react-grid-layout/css/styles.css';
import {
  ProgressBar,
  BorderItem,
  ScrollBoard,
  ScrollRankingBoard,
  FlipBoard,
  Pie,
  Percent,
} from '@/component/widget';
import Echarts from '@/component/echarts';
import G2 from '@/component/g2';
import * as lib from './option';

export default ({ config, borderName, onMockChange, onRemoveItem, idx, ...props }) => {
  const itemType = (config.type || '').toLowerCase();

  // useInterval(() => {
  //   if (!['pie', 'rose'].includes(itemType) || !instance) {
  //     return;
  //   }

  //   console.log(instance);
  //   console.log(instance.getOption());
  // }, 3000);

  switch (itemType) {
    case 'progress':
      return <ProgressBar percent={43.3} title="指标占比" {...props} />;
    case 'scrollboard':
      return (
        <ScrollBoard
          config={{
            header: ['列1', '列2', '列3'],
            data: [
              ['23', '行1列2', '行1列3'],
              ['43', '行2列2', '行2列3'],
              ['133', '行3列2', '行3列3'],
              ['54', '行4列2', '行4列3'],
              ['32', '行5列2', '行5列3'],
              ['56', '行6列2', '行6列3'],
              ['76', '行7列2', '行7列3'],
              ['543', '行8列2', '行8列3'],
              ['332', '行9列2', '行9列3'],
              ['1121', '行10列2', '行10列3'],
            ],
            index: true,
            columnWidth: [50],
            align: ['center'],
            carousel: 'page',
            waitTime: 4000,
          }}
        />
      );
    case 'rankingboard':
      return (
        <ScrollRankingBoard
          config={{
            waitTime: 4000,
            data: [
              {
                name: '周口',
                value: 55,
              },
              {
                name: '南阳',
                value: 120,
              },
              {
                name: '西峡',
                value: 78,
              },
              {
                name: '驻马店',
                value: 66,
              },
              {
                name: '新乡',
                value: 80,
              },
              {
                name: '信阳',
                value: 45,
              },
              {
                name: '漯河',
                value: 29,
              },
              {
                name: '漯河2',
                value: 129,
              },
              {
                name: '漯河3',
                value: 59,
              },
              {
                name: '漯河4',
                value: 19,
              },
            ],
            carousel: 'page',
          }}
        />
      );
  }

  const Detail = () => {
    switch (itemType) {
      case '_blank':
        return null;
      case 'percent':
        return <Percent option={{ value: 45.3, title: '某指标', half: Math.random() > 0.5 }} />;
      case 'flipboard':
        return <FlipBoard title="某指标" value={1336.647} decimals={2} suffix="元" />;

      case 'roundbar':
        return (
          <Echarts
            option={lib.roundBar({
              data: [
                ['新能源智能汽车', 23],
                ['航天航空', 12],
                ['第三代半导体', 18],
                ['产业金融', 12],
                ['商务会展', 43],
                ['临空经济', 23],
                ['文创旅游', 32],
                ['智能制造业', 21],
              ],
            })}
          />
        );
      case 'pie':
        return (
          <Pie
            option={{
              data: [
                ['体育技能', 17],
                ['体育行为', 23],
                ['体质健康', 27],
                ['体育意识', 33],
                ['体育知识', 29],
              ],
              title: '某指标',
            }}
          />
        );
      case 'rose':
        return (
          <Pie
            option={{
              data: [
                ['体育技能', 17],
                ['体育行为', 23],
                ['体质健康', 27],
                ['体育意识', 33],
                ['体育知识', 29],
              ],
              title: '某指标',
              roseType: 'rose',
            }}
          />
        );
      case 'radialbar':
        return (
          <Echarts
            option={lib.radialBarChart({
              data: [
                ['周一', 15],
                ['周张2二', 6],
                ['周三', 17],
                ['周四', 8],
                ['周一2', 9],
                ['周张2二2', 9],
                ['周三2', 23],
                ['周四2', 7],
              ],
            })}
            renderer="svg"
          />
        );
      case 'ringchart':
        return <Echarts option={lib.ringchart({ value: 73, title: '某项目' })} renderer="svg" />;
      case 'water':
        return <Echarts option={lib.water({ value: 0.3, title: '某項目' })} renderer="canvas" />;
      case 'pictorial':
        let theme: 'rect' | 'round' = Math.random() > 0.5 ? 'rect' : 'round';
        return (
          <Echarts
            option={lib.pictorialBar({
              data: [
                ['通信', 2691],
                ['网络', 4300],
                ['能源', 3416],
                ['建筑', 4666],
              ],
              size: 32,
              yAxis: Math.random() > 0.5,
              theme,
            })}
            renderer={theme === 'rect' ? 'svg' : 'canvas'}
          />
        );
      case 'gardientline':
        return (
          <Echarts
            option={lib.gardientLine({
              data: {
                x: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                y: [
                  {
                    name: 'name1',
                    value: [320, 232, 101, 334, 244, 235, 332],
                  },
                  {
                    name: 'name2',
                    value: [148, 232, 254, 231, 176, 121, 232],
                  },
                  {
                    name: 'name3',
                    value: [148, 132, 154, 131, 176, 121, 132],
                  },
                ],
              },
              yAxis: false,
              smooth: false,
            })}
            renderer="svg"
          />
        );
      case 'waffle':
        return (
          <G2
            option={{
              data: [
                ['type 1', 32],
                ['type 2', 65],
                ['type 3', 30],
                ['type 4', 42],
              ],
              ...lib.waffle,
              height: 160,
            }}
            renderer="svg"
          />
        );
      case 'g2radialbar':
        return (
          <G2
            option={{
              data: [
                ['Zombieland', 9],
                ['Wieners', 8],
                ['Toy Story', 8],
                ['trashkannon', 7],
                ['the GROWLERS', 6],
                ['mudweiser', 6],
                ['ThunderCats', 4],
                ['The Taqwacores - Motion Picture', 4],
                ['The Shawshank Redemption', 2],
                ['The Olivia Experiment', 1],
              ],
              innerPercent: 20,
              color: Math.random() > 0.3 ? '0' : Math.random() > 0.3 ? '1' : '#8543e0',
              header: ['指标', '值'],
              title: '这是一组标题',
              padding: 5,
              ...lib.g2RadialBarChart,
            }}
            renderer="svg"
          />
        );
      case 'wind':
        return (
          <G2
            option={{
              data: [
                ['2016 年', '乌拉圭', 1.3],
                ['2017 年', '乌拉圭', 1.8],
                ['2016 年', '巴拉圭', 3.6],
                ['2017 年', '巴拉圭', 5.5],
                ['2016 年', '南非', 3.7],
                ['2017 年', '南非', 12.1],
                ['2016 年', '巴基斯坦啊啊', 2.9],
                ['2017 年', '巴基斯坦啊啊', 22],
                ['2016 年', '阿根廷', 23.8],
                ['2017 年', '阿根廷', 38.6],
                ['2016 年', '加拿大', 11.6],
                ['2017 年', '加拿大', 46.9],
                ['2016 年', '巴西', 49.1],
                ['2017 年', '巴西', 73.2],
                ['2016 年', '中国', 2.8],
                ['2017 年', '中国', 108.4],
                ['2016 年', '美国', 72.9],
                ['2017 年', '美国', 165.2],
                ['2016 年', '印度', 49.1],
                ['2017 年', '印度', 175.4],
              ],
              header: ['类型', '国家', '数值'],
              showLegend: true,
              legend: 0,
              x: 1,
              y: 2,
              padding: [20, 0, 10, 0],
              onMount: lib.g2Wind,
            }}
            renderer="svg"
          />
        );
      case 'facet3':
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
              padding: [20, 0, 0, 10],
              onMount: lib.g2Facet3,
            }}
            renderer="svg"
          />
        );
      case 'facet2':
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
              padding: [0, 20, 20, 0],
              onMount: lib.g2Facet2,
              type: Math.random() > 0.5 ? 'line' : 'bar',
            }}
            renderer="svg"
          />
        );
      case 'g2rose':
        return (
          <G2
            option={{
              data: [
                ['2001', 41.8],
                ['2002', 38],
                ['2003', 33.7],
                ['2004', 30.7],
                ['2005', 25.8],
                ['2006', 31.7],
                ['2007', 33],
                ['2008', 46],
                ['2009', 38.3],
              ],
              header: ['年份', '指标'],
              innerPercent: Math.random() > 0.5 ? 15 : 0,
              color:
                Math.random() > 0.3
                  ? '#40a9ff-#0050b3'
                  : Math.random() > 0.3
                  ? '#1890FF'
                  : 'rainbow',
              startAngle: Math.random() > 0.5 ? 180 : 0,
              endAngle: 360,
              legend: true,
              padding: [0, 0, 40, 0],
              onMount: lib.g2Rose,
            }}
            renderer="canvas"
          />
        );
      default:
        return <GridItem config={config} onMockChange={result => onMockChange(result, idx)} />;
    }
  };

  return (
    <BorderItem name={borderName} {...props}>
      <CloseOutlined className="remove" onClick={() => onRemoveItem(idx)} />
      <Detail />
    </BorderItem>
  );
};
