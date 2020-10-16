import React from 'react';
import styles from './index.less';
import classnames from 'classnames';

export const rangeCfg = { min: 0.3, max: 1.5, step: 0.1 };
export default ({
  showValue = true,
  onChange = () => {},
  ...props
}: {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  showValue?: boolean;
  onChange?: (e) => void;
  disabled?: boolean;
}) => {
  const percent = props.value / props.max;
  return (
    <div className={styles.range}>
      {showValue && <span>{props.value}</span>}
      <input
        type="range"
        className={classnames(styles['input-range'], {
          [styles.disabled]: props.disabled,
        })}
        {...props}
        onChange={e => onChange(Number(e.target.value))}
        style={{
          background: `linear-gradient(to right, rgb(0, 251, 255), rgb(0, 176, 255) ${percent}%, rgb(38, 42, 53) ${percent *
            100}%, rgb(38, 42, 53))`,
        }}
      />
    </div>
  );
};
