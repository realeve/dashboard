import React, { useState } from 'react';
import { Confirm } from '@/component/Editor/Popup/Popup';
import JsonLoader from '@/component/JsonLoader';
import type { IPanelConfig, IPage } from '@/models/common';
import styles from './index.less';
import { onCopy, onPreview, saveBat } from './lib';

import { addDashboardList } from '@/pages/config/panel/business/db';
import classnames from 'classnames';
import { Tooltip, message } from 'antd';
import { useDispatch } from 'dva';

export type FnOnLoadConfig = ({ page, panel }: { page: IPage; panel: IPanelConfig[] }) => void;

const Actions = ({
  onLoadConfig,
  fileTitle,
  getThumbnail,
  isEditMode = false,
  title,
}: {
  onLoadConfig: FnOnLoadConfig;
  title: string;
  fileTitle: string;
  getThumbnail: (scale: number, filename: string | null) => Promise<string | void>;
  isEditMode?: boolean;
}) => {
  const dispatch = useDispatch();
  const [loadPanel, setLoadPanel] = useState(false);
  const [show, setShow] = useState(false);
  const [clear, setClear] = useState(false);

  const onSave = async () => {
    setShow(true);

    await onCopy(fileTitle);
    // 面板文件,用于在面板列表中显示
    // 可考虑将此处的图片下载为同名文件.png，与json文件一并保存，以实现图片和json配置信息分离
    getThumbnail(0.2, fileTitle);

    saveBat(fileTitle);
    let success = true;

    // 非编辑模式下，向服务端写入数据；
    // 否则 按原文件名替换文件
    if (!isEditMode) {
      // 向大屏中添加列表项

      // jpg to webp

      success = await addDashboardList({
        title,
        file: `${fileTitle}.json`,
        img: `${fileTitle}.webp`,
      });
    } else {
      message.success('请执行批处理文件并替换服务端现有配置文件以更新内容');
    }
    message[success ? 'success' : 'error'](`添加组件${success ? '成功' : '失败'}`);
  };

  return (
    <>
      {clear && (
        <Confirm
          title="清空画板"
          style={{ width: 400, minHeight: 230, height: 'auto' }}
          onCancel={() => {
            setClear(false);
          }}
          onOk={() => {
            dispatch({
              type: 'common/clearPage',
            });
            setClear(false);
          }}
        >
          <div style={{ paddingTop: 20 }}>确定清空当前画板？该操作不可恢复。</div>
        </Confirm>
      )}
      {loadPanel && (
        <Confirm
          title="载入配置文件"
          style={{ width: 400, minHeight: 230, height: 'auto' }}
          onCancel={() => {
            setLoadPanel(false);
          }}
          okText={
            <JsonLoader
              onLoad={(e) => {
                onLoadConfig(e);
                setLoadPanel(false);
              }}
            >
              继续载入文件
            </JsonLoader>
          }
        >
          当前的配置尚未保存，载入后当前设置将全部丢失，确定要继续载入配置文件？
        </Confirm>
      )}
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
      <div className={styles['global-actions']}>
        <Tooltip title="清空画板" placement="bottom">
          <div
            className={classnames(styles['header-button'], styles.ml4)}
            onClick={() => setClear(true)}
          >
            <i className="datav-icon datav-font icon-empty-canvas header-button-icon" />
          </div>
        </Tooltip>
        <Tooltip title="手工载入配置" placement="bottom">
          <div
            className={classnames(styles['header-button'], styles.ml4)}
            onClick={() => setLoadPanel(true)}
          >
            <i className="datav-icon datav-font icon-upload header-button-icon" />
          </div>
        </Tooltip>
        <Tooltip title="下载到本地" placement="bottom">
          <div
            className={classnames(styles['header-button'], styles.ml4)}
            onClick={() => onCopy(title)}
          >
            <i className="datav-icon datav-font icon-local-deploy header-button-icon" />
          </div>
        </Tooltip>
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
    </>
  );
};

export default Actions;
