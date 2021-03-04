import React, { useEffect, useState } from 'react';
import styles from './index.less';
import type { CountUpProps } from 'react-countup';
import classnames from 'classnames';
// import { useInterval } from 'react-use';
import { thouandsNum } from '@/utils/lib';

export type ICountUp = {
  title: string;
  value: number;
  decimals?: number;
  className?: string;
  style?: React.CSSProperties;
  theme?: 'transparent' | 'whiteTheme' | 'blueTheme';
  useThouands?: boolean;
  [key: string]: any;
} & CountUpProps;

const numId = {
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
  value,
  prefix = null,
  suffix = null,
  decimals = 0,
  className,
  style,
  duration = 0.8,
  theme = 'blueTheme',
  outlineColor = '#0f396b',
  padding = 15,
  scale = 1.2,
  useThouands = true,
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
  }, [value, decimals]);

  useEffect(() => {
    const timeId = setTimeout(() => {
      setVal(value.toFixed(decimals));
      setInited(true);
    }, 200);
    return () => {
      window.clearTimeout(timeId);
    };
  }, []);

  return (
    <div className={classnames(styles.digitalScroll, className)} style={style}>
      <div className={styles.counter}>
        <span>{prefix}</span>
        {thouandsNum(val, decimals, useThouands)
          .split('')
          .map((num, idx) => {
            return (
              <div
                className={classnames(styles.num, styles[theme])}
                style={{
                  margin: `0 ${padding}px`,
                  transform: `scale(${scale})`,
                  outlineColor,
                }}
                key={idx}
              >
                <img
                  src={`/img/number${theme === 'whiteTheme' ? '_white' : ''}.svg`}
                  style={{
                    transform: `translateY(${-numId[num] * 61.1}px)`,
                    transitionDuration: `${duration * 2} s`,
                  }}
                />
              </div>
            );
          })}
        <span>{suffix}</span>
      </div>
    </div>
  );
};
