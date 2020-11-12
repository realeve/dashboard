import React from 'react';
import styles from './index.less';
import classnames from 'classnames';

export { ImgSelector } from '@/pages/config/panel/setting/page';

export default ({ title = null, children = null, style = {}, titleWidth = 100 }) => {
  return (
    <div className={styles.field} style={style}>
      {title && (
        <div title={title} className={styles.title} style={{ width: titleWidth }}>
          {title}
        </div>
      )}
      <div className={classnames(styles.container, { [styles.notitle]: !title })}>
        <div className={styles.component}>{children}</div>
      </div>
    </div>
  );
};
