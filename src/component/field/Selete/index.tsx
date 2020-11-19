import React from 'react';
import { Select } from 'antd';
import { IRadioProps } from '../Radio';
import classnames from 'classnames';
import styles from '../ColorPicker/index.less';

export default ({ value, onChange, config = [], className }: IRadioProps) => {
  return (
    <div className={classnames(styles.fields, className)} style={{ width: '100%' }}>
      <Select size="middle" value={value} onChange={onChange}>
        {config.map(({ title, value }) => (
          <Select.Option key={value} value={value}>
            {title}
          </Select.Option>
        ))}
      </Select>
    </div>
  );
};
