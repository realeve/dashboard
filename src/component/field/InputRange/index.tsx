import React from 'react';
import styles from './index.less';
import classnames from 'classnames';

export const rangeCfg = { min: 0.3, max: 1.5, step: 0.1 };
export default ({
  showValue = true,
  onChange = () => {},
  disabled = false,
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
    <div className={classnames(styles.rangeWrapper, { [styles.disabled]: disabled })}>
      {showValue && <span>{props.value}</span>}
      <i
        className="datav-icon datav-font icon-zoom-out slider-icon zoom-out "
        onClick={(e) => {
          if (disabled) {
            return;
          }
          let nextVal =
            typeof props.min !== 'undefined'
              ? Math.max(props.min, props.value - props.step)
              : props.value - props.step;
          nextVal = Number(nextVal.toFixed(1));
          onChange(nextVal);
        }}
      />
      <div className={styles.range}>
        <input
          type="range"
          className={classnames(styles['input-range'], {
            [styles.disabled]: props.disabled,
          })}
          disabled={disabled}
          readOnly={disabled}
          {...props}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, rgb(0, 251, 255), rgb(0, 176, 255) ${percent}%, rgb(38, 42, 53) ${
              percent * 100
            }%, rgb(38, 42, 53))`,
          }}
        />
      </div>
      <i
        className="datav-icon datav-font icon-zoom-in slider-icon zoom-in"
        onClick={(e) => {
          if (disabled) {
            return;
          }
          let nextVal =
            typeof props.max !== 'undefined'
              ? Math.min(props.max, props.value + props.step)
              : props.value + props.step;
          nextVal = Number(nextVal.toFixed(1));
          onChange(nextVal);
        }}
      />
    </div>
  );
};
