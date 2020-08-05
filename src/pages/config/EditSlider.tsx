import React, { useEffect, useState } from 'react';
import styles from './EditSlider.less';
import classnames from 'classnames';

import ToolMenu from './ToolMenu';

export default ({ editor, onMenuChange,curTool }) => {
  return (
    <div className={styles['edit-slider']}>
      {editor && <ToolMenu curTool={curTool} editor={editor} onSelect={onMenuChange} />}
    </div>
  );
};
