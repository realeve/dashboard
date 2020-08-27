import ColorPicker from 'rc-color-picker';
import { Radio } from 'antd';
import React, { useState } from 'react';
import 'rc-color-picker/assets/index.css';
import styles from './index.less';
import { hex2rgb } from '@/component/chartItem/option/lib';
enum EColorType {
  NONE = '0',
  COLOR = '1',
  GARDIENT = '2',
}
const getTabIdx = value => {
  console.log(value.slice(0, 4));
  if (value === 'transparent') {
    return EColorType.NONE;
  }
  if (value.slice(0, 4) === 'rgba') {
    return EColorType.COLOR;
  }
  return EColorType.GARDIENT;
};

export default ({ value, onChange }) => {
  const [tab, setTab] = useState(getTabIdx(value));

  return (
    <div className={styles.fields}>
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
      {tab == EColorType.COLOR && (
        <ColorPicker
          color={value}
          onChange={e => {
            let color = hex2rgb(e.color);
            onChange(`rgba(${color},${e.alpha / 100})`);
          }}
          placement="bottomRight"
        >
          <div className={styles.head} style={{ backgroundColor: value }}>
            点击设置颜色
          </div>
        </ColorPicker>
      )}
    </div>
  );
};
