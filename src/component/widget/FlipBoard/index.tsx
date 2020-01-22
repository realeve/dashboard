import { Statistic } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import React from 'react';
import styles from './index.less';

export default ({
  title = '',
  value,
  valueColor = '#73aae5',
  prefix = <ArrowUpOutlined />,
  precision = 0,
  ...props
}) => {
  return (
    <Statistic
      title={title}
      value={value}
      precision={precision}
      valueStyle={{ color: valueColor, fontSize: 36 }}
      prefix={prefix}
      className={styles.flipBoard}
      {...props}
    />
  );
};
