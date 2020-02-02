// import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { CountUpProps } from 'react-countup';
import classnames from 'classnames';
import { useInterval } from 'react-use';
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
  duration = 0.8,
  scale = 1.2,
  ...props
}: ICountUp) => {
  const [inited, setInited] = useState(false);
  const [val, setVal] = useState<string | number>(
    String(value.toFixed(decimals)).replace(/\d/g, '0'),
  );

  useEffect(() => {
    if (!inited) {
      return;
    }
    setVal(value.toFixed(decimals));
  }, [value]);

  useEffect(() => {
    let timeId = setTimeout(() => {
      setVal(value.toFixed(decimals));
      setInited(true);
    }, 100);
    return () => {
      window.clearTimeout(timeId);
    };
  }, []);

  useInterval(() => {
    let nextVal = Number(val) + Number((Math.random() * 500).toFixed(decimals));
    setVal(nextVal);
  }, 2000);

  return (
    <div className={classnames(styles.digitalScroll, className)} style={style}>
      <div className={styles.title}>{title}</div>
      <div className={styles.counter}>
        {prefix}
        {thouandsNum(val, decimals)
          .split('')
          .map((num, idx) => {
            if (['.', ','].includes(num)) {
              return (
                <div className={styles.item} key={idx}>
                  {num}
                </div>
              );
            }
            return (
              <i
                key={idx}
                style={{
                  backgroundPosition: `0 ${-parseInt(num) * 58}px`,
                  transitionDuration: `${duration} s`,
                  transform: `scale(${scale})`,
                }}
              />
            );
          })}
        <span>{suffix}</span>
      </div>
    </div>
  );
};
