import styles from './EditSlider.less';
import ToolMenu from './ToolMenu';
import InputRange from '@/component/field/InputRange';
import classnames from 'classnames';

import { rangeCfg } from '@/component/Editor/Editor';

export default ({
  editor,
  onMenuChange,
  curTool,
  zoom,
  onZoom,
  onToggleThumb,
  hide,
  showConfig = true,
}) => {
  return (
    <div
      className={classnames(styles['edit-slider'], {
        [styles['toolbox-hide']]: hide,
      })}
      style={showConfig ? { width: 'calc(100% - 332px)' } : {}}
    >
      {editor && <ToolMenu curTool={curTool} editor={editor} onSelect={onMenuChange} />}

      <InputRange
        {...rangeCfg}
        value={zoom}
        onChange={onZoom}
        formatter={(value) => (
          <span style={{ color: '#bcc9d4', width: 50, fontSize: 12, textAlign: 'right' }}>
            {Math.floor(value * 100)} %
          </span>
        )}
      />
      <div className={styles['toggle-thumbnail']} onClick={onToggleThumb}>
        <i className="datav-icon datav-font icon-viewport" />
      </div>
    </div>
  );
};
