import React, { useEffect, useState } from 'react';
import styles from './EditSlider.less';
import classnames from 'classnames';

import ToolMenu from './ToolMenu';

export default ({ editor, onMenuChange }) => {
  return (
    <div className={styles['edit-slider']}>
      {editor && <ToolMenu editor={editor} onSelect={onMenuChange} />}
    </div>
  );
};
