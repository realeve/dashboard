import React from 'react';

import { CloseOutlined } from '@ant-design/icons';

import 'react-resizable/css/styles.css';
import 'react-grid-layout/css/styles.css';
import { BorderItem, Blank } from '@/component/widget';

export default ({
  config,
  initState,
  onChange,
  onMockChange,
  onRemoveItem,
  idx,
  dispatch,
  ...props
}) => {
  const itemType = (config.type || '').toLowerCase();

  const Detail = () => {
    switch (itemType) {
      case '_blank':
      default:
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
