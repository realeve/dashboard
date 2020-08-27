import React, { useState } from 'react';
import styles from './index.less';
import Field from '@/component/field';
import { IPage } from '@/models/common';
import { Dispatch } from 'redux';
import assets from '@/component/widget/assets';
import { SettingOutlined } from '@ant-design/icons';
import Popup from '@/component/Editor/Popup/Popup';
import { AssetItem } from '@/component/widget/blank/config';
import { Divider } from 'antd';
import ColorPicker from '@/component/field/ColorPicker';

const ImgSelector = ({
  title,
  type = 'backgrounds',
  value,
  onChange,
  style = {},
}: {
  title: string;
  type: 'backgrounds' | 'borders';
  value: string;
  onChange: (e: string) => void;
  style?: React.CSSProperties;
}) => {
  const [show, setShow] = useState(false);
  return (
    <Field title={title} style={{ ...style, height: 100 }}>
      <img
        className={styles.img}
        src={assets[type][value].url}
        onClick={() => {
          setShow(!show);
        }}
      />
      {show && (
        <Popup
          onClose={() => {
            setShow(false);
          }}
        >
          <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
            <SettingOutlined /> 设置{title}
          </div>
          <AssetItem
            assetKey={type}
            style={{ overflowY: 'auto', height: 'calc(100% - 30px)' }}
            value={value}
            onChange={onChange}
          />
        </Popup>
      )}
    </Field>
  );
};

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
            <ImgSelector
              title="背景"
              value={page.background}
              type="backgrounds"
              onChange={background => {
                updatePage({
                  background,
                });
              }}
            />
            <Divider plain>组件通用设置</Divider>
            <ImgSelector
              title="边框"
              value={page.border}
              type="borders"
              onChange={border => {
                updatePage({
                  border,
                });
              }}
            />
            <Field title="标题文字大小">
              <input
                type="number"
                step="1"
                defaultValue={page.head.fontSize}
                onChange={e => {
                  updatePage({
                    head: { ...page.head, fontSize: e.target.value },
                  });
                }}
              />
            </Field>
            <Field title="标题背景色">
              <ColorPicker
                value={'#0F0'}
                onChange={background => {
                  updatePage({
                    head: { ...page.head, background },
                  });
                }}
              />
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
