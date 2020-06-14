import React from 'react';
import styles from './setting.less';
import classnames from 'classnames';
import Field from '@/component/field';

export default ({ setHide, hide, ...props }) => {
  return (
    <div
      className={classnames(styles['config-panel-wp'], {
        [styles.hide]: hide.config,
      })}
    >
      <div className={styles.head}>页面设置</div>
      <div className={styles.body}>
        <div className={styles.pageconfig}>
          <div className={styles['datav-gui']}>
            <Field title="屏幕大小">
              <div className="alignRow">
                <input type="number" step="2" style={{ marginRight: 10 }} value={1920} />
                <input type="text" value={1080} />
              </div>
            </Field>
          </div>
        </div>
      </div>
    </div>
  );
};
