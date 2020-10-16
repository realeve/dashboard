import React from 'react';
import styles from './EditSlider.less';
import ToolMenu from './ToolMenu';
import InputRange from '@/component/field/InputRange';
export const rangeCfg = { min: 0.3, max: 1.5, step: 0.1 };

export default ({ editor, onMenuChange, curTool, zoom, onZoom, onToggleThumb }) => {
  return (
    <div className={styles['edit-slider']}>
      {editor && <ToolMenu curTool={curTool} editor={editor} onSelect={onMenuChange} />}
      <div className={styles['datav-slider']}>
        <span style={{ color: '#bcc9d4', width: 35, fontSize: 12, textAlign: 'right' }}>
          {Math.floor(zoom * 100)} %
        </span>
        <i
          className="datav-icon datav-font icon-zoom-out slider-icon zoom-out "
          onClick={e => {
            let nextVal = Math.max(rangeCfg.min, zoom - 0.1);
            nextVal = Number(nextVal.toFixed(1));
            onZoom(nextVal);
          }}
        />
        <InputRange {...rangeCfg} value={zoom} onChange={onZoom} showValue={false} />
        <i
          className="datav-icon datav-font icon-zoom-in slider-icon zoom-in"
          onClick={e => {
            let nextVal = Math.min(rangeCfg.max, zoom + 0.1);
            nextVal = Number(nextVal.toFixed(1));
            onZoom(nextVal);
          }}
        />
      </div>
      <div className={styles['toggle-thumbnail']} onClick={onToggleThumb}>
        <i className="datav-icon datav-font icon-viewport" />
      </div>
    </div>
  );
};
