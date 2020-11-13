import React from 'react';
import styles from './header.less';
import classnames from 'classnames';
import { message, Tooltip } from 'antd';
import { IHideProps, TFnHide } from './panel/setting';
import { router } from 'umi';
import { getLocalConfig } from '@/pages/index/lib';

const onPreview = async () => {
  let { type } = await getLocalConfig();
  if (type === 'error') {
    message.error('当前页面未配置任何组件，预览失败');
    return;
  }
  router.push('/');
};

export default ({ setHide, hide }: { hide: IHideProps; setHide: TFnHide }) => {
  return (
    <div className={styles.header}>
      <div className={styles['datav-edit-header']}>
        <div className={styles['editor-header-wp']}>
          <div className={styles['editor-config']}>
            <Tooltip title="图层" placement="bottom">
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
            </Tooltip>

            <Tooltip title="组件" placement="bottom">
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
            </Tooltip>

            <Tooltip title="设置" placement="bottom">
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
            </Tooltip>

            <Tooltip title="工具" placement="bottom">
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
            </Tooltip>
          </div>
          <div className={styles['drawer-actions']}>
            <Tooltip title="过滤器" placement="bottom">
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
            </Tooltip>
          </div>
        </div>
        <div className={styles['screen-info']}>
          <i
            className={classnames('datav-icon datav-font icon-workspace', styles['workspace-icon'])}
          />
          <span className="v-md">默认工作空间</span>
        </div>
        <div className={styles['global-actions']}>
          <Tooltip title="发布" placement="bottom">
            <div className={classnames(styles['header-button'], styles.ml4)}>
              <i className="datav-icon datav-font icon-publish header-button-icon" />
            </div>
          </Tooltip>
          <Tooltip title="预览" placement="bottom">
            <div className={classnames(styles['header-button'], styles.ml4)} onClick={onPreview}>
              <i className="datav-icon datav-font icon-preview header-button-icon" />
            </div>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
