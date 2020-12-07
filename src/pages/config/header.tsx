import React, { useState } from 'react';
import styles from './header.less';
import classnames from 'classnames';
import { Tooltip } from 'antd';
import { IHideProps, TFnHide } from './panel/setting';
import { router } from 'umi';
import { getLocalConfig } from '@/pages/index/lib';
import * as lib from '@/utils/lib';
import beautify from 'js-beautify';
import { saveAs } from 'file-saver';
import { Confirm } from '@/component/Editor/Popup/Popup';
import { api } from '@/utils/setting';

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

const saveBat = (title) => {
  let str = `@echo on
rem 拷贝文件
copy .\\${title}.* ${api.deployDir}
rem 打开网站
start ${window.location.origin}?id=/data/${title}.json&autoresize=movie
rem 移除本地文件
del .\\${title}.*
del .\\${title}_部署脚本.bat
pause`;
  let blob = new Blob([str], { type: 'text/plain;charset=windows-1252' });
  saveAs(blob, title + '_部署脚本.bat');
};

export default ({
  setHide,
  hide,
  title = '默认工作空间',
  author = '未知作者',
  getThumbnail,
}: {
  hide: IHideProps;
  setHide: TFnHide;
  title: string;
  author: string;
  getThumbnail: (scale: number, filename: string | null) => Promise<string | void>;
}) => {
  const [show, setShow] = useState(false);
  const onSave = async () => {
    let props = await getLocalConfig();
    if (!props) {
      return;
    }

    let { page, panel } = props;
    // 面板文件,用于在面板列表中显示
    // 可考虑将此处的图片下载为同名文件.png，与json文件一并保存，以实现图片和json配置信息分离
    getThumbnail(0.2, title);

    let dashboard = {
      rec_time: lib.now(),
      panel,
      page: {
        ...page,
        thumbnail: `./${title}.jpg`,
      },
    };

    let json = beautify(JSON.stringify(dashboard), beautyOption);
    let blob = new Blob([json], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, title + '.json');
    setShow(true);

    saveBat(title);
  };

  // todo 增加批处理文件的生成

  return (
    <div className={styles.header}>
      {show && (
        <Confirm
          title="仪表盘配置文件保存成功"
          style={{ width: 400, minHeight: 230, height: 'auto' }}
          onCancel={() => {
            setShow(false);
          }}
          onOk={() => {
            setShow(false);
          }}
        >
          <div style={{ height: 200, paddingTop: 20 }}>
            <p>请按以下步骤完成剩余操作：</p>
            <p>
              1.将下载后的json和缩略图文件(路径:%userprofile%/downloads/)上传到服务器的 /data/
              目录下;
            </p>
            <p>
              2.
              <a
                href={`${window.location.origin}?id=/data/${title}.json&autoresize=movie`}
                target="_blank"
              >
                浏览这个链接查看线上版本
              </a>
            </p>
          </div>
        </Confirm>
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
          <span className="v-md">
            {title}-({author})
          </span>
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
