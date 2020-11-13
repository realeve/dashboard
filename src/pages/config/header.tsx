import React, { useState } from 'react';
import styles from './header.less';
import classnames from 'classnames';
import { Tooltip, Button } from 'antd';
import { IHideProps, TFnHide } from './panel/setting';
import { router } from 'umi';
import { getLocalConfig } from '@/pages/index/lib';
import * as lib from '@/utils/lib';
import beautify from 'js-beautify';
import { saveAs } from 'file-saver';
import Popup, { PopupFooter } from '@/component/Editor/Popup/Popup';

const beautyOption = {
  indent_size: 2,
  wrap_line_length: 80,
  jslint_happy: true,
};

const onPreview = async () => {
  let props = await getLocalConfig();
  if (!props) {
    return;
  }
  router.push('/');
};

export default ({ setHide, hide }: { hide: IHideProps; setHide: TFnHide }) => {
  const [show, setShow] = useState(false);
  const onSave = async () => {
    let props = await getLocalConfig();
    if (!props) {
      return;
    }
    let { page, panel } = props;
    // 面板文件
    let dashboard = { page, panel, rec_time: lib.now() };
    let json = beautify(JSON.stringify(dashboard), beautyOption);
    let blob = new Blob([json], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, '主题面板.json');
    setShow(true);
  };

  return (
    <div className={styles.header}>
      {show && (
        <Popup
          style={{ width: 400, minHeight: 230, height: 'auto' }}
          onClose={() => {
            setShow(false);
          }}
        >
          <h2>仪表盘配置文件保存成功</h2>
          <div style={{ height: 200, paddingTop: 20 }}>
            <p>请按以下步骤完成剩余操作：</p>
            <p>1.将下载后的json文件上传到服务器的 /data/ 目录下;</p>
            <p>2.浏览 {window.location.origin}?id=/data/仪表盘文件.json&autoresize=movie</p>
          </div>
          <PopupFooter align="center">
            <Button
              type="primary"
              style={{ width: 200, height: 40 }}
              onClick={() => {
                setShow(false);
              }}
            >
              确定
            </Button>
          </PopupFooter>
        </Popup>
      )}
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
            <div className={classnames(styles['header-button'], styles.ml4)} onClick={onSave}>
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
