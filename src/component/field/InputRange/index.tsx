import React, { useState, useEffect } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { useDebounce } from 'react-use';

export const rangeCfg = { min: 0.3, max: 1.5, step: 0.1 };
export default ({
  showValue = true,
  onChange = () => {},
  disabled = false,
  formatter = (e = 0) => <span>{e}</span>,
  ...props
}: {
  min?: number;
  max?: number;
  step?: number;
  value?: number;
  showValue?: boolean;
  onChange?: (e) => void;
  formatter?: (e: number) => React.ReactNode;
  disabled?: boolean;
}) => {
  const [innerValue, setInnerValue] = useState(props.value || 0);

  const percent = innerValue / props.max;

  useEffect(() => {
    if (innerValue !== props.value) {
      setInnerValue(props.value);
    }
  }, [props.value]);

  // 优化数据变更时的响应性能；
  useDebounce(
    () => {
      onChange(innerValue);
    },
    500,
    [innerValue],
  );

  return (
    <div className={classnames(styles.rangeWrapper, { [styles.disabled]: disabled })}>
      {showValue && formatter(innerValue)}
      <i
        className="datav-icon datav-font icon-zoom-out slider-icon zoom-out "
        onClick={() => {
          if (disabled) {
            return;
          }
          let nextVal =
            typeof props.min !== 'undefined'
              ? Math.max(props.min, innerValue - props.step)
              : innerValue - props.step;
          nextVal = Number(nextVal.toFixed(1));
          setInnerValue(nextVal);
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
          value={innerValue}
          onChange={(e) => setInnerValue(Number(e.target.value))}
          style={{
            background: `linear-gradient(to right, rgb(0, 251, 255), rgb(0, 176, 255) ${percent}%, rgb(38, 42, 53) ${
              percent * 100
            }%, rgb(38, 42, 53))`,
          }}
        />
      </div>
      <i
        className="datav-icon datav-font icon-zoom-in slider-icon zoom-in"
        onClick={() => {
          if (disabled) {
            return;
          }
          let nextVal =
            typeof props.max !== 'undefined'
              ? Math.min(props.max, innerValue + props.step)
              : innerValue + props.step;
          nextVal = Number(nextVal.toFixed(1));
          setInnerValue(nextVal);
        }}
      />
    </div>
  );
};
