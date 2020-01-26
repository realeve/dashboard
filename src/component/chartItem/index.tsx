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

  if (itemType === 'progress') {
    return <ProgressBar percent={43.3} title="指标占比" {...props} />;
  } else if (itemType === 'scrollboard') {
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
  } else if (itemType === 'rankingboard') {
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
      case 'ringchart':
        return <Echarts option={lib.ringchart({ value: 73, title: '某项目' })} renderer="svg" />;
      case 'water':
        return <Echarts option={lib.water({ value: 0.3, title: '某項目' })} renderer="canvas" />;
      case 'waffle':
        return (
          <G2
            option={{
              data: [
                ['type 1', 32],
                ['type 2', 65],
                ['type 3', 30],
                ['type 4', 42],
              ].map(item => ({ name: item[0], value: item[1] })),
              onMount: lib.waffle,
              height: 160,
            }}
            renderer="svg"
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
