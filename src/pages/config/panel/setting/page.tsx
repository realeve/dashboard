import React from 'react';
import styles from './index.less'; 
import Field from '@/component/field';

export default (props) => {
  return (
    <>
      <div className={styles.head}>页面设置</div>
      <div className={styles.body}>
        <div className={styles.pageconfig}>
          <div className={styles['datav-gui']}>
            <Field title="屏幕大小">
              <div className="alignRow">
                <input type="number" step="2" style={{ marginRight: 10 }} defaultValue={1920} />
                <input type="text" defaultValue={1080} />
              </div>
            </Field>
          </div>
        </div>
      </div>
      <div className={styles.bottom} onClick={props.setHide}>确定</div>
    </>
  );
};
