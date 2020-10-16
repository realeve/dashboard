import React from 'react';
import styles from './index.less';
export const rangeCfg = { min: 0.3, max: 1.5, step: 0.1 };
export default ({
  showValue = true,
  ...props
}: {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  showValue?: boolean;
  onChange?: (e) => void;
}) => {
  const percent = props.value / props.max;
  return (
    <div className={styles.range}>
      {showValue && <span>{props.value}</span>}
      <input
        type="range"
        className={styles['input-range']}
        {...props}
        style={{
          background: `linear-gradient(to right, rgb(0, 251, 255), rgb(0, 176, 255) ${percent}%, rgb(38, 42, 53) ${percent *
            100}%, rgb(38, 42, 53))`,
        }}
      />
    </div>
  );
};
