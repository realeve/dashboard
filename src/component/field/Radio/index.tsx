import { Radio } from 'antd';
import React from 'react';
import styles from '../ColorPicker/index.less';
export default ({ value, onChange, config = [] }) => {
  return (
    <div className={styles.fields}>
      <Radio.Group size="middle" value={value} onChange={e => onChange(e.target.value)}>
        {config.map(({ title, value }) => (
          <Radio.Button key={value} value={value}>
            {title}
          </Radio.Button>
        ))}
      </Radio.Group>
    </div>
  );
};
