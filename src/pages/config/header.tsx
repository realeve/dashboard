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
import { addDashboardList } from '@/pages/config/panel/business/db';
import qs from 'querystring';
import pinyin from '@/utils/pinyin.js';
import { message } from 'antd';

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

// 此处保存完毕后为utf-8格式编码，需要转换为ANSI(结论：暂时无解)
const saveBat = (title) => {
  let str = `@echo on
rem move file
copy .\\${title}.* ${api.deployDir}
rem open website
start ${window.location.origin}?id=/data/${title}.json&autoresize=movie
rem remove temp files
del .\\${title}.*
del .\\${title}_deploy.bat
pause`;

  let blob = new Blob([str], { type: 'text/plain;charset=ansi' });
  saveAs(blob, title + '_deploy.bat');
};

export default ({
  setHide,
  hide,
  title: _title = '默认工作空间',
  author = '未知作者',
  getThumbnail,
}: {
  hide: IHideProps;
  setHide: TFnHide;
  title: string;
  author: string;
  getThumbnail: (scale: number, filename: string | null) => Promise<string | void>;
}) => {
  let query: { file?: string; id?: string } = qs.parse(window.location.search.slice(1));
  let title = query.file
    ? query.file.replace('.json', '').split('/').slice(-1)[0]
    : pinyin.toPinYinFull(_title);

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
    let success = true;

    // 非编辑模式下，向服务端写入数据；
    // 否则 按原文件名替换文件
    if (!query.file) {
      // 向大屏中添加列表项
      success = await addDashboardList({
        title: _title,
        file: title + '.json',
        img: title + '.jpg',
      });
    } else {
      message.success('请执行批处理文件并替换服务端现有配置文件以更新内容');
    }
    message[success ? 'success' : 'error'](`添加组件${success ? '成功' : '失败'}`);
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
            <p>1.如果弹出批处理文件是否保存，请点确定；</p>
            <p>
              2.下载完毕后进入下载目录，运行{title}
              _deploy.bat文件，系统将自动把配置文件上传到服务器对应的目录下;
            </p>
            <p>3.运行完毕后，系统将自动打开链接；</p>
            <p>
              4.
              <a
                href={`${window.location.origin}?id=/data/${title}.json&autoresize=movie`}
                target="_blank"
              >
                手动浏览这个链接查看线上版本
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
            <Tooltip title="历史记录" placement="bottom">
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
