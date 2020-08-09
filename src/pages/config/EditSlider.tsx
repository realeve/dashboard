import React, { useEffect, useState } from 'react';
import styles from './EditSlider.less';
import classnames from 'classnames';

import ToolMenu from './ToolMenu';

export const InputRange = props => {
  const percent = props.value / props.max;
  return (
    <input
      type="range"
      className={styles['input-range']}
      {...props}
      style={{
        background: `linear-gradient(to right, rgb(0, 251, 255), rgb(0, 176, 255) ${percent}%, rgb(38, 42, 53) ${percent *
          100}%, rgb(38, 42, 53))`,
      }}
    />
  );
};

export default ({ editor, onMenuChange, curTool, zoom, onZoom }) => {
  const rangeCfg = { min: 0.3, max: 1.5, step: 0.1 };
  return (
    <div className={styles['edit-slider']}>
      {editor && <ToolMenu curTool={curTool} editor={editor} onSelect={onMenuChange} />}
      <div className={styles['datav-slider']}>
        <i
          className="datav-icon datav-font icon-zoom-out slider-icon zoom-out "
          onClick={e => {
            let nextVal = Math.max(rangeCfg.min, zoom - 0.1);
            nextVal = Number(nextVal.toFixed(1));
            onZoom(nextVal);
          }}
        />
        <InputRange
          {...rangeCfg}
          value={zoom}
          onChange={e => {
            onZoom(Number(e.target.value));
          }}
        />
        <i
          className="datav-icon datav-font icon-zoom-in slider-icon zoom-in"
          onClick={e => {
            let nextVal = Math.min(rangeCfg.max, zoom + 0.1);
            nextVal = Number(nextVal.toFixed(1));
            onZoom(nextVal);
          }}
        />
      </div>
    </div>
  );
};
