import React from 'react';
import styles from './index.less';
import Field from '@/component/field';
import { IPage } from '@/models/common';
import { Dispatch } from 'redux';

interface IPageProps {
  page: IPage;
  setHide: () => void;
  dispatch: Dispatch;
}
export default ({ page, setHide, dispatch }: IPageProps) => {
  // 更新配置
  const updatePage = page => {
    dispatch({
      type: 'common/updatePage',
      payload: {
        page,
      },
    });
  };

  return (
    <>
      <div className={styles.head}>页面设置</div>
      <div className={styles.body}>
        <div className={styles.pageconfig}>
          <div className={styles['datav-gui']}>
            <Field title="屏幕大小">
              <div className="alignRow">
                <input
                  type="number"
                  step="2"
                  style={{ marginRight: 10 }}
                  defaultValue={page.width}
                  onChange={e => {
                    updatePage({
                      width: e.target.value,
                    });
                  }}
                />
                <input
                  type="number"
                  step="2"
                  defaultValue={page.height}
                  onChange={e => {
                    updatePage({
                      height: e.target.value,
                    });
                  }}
                />
              </div>
            </Field>
          </div>
        </div>
      </div>
      <div className={styles.bottom} onClick={setHide}>
        确定
      </div>
    </>
  );
};
