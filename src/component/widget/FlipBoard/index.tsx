import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import React from 'react';
import styles from './index.less';
import { useCountUp } from 'react-countup';
import { thouandsNum } from '@/utils/lib';

export default ({
  title = '',
  value,
  prefix = <ArrowUpOutlined />,
  suffix = '',
  precision = 0,
  ...props
}) => {
  const { countUp } = useCountUp({ end: Number(value) });
  return (
    <div className={styles.flipBoard}>
      {prefix}
      {thouandsNum(countUp as number, precision)
        .split('')
        .map((item, idx) => (
          <div
            className={styles.value}
            style={
              [',', '.'].includes(item) ? { backgroundColor: 'transparent', padding: 0 } : null
            }
            key={idx}
          >
            {item}
          </div>
        ))}
      <span>{suffix}</span>
    </div>
  );
};
