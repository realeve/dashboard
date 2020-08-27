import ColorPicker from 'rc-color-picker';
import { Radio } from 'antd';
import React, { useState, useEffect } from 'react';
import 'rc-color-picker/assets/index.css';
import styles from './index.less';
import { hex2rgb } from '@/component/chartItem/option/lib';
import * as R from 'ramda';
import Draggable from 'react-draggable';

enum EColorType {
  NONE = '0',
  COLOR = '1',
  GARDIENT = '2',
}

const getTabIdx = value => {
  if (value === 'transparent') {
    return EColorType.NONE;
  }
  if (value.slice(0, 4) === 'rgba') {
    return EColorType.COLOR;
  }
  return EColorType.GARDIENT;
};

const ColorItem = ({ value, onChange, position }) => (
  <ColorPicker
    color={value}
    onChange={e => {
      let color = hex2rgb(e.color);
      onChange(`rgba(${color},${e.alpha / 100})`);
    }}
    placement="bottomRight"
  >
    <div className={styles.item} style={{ backgroundColor: value }}>
      {position}
    </div>
  </ColorPicker>
);

const getInitVal = value => {
  if (value.slice(0, 6) == 'linear') {
    return value
      .replace('%)', '%')
      .split(', ')
      .slice(1)
      .map(item => item.replace(/%/g, '').split(' '));
  }
  return [
    [value, 0],
    [value, 50],
    [value, 100],
  ];
};

const getGardient = color =>
  `linear-gradient(90deg, ${color[0].join(' ')}%, ${color[1].join(' ')}%, ${color[2].join(' ')}%)`;

/**
 * 渐变选择器
 */
const GardientPicker = ({ value, onChange }) => { 
  const [color, setColor] = useState(getInitVal(value));
  useEffect(() => {
    onChange(getGardient(color));
  }, [color]);

  return (
    <div className={styles.gardient}>
      <div
        title="点击与拖动设置渐变色"
        className={styles.head}
        style={{
          background: getGardient(color),
        }}
      />
      <div className={styles.tools}>
        {color.map((item, idx) => (
          <Draggable
            axis="x"
            key={idx}
            defaultPosition={{ x: 0, y: 0 }}
            position={{ x: color[idx][1] * 1.78 - 12, y: 0 }}
            onDrag={e => {
              let nextPos = (Number(e.layerX) / 1.78).toFixed(0);
              nextPos = R.clamp(0, 100, nextPos);
              let prev = R.nth(idx, color);
              prev[1] = nextPos;
              let pos = R.update(idx, prev, color);
              setColor(pos);
            }}
            bounds={{ top: 0, left: 0, right: 178, bottom: 0 }}
          >
            <div className={styles.itemWrapper}>
              <ColorItem
                value={item[0]}
                onChange={e => {
                  let prev = R.nth(idx, color);
                  prev[0] = e;
                  let nextColor = R.update(idx, prev, color);
                  setColor(nextColor);
                }}
                position={color[idx][1]}
              />
            </div>
          </Draggable>
        ))}
      </div>
    </div>
  );
};

export const PureColor = ({ value, onChange }) => (
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
);

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
      {tab == EColorType.COLOR && <PureColor value={value} onChange={onChange} />}
      {tab == EColorType.GARDIENT && <GardientPicker value={value} onChange={onChange} />}
    </div>
  );
};
