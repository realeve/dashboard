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
  theme?: 'transparent' | 'theme1' | 'theme2';
  [key: string]: any;
}

let numId = {
  0: 0,
  1: 1,
  2: 2,
  3: 3,
  4: 4,
  5: 5,
  6: 6,
  7: 7,
  8: 8,
  9: 9,
  '.': 10,
  ',': 11,
};

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
  theme = 'theme1',
  // ...props
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
            // if (['.', ','].includes(num)) {
            //   return (
            //     <div className={styles.item} key={idx}>
            //       {num}
            //     </div>
            //   );
            // }parseInt(num)
            return (
              <div
                key={idx}
                className={classnames(styles.num, styles[theme])}
                style={{
                  backgroundPosition: `0 ${-numId[num] * 61.1}px`, //58
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
