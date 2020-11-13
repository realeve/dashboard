import React from 'react';
import styles from './EditSlider.less';
import ToolMenu from './ToolMenu';
import InputRange from '@/component/field/InputRange';
export const rangeCfg = { min: 0.3, max: 1.5, step: 0.1 };

export default ({ editor, onMenuChange, curTool, zoom, onZoom, onToggleThumb }) => {
  return (
    <div className={styles['edit-slider']}>
      {editor && <ToolMenu curTool={curTool} editor={editor} onSelect={onMenuChange} />}
      <span style={{ color: '#bcc9d4', width: 35, fontSize: 12, textAlign: 'right' }}>
        {Math.floor(zoom * 100)} %
      </span>
      <InputRange {...rangeCfg} value={zoom} onChange={onZoom} showValue={false} />
      <div className={styles['toggle-thumbnail']} onClick={onToggleThumb}>
        <i className="datav-icon datav-font icon-viewport" />
      </div>
    </div>
  );
};
