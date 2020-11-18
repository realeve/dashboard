import React from 'react';

import { CloseOutlined } from '@ant-design/icons';

import 'react-resizable/css/styles.css';
import 'react-grid-layout/css/styles.css';
import { BorderItem, Decotation, Blank } from '@/component/widget';

export default ({ config, initState, onChange, onMockChange, onRemoveItem, idx, ...props }) => {
  const itemType = (config.type || '').toLowerCase();

  switch (itemType) {
    case 'decotation':
      return (
        <Decotation name="粉色蓝色透明圆形科技图标内容容器" {...props}>
          <div style={{ textAlign: 'center' }}>
            <span>好品率</span>
            <br />
            <span>65%</span>
          </div>
        </Decotation>
      );
  }

  const Detail = () => {
    switch (itemType) {
      case '_blank':
        return <Blank config={initState} onChange={onChange} />;
    }
  };

  return (
    <BorderItem name={initState.border} {...props}>
      <CloseOutlined className="remove" onClick={() => onRemoveItem(idx)} />
      <Detail />
    </BorderItem>
  );
};
