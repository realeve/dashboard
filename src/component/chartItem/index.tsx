import React from 'react';
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
  ActiveRingChart,
} from '@/component/widget';
import Echarts from '@/component/echarts';
import echarts from 'echarts';
import * as lib from './option';

export default ({ config, borderName, onMockChange, onRemoveItem, idx, ...props }) => {
  const itemType = (config.type || '').toLowerCase();
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
      case 'activeringchart':
        return (
          <ActiveRingChart
            config={lib.activeRingChart([
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
            ])}
          />
        );
      case 'ringchart':
        return <Echarts option={lib.ringchart({ value: 73, title: '某项目' })} renderer="svg" />;
      case 'water':
        return <Echarts option={lib.water({ value: 0.3, title: '某項目' })} renderer="canvas" />;
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
