import { Radio } from 'antd';
import React from 'react';
import styles from '../ColorPicker/index.less';
export interface IRadioProps {
  value: string;
  onChange: (e: string) => void;
  config: { title: string | React.ReactNode; value: string }[];
}
export default ({ value, onChange, config = [] }: IRadioProps) => {
  return (
    <div className={styles.fields}>
      <Radio.Group size="middle" value={value} onChange={(e) => onChange(e.target.value)}>
        {config.map(({ title, value }) => (
          <Radio.Button key={value} value={value}>
            {title}
          </Radio.Button>
        ))}
      </Radio.Group>
    </div>
  );
};

export const Select = ({ value, onChange, config = [] }: IRadioProps) => {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="data_input"
      style={{ width: '100%' }}
    >
      {config.map(({ title, value }) => (
        <option key={value} value={value}>
          {title}
        </option>
      ))}
    </select>
  );
};
