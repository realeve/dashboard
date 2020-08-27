import ColorPicker from 'rc-color-picker';
import { Radio } from 'antd';
import React, { useState } from 'react';
import 'rc-color-picker/assets/index.css';
import styles from './index.less';
import { hex2rgb } from '@/component/chartItem/option/lib';

export default ({ value, onChange }) => {
  const [tab, setTab] = useState(0);
  return (
    <div className={styles.colorpicker}>
      <Radio.Group
        size="middle"
        value={tab}
        onChange={e => {
          let val = e.target.value;
          setTab(val);
          if (val == 0) {
            onChange('transparent');
          }
        }}
      >
        <Radio.Button value="0">透明</Radio.Button>
        <Radio.Button value="1">纯色</Radio.Button>
        <Radio.Button value="2">渐变</Radio.Button>
      </Radio.Group>
      {tab == 1 && (
        <ColorPicker
          color={value}
          onChange={e => {
            let color = hex2rgb(e.color);
            onChange(`rgba(${color},${e.alpha / 100})`);
          }}
          placement="bottomRight"
        >
          <div className={styles.head} style={{ backgroundColor: value, width: 178 }} />
        </ColorPicker>
      )}
    </div>
  );
};
