import React from 'react';
import { Radio } from 'antd';
import styles from '../ColorPicker/index.less';
import classnames from 'classnames';
import { isString } from '@antv/util';

export interface IRadioProps {
  value: string | number;
  onChange: (e: string) => void;
  disabled?: boolean;
  config?: { title: string | React.ReactNode; value: string }[] | string;
  className?: string;
}

/**
 *
 * @param config 处理配置列表
 */
const handleConfig = (config) => {
  if (isString(config[0])) {
    if (isString(config)) {
      config = config.split(',');
    }
    return config.map((title) => ({ title, value: title }));
  }
  return config;
};

export default ({ value, onChange, config = [], disabled, className }: IRadioProps) => {
  return (
    <div className={classnames(styles.fields, className)}>
      <Radio.Group
        disabled={disabled}
        size="middle"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {handleConfig(config).map(({ title, value: val }) => (
          <Radio.Button key={val + title} value={val}>
            {title}
          </Radio.Button>
        ))}
      </Radio.Group>
    </div>
  );
};

export const Select = ({ value, onChange, disabled, config = [] }: IRadioProps) => {
  return (
    <select
      disabled={disabled}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="data_input"
    >
      {handleConfig(config).map(({ title, value: val }) => (
        <option key={value + title} value={val}>
          {title}
        </option>
      ))}
    </select>
  );
};
