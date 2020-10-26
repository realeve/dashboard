import React, { useEffect } from 'react';
import styles from './index.less';
import { useCountUp, CountUpProps } from 'react-countup';
import classnames from 'classnames';
import { thouandsNum } from '@/utils/lib';
import { textColor } from '@/component/chartItem/option';

export interface ICountUp extends CountUpProps { 
  value: number;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  decimals?: number;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}

export default ({ 
  value,
  prefix = null,
  suffix = null,
  decimals = 0,
  className,
  style,
  duration = 1.5,
  fontSize = 18,
  fontWeight = 'normal',
  backgroundColor = '#0f396b',
  fontColor = textColor,
  padding = 12,
  ...props
}: ICountUp) => {
  const { countUp, update } = useCountUp({ end: Number(value), duration, decimals, ...props });
  useEffect(() => {
    update(Number(value));
  }, [value]); 
  return (
    <div className={classnames(styles.flipBoard, className)} style={style}> 
      <div className={styles.counter}>
        <span>{prefix}</span>
        {thouandsNum(countUp as number, decimals)
          .split('')
          .map((item, idx) => (
            <div
              className={styles.value}
              style={
                [',', '.'].includes(item)
                  ? { backgroundColor: 'transparent', padding: 0 }
                  : {
                      fontSize,
                      fontWeight,
                      color: fontColor,
                      backgroundColor,
                      paddingLeft: padding,
                      paddingRight: padding,
                    }
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
