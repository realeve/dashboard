import React from 'react';
import styles from './header.less';
import classnames from 'classnames';

import { IHideProps, TFnHide } from './panel/setting';

export default ({ setHide, hide }: { hide: IHideProps; setHide: TFnHide }) => {
  return (
    <div className={styles.header}>
      <div className={styles['datav-edit-header']}>
        <div className={styles['editor-header-wp']}>
          <div className={styles['editor-config']}>
            <div
              className={classnames(styles['header-button'], {
                [styles.selected]: !hide.layer,
              })}
              onClick={() => {
                setHide({ layer: !hide.layer });
              }}
            >
              <i className="datav-icon datav-font icon-layer header-button-icon" />
            </div>
            <div
              className={classnames(
                styles['header-button'],
                {
                  [styles.selected]: !hide.components,
                },
                'component-list-btn',
              )}
              onClick={() => {
                setHide({ components: !hide.components });
              }}
            >
              <i className="datav-icon datav-font icon-component-list header-button-icon" />
            </div>
            <div
              className={classnames(styles['header-button'], {
                [styles.selected]: !hide.config,
              })}
              onClick={() => {
                setHide({ config: !hide.config });
              }}
            >
              <i className="datav-icon datav-font icon-right-panel header-button-icon" />
            </div>
            <div
              className={classnames(styles['header-button'], {
                [styles.selected]: !hide.toolbox,
              })}
              onClick={() => {
                setHide({ toolbox: !hide.toolbox });
              }}
            >
              <i className="datav-icon datav-font icon-tool header-button-icon" />
            </div>
          </div>
          <div className={styles['drawer-actions']}>
            <div
              className={classnames(styles['header-button'], styles.ml4, {
                [styles.selected]: !hide.filter,
              })}
              onClick={() => {
                setHide({ filter: !hide.filter });
              }}
            >
              <i className="datav-icon datav-font icon-filter header-button-icon" />
            </div>
            <div
              className={classnames(styles['header-button'], styles.ml4, {
                [styles.selected]: !hide.beauty,
              })}
              onClick={() => {
                setHide({ beauty: !hide.beauty });
              }}
            >
              <i className="datav-icon datav-font icon-beauttification header-button-icon" />
            </div>
          </div>
        </div>
        <div className={styles['screen-info']}>
          <i
            className={classnames('datav-icon datav-font icon-workspace', styles['workspace-icon'])}
          />
          <span className="v-md">默认工作空间</span>
        </div>
        <div className={styles['global-actions']}>
          <div className={classnames(styles['header-button'], styles.ml4)} title="发布">
            <i className="datav-icon datav-font icon-publish header-button-icon" />
          </div>
          <div className={classnames(styles['header-button'], styles.ml4)} title="预览">
            <i className="datav-icon datav-font icon-preview header-button-icon" />
          </div>
        </div>
      </div>
    </div>
  );
};
