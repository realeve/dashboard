import React, { useState, useEffect } from 'react';
import styles from './index.less';
import { useTimeout } from 'react-use';
import classnames from 'classnames';

export default ({ percent = 45.2, title = '指标百分比' }) => {
  const [position, setPosition] = useState(0);
  const ready = useTimeout(1500);
  useEffect(() => {
    if (ready) {
      setPosition(percent);
    }
  }, [ready, percent]);

  return (
    <div className={styles.chartItem}>
      <div className={styles.title}>{title}</div>
      <div className={styles['progress-bar-warpper']}>
        <div className={styles['progress-bar']}>
          <div
            className={styles['progress-bar-bar']}
            style={{
              width: position + '%',
            }}
          >
            <div className={styles['progress-bar-bar-light']} />
          </div>
          <div
            className={styles['progress-bar-tip']}
            style={{
              left: `calc(${position}% - 5px)`,
            }}
          >
            {position}%
          </div>
          <div
            className={styles['progress-bar-triangle']}
            style={{
              left: `calc(${position}% - 10px)`,
            }}
          />
        </div>
      </div>
      }
    </div>
  );
};
