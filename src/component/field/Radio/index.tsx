import { Radio } from 'antd';
import React from 'react';
import styles from '../ColorPicker/index.less';
import classnames from 'classnames';
import { isString } from '@antv/util';
export interface IRadioProps {
  value: string | number;
  onChange: (e: string) => void;
  config: { title: string | React.ReactNode; value: string }[];
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

export default ({ value, onChange, config = [], className }: IRadioProps) => {
  return (
    <div className={classnames(styles.fields, className)}>
      <Radio.Group size="middle" value={value} onChange={(e) => onChange(e.target.value)}>
        {handleConfig(config).map(({ title, value }) => (
          <Radio.Button key={value + title} value={value}>
            {title}
          </Radio.Button>
        ))}
      </Radio.Group>
    </div>
  );
};

export const Select = ({ value, onChange, config = [] }: IRadioProps) => {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} className="data_input">
      {handleConfig(config).map(({ title, value }) => (
        <option key={value} value={value}>
          {title}
        </option>
      ))}
    </select>
  );
};
