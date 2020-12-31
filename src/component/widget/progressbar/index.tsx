import styles from './index.less';

export default ({ percent: position = 45.2, style }) => {
  return (
    <div className={styles.chartItem} style={style}>
      <div className={styles['progress-bar-warpper']}>
        <div className={styles['progress-bar']}>
          <div
            className={styles['progress-bar-bar']}
            style={{
              width: `${position  }%`,
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
    </div>
  );
};
