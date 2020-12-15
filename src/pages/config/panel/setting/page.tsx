import React, { useState } from 'react';
import styles from './index.less';
import Field from '@/component/field';
import { IPage, ICommonConfig } from '@/models/common';
import { Dispatch } from 'redux';
import assets from '@/component/widget/assets';
import Popup from '@/component/Editor/Popup/Popup';
import { AssetItem } from '@/component/widget/blank/config';
import ColorPicker, { PureColor } from '@/component/field/ColorPicker';
import Radio from '@/component/field/Radio';
import Align from '@/component/field/Align';

import { Tabs, Switch } from 'antd';
import InputRange from '@/component/field/InputRange';
import Collapse from '@/component/collapse';
import { FormItem, FormField } from '@/pages/config/panel/setting/FormItem';
import { isColor } from '@/component/chartItem/option/lib';

const { Panel } = Collapse;

const TabPane = Tabs.TabPane;

export const ImgSelector = ({
  title,
  imgtype = 'backgrounds',
  value,
  onChange,
  style = {},
}: {
  title: string | React.ReactNode;
  imgtype?: 'backgrounds' | 'borders' | 'pics';
  value: string;
  onChange: (e: string) => void;
  style?: React.CSSProperties;
}) => {
  const [show, setShow] = useState(false);
  let val = assets[imgtype][value]?.url;
  return (
    <Field title={title} style={{ ...style, height: 116 }}>
      {isColor(val) ? (
        <div
          className={styles.img}
          style={{
            background: val,
            color: '#ddd',
            width: '100%',
            textAlign: 'center',
            lineHeight: 116,
          }}
        >
          点击设置背景
        </div>
      ) : (
        <img
          className={styles.img}
          src={val}
          onClick={() => {
            setShow(!show);
          }}
        />
      )}
      {show && (
        <Popup
          onClose={() => {
            setShow(false);
          }}
        >
          {imgtype !== 'pics' ? (
            <AssetItem
              assets={assets[imgtype]}
              style={{ overflowY: 'auto', height: 'calc(100% - 30px)' }}
              value={value}
              onChange={onChange}
            />
          ) : (
            <Tabs>
              {assets.picList.map((picItem) => (
                <TabPane tab={picItem.title} key={picItem.title}>
                  <AssetItem
                    assets={picItem.data}
                    style={{ overflowY: 'auto', height: 630, maxHeight: 830 }}
                    value={value}
                    onChange={onChange}
                  />
                </TabPane>
              ))}
            </Tabs>
          )}
        </Popup>
      )}
    </Field>
  );
};

// 组件的通用样式设置
export interface IComponentConfig extends ICommonConfig {
  showTitle?: boolean;
  onChange: (e: {}) => void;
  defaultKey?: string;
  isPage?: boolean;
  page?: IPage;
}
export const ComponentConfig = ({
  border,
  borderRadius = [0, 0, 0, 0],
  chartBackground,
  head,
  showTitle = true,
  onChange: updatePage,
  isPage = false,
  page,
  defaultKey = '组件',
}: IComponentConfig) => (
  <Collapse defaultActiveKey={defaultKey}>
    {isPage && (
      <Panel header="画布" key="画布">
        <FormItem
          config={{ title: '屏幕大小', split: 'x', type: 'slider', step: 2 }}
          value={[page.width, page.height]}
          onChange={(e: [string, string]) => {
            let [width, height] = e;
            if (width == page.width && height == page.height) {
              return;
            }
            updatePage({ width, height });
          }}
        />
        <ImgSelector
          title="背景"
          value={page.background}
          imgtype="backgrounds"
          onChange={(background) => {
            updatePage({
              background,
            });
          }}
        />
        <FormItem
          title="作者"
          config={{ valueType: 'text' }}
          className="data_input"
          value={page.author}
          onChange={(author) => {
            updatePage({
              author,
            });
          }}
        />
        <Field title="标题">
          <input
            type="string"
            className="data_input"
            defaultValue={page.title}
            onChange={(e) => {
              updatePage({
                title: e.target.value,
              });
            }}
          />
        </Field>
        <Field title="安全边距">
          <InputRange
            step={1}
            value={page.padding}
            onChange={(padding) => {
              updatePage({
                padding,
              });
            }}
            min={0}
            max={30}
          />
        </Field>
      </Panel>
    )}
    <Panel header="组件" key="组件">
      <ImgSelector
        title="边框"
        value={border}
        imgtype="borders"
        onChange={(border) => {
          updatePage({
            border,
          });
        }}
      />
      <Field title="圆角弧度">
        <FormField
          value={borderRadius}
          config={{
            length: 4,
            type: 'slider',
            valueType: 'number',
            step: 1,
            min: 0,
            split: '',
            style: { width: 50, minWidth: 50 },
          }}
          onChange={(borderRadius) => {
            updatePage({ borderRadius });
          }}
        />
      </Field>
      <Field title="背景" style={{ padding: 10 }}>
        <ColorPicker
          value={chartBackground}
          onChange={(chartBackground) => {
            updatePage({
              chartBackground,
            });
          }}
        />
      </Field>
    </Panel>
    {showTitle && (
      <Panel header="标题" key="标题">
        <Field title="字号">
          <InputRange
            step={1}
            min={10}
            max={50}
            value={+head.fontSize}
            onChange={(fontSize) => {
              updatePage({
                head: { ...head, fontSize },
              });
            }}
          />
        </Field>
        <Field title="文字颜色">
          <PureColor
            value={head.color}
            onChange={(color) => {
              updatePage({
                head: { ...head, color },
              });
            }}
            position="bottom"
          />
        </Field>
        <Field title="加粗">
          <Radio
            value={head.fontWeight}
            onChange={(fontWeight) => {
              updatePage({
                head: { ...head, fontWeight },
              });
            }}
            config={[
              {
                title: <div style={{ fontWeight: 'lighter', fontSize: 20 }}>Aa</div>,
                value: 'lighter',
              },
              {
                title: <div style={{ fontWeight: 'normal', fontSize: 20 }}>Aa</div>,
                value: 'normal',
              },
              {
                title: <div style={{ fontWeight: 'bold', fontSize: 20 }}>Aa</div>,
                value: 'bold',
              },
              {
                title: <div style={{ fontWeight: 'bolder', fontSize: 20 }}>Aa</div>,
                value: 'bolder',
              },
            ]}
          />
        </Field>
        <Field title="边距">
          <InputRange
            step={1}
            min={0}
            max={50}
            value={+head.padding}
            onChange={(padding) => {
              updatePage({
                head: { ...head, padding },
              });
            }}
          />
        </Field>
        <Field title="对齐">
          <Align
            value={head.textAlign}
            onChange={(textAlign) => {
              updatePage({
                head: { ...head, textAlign },
              });
            }}
          />
        </Field>
        <Field title="背景色">
          <ColorPicker
            value={head.background}
            onChange={(background) => {
              updatePage({
                head: { ...head, background },
              });
            }}
          />
        </Field>
      </Panel>
    )}
  </Collapse>
);

// 页面配置
interface IPageProps {
  page: IPage;
  dispatch: Dispatch;
}
export default ({ page, dispatch }: IPageProps) => {
  const updatePage = (page) => {
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
        <ComponentConfig
          onChange={updatePage}
          page={page}
          border={page.border}
          borderRadius={page.borderRadius || [0, 0, 0, 0]}
          chartBackground={page.chartBackground}
          head={page.head}
          defaultKey="画布"
          isPage={true}
        />
      </div>
    </div>
  );
};
