import React, { useState } from 'react';
import styles from './index.less';
import Field from '@/component/field';
import { IPage, ICommonConfig } from '@/models/common';
import { Dispatch } from 'redux';
import assets from '@/component/widget/assets';
import { SettingOutlined } from '@ant-design/icons';
import Popup from '@/component/Editor/Popup/Popup';
import { AssetItem } from '@/component/widget/blank/config';
import { Divider } from 'antd';
import ColorPicker, { PureColor } from '@/component/field/ColorPicker';
import Radio from '@/component/field/Radio';

import { AlignLeftOutlined, AlignCenterOutlined, AlignRightOutlined } from '@ant-design/icons';

import { AlignCenterIcon, AlignRightIcon, AlignLeftIcon } from './icon';

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
export interface IComponentConfig extends ICommonConfig {
  showTitle?: boolean;
  onChange: (e: {}) => void;
}
export const ComponentConfig = ({
  border,
  chartBackground,
  head,
  showTitle = true,
  onChange: updatePage,
}: IComponentConfig) => (
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
    {showTitle && (
      <>
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
        <Field title="加粗">
          <Radio
            value={head.fontWeight}
            onChange={fontWeight => {
              updatePage({
                head: { ...head, fontWeight },
              });
            }}
            config={[
              {
                title: '细',
                value: 'lighter',
              },
              {
                title: '正常',
                value: 'normal',
              },
              {
                title: '加粗',
                value: 'bold',
              },
              {
                title: '极粗',
                value: 'bolder',
              },
            ]}
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
                title: <AlignLeftIcon style={{ color: '#fff' }} />,
                value: 'left',
              },
              {
                title: <AlignCenterIcon style={{ color: '#fff' }} />,
                value: 'center',
              },
              {
                title: <AlignRightIcon style={{ color: '#fff' }} />,
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
    )}
  </>
);

// 页面配置
interface IPageProps {
  page: IPage;
  dispatch: Dispatch;
}
export default ({ page, dispatch }: IPageProps) => {
  const updatePage = page => {
    dispatch({
      type: 'common/updatePage',
      payload: {
        page,
      },
    });
  };

  return (
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
  );
};
