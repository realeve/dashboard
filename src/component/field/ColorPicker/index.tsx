import ColorPicker from '@/component/rc-color-picker';
import { Radio } from 'antd';
import React, { useState, useEffect } from 'react';
import 'rc-color-picker/assets/index.css';
import styles from './index.less';
import { hex2rgb, rgb2hex } from '@/component/chartItem/option/lib';
import * as R from 'ramda';
import Draggable from 'react-draggable';
import paletteList from './palette';
import * as colorLib from '@/utils/colors/lib';

enum EColorType {
  NONE = '0',
  COLOR = '1',
  GARDIENT = '2',
}

const getTabIdx = (value) => {
  if (value === 'transparent') {
    return EColorType.NONE;
  }
  if (value.slice(0, 4) === 'rgba') {
    return EColorType.COLOR;
  }
  return EColorType.GARDIENT;
};

const ColorItem = ({ value = '', onChange, position, onVisibleChange }) => {
  if (!value) {
    return null;
  }
  const val = value.replace(/([a-zA-Z]|\(|\))/g, '').split(',');

  return (
    <ColorPicker
      color={rgb2hex(value).slice(0, 7)}
      alpha={val.length === 4 ? Number(val[3]) * 100 : 100}
      onMouseUp={(e) => {
        const color = hex2rgb(e.color);
        onChange(`rgba(${color},${e.alpha / 100})`);
      }}
      placement="bottomRight"
      onVisibleChange={onVisibleChange}
    >
      <div className={styles.item} style={{ backgroundColor: value }}>
        {position}
      </div>
    </ColorPicker>
  );
};

const getInitVal = (value: string) => {
  if (value.slice(0, 6) === 'linear') {
    return value
      .replace('%)', '%')
      .split(', ')
      .slice(1)
      .map((item) => item.replace(/%/g, '').split(' '));
  }
  return [
    [value, 0],
    [value, 50],
    [value, 100],
  ];
};

const getGardient = (_color: string[][]) => {
  const color = R.sort((a, b) => Number(a[1]) - Number(b[1]), _color);
  return `linear-gradient(90deg, ${color[0].join(' ')}%, ${color[1].join(' ')}%, ${color[2].join(
    ' ',
  )}%)`;
};

/**
 * 渐变选择器
 */
const GardientPicker = ({ value, onChange, disabled = false }) => {
  // https://zh-hans.reactjs.org/docs/hooks-faq.html#how-to-create-expensive-objects-lazily
  const [color, setColor] = useState(() => getInitVal(value));
  useEffect(() => {
    const nextGardient = getGardient(color);
    if (value === nextGardient) {
      return;
    }
    onChange(nextGardient);
  }, [color]);

  const [show, setShow] = useState(false);

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
            disabled={disabled || show}
            onStop={(e) => {
              let nextPos = (Number(e.layerX) / 1.78).toFixed(0);
              nextPos = R.clamp(0, 100, nextPos);
              const prev = R.nth(idx, color);
              prev[1] = nextPos;
              const pos = R.update(idx, prev, color);
              setColor(pos);
            }}
            bounds={{ top: 0, left: 0, right: 178, bottom: 0 }}
          >
            <div className={styles.itemWrapper}>
              <div className={styles.arrayTop} style={{ borderBottomColor: color[idx][0] }} />
              <ColorItem
                value={item[0]}
                onVisibleChange={setShow}
                disabled={disabled}
                onChange={(e) => {
                  const prev = R.nth(idx, color);
                  prev[0] = e;
                  const nextColor = R.update(idx, prev, color);
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

export const PureColor = ({
  value = '',
  disabled = false,
  onChange,
  position = 'top',
  // noAnimation = true,
}) => {
  const val = value.replace(/([a-zA-Z]|\(|\))/g, '').split(',');

  return (
    <div className={styles.colorItem}>
      <div className={styles.colorPanel} style={{ backgroundColor: value }}>
        <div className={styles.rectPop} style={{ top: position === 'bottom' ? 36 : -115 }}>
          {paletteList.map(({ color: backgroundColor, title }) => (
            <span
              style={{ backgroundColor }}
              key={backgroundColor}
              title={title}
              onClick={() => {
                onChange(backgroundColor.replace(')', ',1)').replace('rgb', 'rgba'));
              }}
            />
          ))}
        </div>
      </div>
      <ColorPicker
        color={rgb2hex(value).slice(0, 7)}
        alpha={val.length === 4 ? Number(val[3]) * 100 : 100}
        onMouseUp={(e) => {
          const color = hex2rgb(e.color);
          onChange(`rgba(${color},${e.alpha / 100})`);
        }}
        placement="bottomRight"
        disabled={disabled}
      >
        <div className={styles.head} style={{ backgroundColor: value }}>
          {colorLib.getColorName(value).title}
          <img
            style={{ width: 30, height: 30, marginLeft: 10 }}
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAMAAABg3Am1AAABO1BMVEVHcExjsb/uTqzhymrlZp7Rjox7w57FwYJNm+aw6VX+m0/6Soe611x2urJkoNbks2r0aG2Du6v/MJhIm+r/MZj/MZj/QWj/c03+m1D/TlCSxZTktWH7zFSg3XBxr7y/u4A7kvo5lPn/Kqz/N4Rnodb/gk3+sU//dE7/0VL/J8X/Jb6FyZJ6psNaqs2z61LAzmP6Mb/Sl4Lgd5OXsar9pFBImez/S01vua//OX7+jk7+Ykz+bkz/LaH/V0z5ML3/QGn/JMH+eU3/L5z/Rlj/PXOR04Cyu5P9uU/+g03/JrhZqs2j4GeFyo+Cqrz8y1L20Fe35lM8lfX/M43/KK//QmBvpMtRo9qRsK70P7TBymLXj4bLrHX9w1DUxnWitqHcf4/tz2DQnX7+OYeb2nPgdJXGumzsV6H5sVH/MZea7IfDAAAANHRSTlMA/fz9/iH9/v/+/jr9Nv02VFTz2dmB0MPZ7IGB0Mv9w76Bvr7Zgb7YVFTYx77H2dnH2MfYBQ7XUQAAAelJREFUSMft1VlbgkAUBuBUlCnFpX192ve9RNxAU3Oh0BYETcUlxf7/L+gMWHoxqPf1eXveM2eAGWdm/vN3417aX5yfX9xbck9V7l/OhMNvb6n4+3vh7HRiuXNZTvyCZFK4cU6YZk2WE4kRINjHzuUOhdLpBCzRwaAAoGIfJ5xrGMBMmR9Qqdh1ynqqlSjPA8G76KTihYIAC1BU987y+URNkB4COwZNvwU4jsVMIsvhMAAYSIfyj49bcr3vIWYIPFTGBNC/CaDtI4LD/AMEDB+Cob7igqDj8natVtsgbzmfzxsAhAEqVBe6A+htE8FqBGKiaCj9ldIp3L3Xq1ar10QwFzEDJMbzHb3bbJvlVY+HCIJz+DdIEKo8Lz+ZJY8UHEnf8zQ7zBURHPX7/RykXi+WGnRZ5FyPj5+fTzhbRLCRG5QXSy06qyAb9/w8IOvkF1c3ikstR4PWVIQUkTMIIIb8qjeLRQwcDppWJcQqCse5XJhsWXxLJ9C95YD+WU0CgJBoM0nA6nPdxKBB05omlRHLIlE0wLn1AcLt6WxWVcsYsIpow2uMOda+xgh4hV1gwIw71D4o1zRVKnsBvMKDEm3MhGtmG4A0BJfOiTdT4F6VJK+XBcAuBKa6+5j1iwMvWtjZZf7/Nv5wvgHGFpB5+rlLRwAAAABJRU5ErkJggg=="
          />
        </div>
      </ColorPicker>
    </div>
  );
};

export default ({ value, onChange, disabled = false }) => {
  const [tab, setTab] = useState(getTabIdx(value));
  return (
    <div className={styles.fields}>
      <Radio.Group
        size="middle"
        value={tab}
        onChange={(e) => {
          const val = e.target.value;
          setTab(val);
          if (val === 0) {
            onChange('transparent');
          }
        }}
        disabled={disabled}
      >
        <Radio.Button value="0">透明</Radio.Button>
        <Radio.Button value="1">纯色</Radio.Button>
        <Radio.Button value="2">渐变</Radio.Button>
      </Radio.Group>
      {tab === EColorType.COLOR && (
        <PureColor disabled={disabled} value={value} onChange={onChange} />
      )}
      {tab === EColorType.GARDIENT && (
        <GardientPicker disabled={disabled} value={value} onChange={onChange} />
      )}
    </div>
  );
};
