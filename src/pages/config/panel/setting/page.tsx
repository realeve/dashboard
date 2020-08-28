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
import ColorPicker, { PureColor } from '@/component/field/ColorPicker';
import Radio from '@/component/field/Radio';
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

// 组件的通用样式设置
export const ComponentConfig = ({ border, chartBackground, head, onChange: updatePage }) => (
  <>
    <Divider plain>组件</Divider>
    <ImgSelector
      title="边框"
      value={border}
      type="borders"
      onChange={border => {
        updatePage({
          border,
        });
      }}
    />
    <Field title="背景" style={{ padding: 10 }}>
      <ColorPicker
        value={chartBackground}
        onChange={chartBackground => {
          updatePage({
            chartBackground,
          });
        }}
      />
    </Field>
    <Divider plain>标题</Divider>
    <Field title="字号">
      <input
        type="number"
        step="1"
        defaultValue={head.fontSize}
        onChange={e => {
          updatePage({
            head: { ...head, fontSize: Number(e.target.value) },
          });
        }}
      />
    </Field>

    <Field title="文字颜色">
      <PureColor
        value={head.color}
        onChange={color => {
          updatePage({
            head: { ...head, color },
          });
        }}
      />
    </Field>

    <Field title="边距">
      <input
        type="number"
        step="1"
        defaultValue={head.padding}
        onChange={e => {
          updatePage({
            head: { ...head, padding: Number(e.target.value) },
          });
        }}
      />
    </Field>
    <Field title="对齐">
      <Radio
        value={head.textAlign}
        onChange={textAlign => {
          updatePage({
            head: { ...head, textAlign },
          });
        }}
        config={[
          {
            title: '居左',
            value: 'left',
          },
          {
            title: '居中',
            value: 'center',
          },
          {
            title: '居右',
            value: 'right',
          },
        ]}
      />
    </Field>
    <Field title="背景色">
      <ColorPicker
        value={head.background}
        onChange={background => {
          updatePage({
            head: { ...head, background },
          });
        }}
      />
    </Field>
  </>
);

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
            <ComponentConfig
              onChange={updatePage}
              border={page.border}
              chartBackground={page.chartBackground}
              head={page.head}
            />
          </div>
        </div>
      </div>
      <div className={styles.bottom} onClick={setHide}>
        确定
      </div>
    </>
  );
};
