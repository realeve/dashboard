import React from 'react';
import styles from './components.less';
import classnames from 'classnames';

export default ({ setHide, hide, ...props }) => {
  return (
    <div
      className={classnames(styles['component-panel-wp'], {
        [styles.hide]: hide.components,
        [styles.shrink]: !hide.beauty,
      })}
    >
      <div className={styles['component-panel']}>
        <div className={styles.panelTitle}>
          <span>
            组件列表
            <i
              className={classnames(styles.refreshBtn, 'datav-icon datav-font icon-refresh')}
              title="刷新"
            />
          </span>
          <i
            className={classnames('datav-icon datav-font icon-back', styles.closeBtn)}
            onClick={() => {
              setHide({
                components: !hide.components,
              });
            }}
          />
        </div>
        <div className={styles['component-panel-wrapper']}>
          <div className={styles['datav-tabs']}>
            <div className={styles.nav}>
              <div className={styles.wp}>
                <div className={styles.tab}>
                  <i className="com-font  icon-com-regular" />
                </div>
                <div className={classnames(styles.tab, styles.tabActived)}>
                  <i className="com-font  icon-com-map icon-active" />
                </div>
                <div className={styles.tab}>
                  <i className="com-font  icon-com-media" />
                </div>
                <div className={styles.tab}>
                  <i className="com-font  icon-com-text" />
                </div>
                <div className={styles.tab}>
                  <i className="com-font  icon-com-network" />
                </div>
                <div className={styles.tab}>
                  <i className="com-font  icon-com-material" />
                </div>
                <div className={styles.tab}>
                  <i className="com-font  icon-com-interact" />
                </div>
                <div className={styles.tab}>
                  <i className="com-font  icon-com-decorate" />
                </div>
                <div className={styles.tab}>
                  <i className="com-font  icon-com-favorite" />
                </div>
              </div>
            </div>
            <div className={styles.content}>d</div>
          </div>
        </div>
      </div>
    </div>
  );
};
