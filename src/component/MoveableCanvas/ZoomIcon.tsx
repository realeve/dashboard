import React from 'react';
import styles from './zoom.less';
import { ZoomInOutlined, ZoomOutOutlined, AimOutlined } from '@ant-design/icons';
import classnames from 'classnames';
import { Tooltip, Slider } from 'antd';

export const config = [
  {
    pos: 0,
    zoom: 10,
  },
  {
    pos: 10,
    zoom: 5,
  },
  {
    pos: 20,
    zoom: 2,
  },
  {
    pos: 30,
    zoom: 1.5,
  },
  {
    pos: 40,
    zoom: 1.25,
  },
  {
    pos: 50,
    zoom: 1,
  },
  {
    pos: 60,
    zoom: 0.8,
  },
  {
    pos: 70,
    zoom: 0.6,
  },
  {
    pos: 80,
    zoom: 0.4,
  },
  {
    pos: 90,
    zoom: 0.2,
  },
];

export default ({ onHover, onRestore, level, setLevel }) => {
  const increase = () => setLevel(Math.max(level - 1, 0)),
    decrease = () => setLevel(Math.min(level + 1, config.length - 1));

  return (
    <div
      className={classnames(styles.zoom)}
      onMouseEnter={() => {
        onHover?.(true);
      }}
      onMouseLeave={() => {
        onHover?.(false);
      }}
    >
      <div className={styles.zoomContainer}>
        <ZoomInOutlined style={{ marginBottom: 5 }} onClick={increase} />
        <Slider
          vertical
          style={{ height: 90, marginBottom: 0 }}
          reverse
          value={level}
          onChange={setLevel}
          max={9}
          min={0}
          step={1}
          marks={{
            5: '',
          }}
          tipFormatter={(v) => config[v].zoom}
        />
        <ZoomOutOutlined onClick={decrease} style={{ marginTop: 5 }} />
        <Tooltip title="还原" placement="right">
          <AimOutlined
            onClick={() => {
              setLevel(5);
              onRestore?.();
            }}
          />
        </Tooltip>
      </div>
    </div>
  );
};
