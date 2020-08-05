import React, { useEffect, useState } from 'react';
import styles from './EditSlider.less';
import classnames from 'classnames';

import ToolMenu from './ToolMenu';

export default ({ editor }) => {
  return <div className={styles['edit-slider']}>{editor && <ToolMenu editor={editor} />}</div>;
};
