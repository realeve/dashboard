import React from 'react';
// AVA 图表
import GridItem from '@/component/chart/chart';

import { CloseOutlined } from '@ant-design/icons';

import 'react-resizable/css/styles.css';
import 'react-grid-layout/css/styles.css';
import { ProgressBar, BorderItem } from '@/component/widget';

export default ({ config, borderName, onMockChange, onRemoveItem, idx, ...props }) => {
  if (config.type === 'progress') {
    return <ProgressBar percent={43.3} title="指标占比" {...props} />;
  }

  return (
    <BorderItem name={borderName} {...props}>
      <CloseOutlined className="remove" onClick={() => onRemoveItem(idx)} />
      {config.type === '_blank' ? null : (
        <GridItem config={config} onMockChange={result => onMockChange(result, idx)} />
      )}
    </BorderItem>
  );
};
