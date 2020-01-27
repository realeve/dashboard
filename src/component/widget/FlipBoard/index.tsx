// import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import React, { useEffect } from 'react';
import styles from './index.less';
import { useCountUp, CountUpProps } from 'react-countup';
import classnames from 'classnames';
import { thouandsNum } from '@/utils/lib';

export interface ICountUp extends CountUpProps {
  title: string;
  value: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  decimals?: number;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

export default ({
  title = '',
  value,
  prefix = null,
  suffix = null,
  decimals = 0,
  className,
  style,
  duration = 1.5,
  ...props
}: ICountUp) => {
  const { countUp, update } = useCountUp({ end: Number(value), duration, decimals, ...props });
  useEffect(() => {
    update(Number(value));
  }, [value]);

  return (
    <div className={classnames(styles.flipBoard, className)} style={style}>
      <div className={styles.title}>{title}</div>
      <div className={styles.counter}>
        {prefix}
        {thouandsNum(countUp as number, decimals)
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
    </div>
  );
};
