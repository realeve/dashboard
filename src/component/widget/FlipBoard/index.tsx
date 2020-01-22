import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import React from 'react';
import styles from './index.less';
import { useCountUp } from 'react-countup';

export default ({ title = '', value, prefix = <ArrowUpOutlined />, precision = 0, ...props }) => {
  const { countUp } = useCountUp({ end: value });
  return (
    <div style={{ color: '#73aae5' }}>
      {prefix}
      {countUp}
    </div>
  );
};
