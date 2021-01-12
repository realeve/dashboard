import React, { useState, useEffect } from 'react';
import styles from './index.less';
import Field from '@/component/field';
import type { IPage, ICommonConfig } from '@/models/common';
import type { Dispatch } from 'redux';

import { picList } from '@/component/widget/assets/pics';
import Popup from '@/component/Editor/Popup/Popup';
import { AssetItem } from '@/component/widget/blank/config';
import ColorPicker, { PureColor } from '@/component/field/ColorPicker';
import Radio from '@/component/field/Radio';
import Align from '@/component/field/Align';

import { Tabs, Spin } from 'antd';
import InputRange from '@/component/field/InputRange';
import Collapse from '@/component/collapse';
import { FormItem, FormField } from '@/pages/config/panel/setting/FormItem';
import { isColor } from '@/component/chartItem/option/lib';
import { ASSETS_URL } from '@/utils/setting';

const { Panel } = Collapse;

const { TabPane } = Tabs;

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
  onChange: (e: string, borderSlice?: number[]) => void;
  style?: React.CSSProperties;
}) => {
  const [show, setShow] = useState(false);
  const [assets, setAssets] = useState(null);
  useEffect(() => {
    import(`../../../../component/widget/assets/${imgtype}`).then(({ default: assetItem }) =>
      setAssets(assetItem),
    );
  }, [imgtype]);
  if (!assets) {
    return <Spin spinning />;
  }

  return (
    <Field title={title} style={{ ...style, height: 116 }}>
      {isColor(value) ? (
        <div
          className={styles.img}
          style={{
            background: value,
            color: '#ddd',
            width: '100%',
            textAlign: 'center',
            lineHeight: 116,
          }}
          onClick={() => {
            setShow(!show);
          }}
        >
          点击设置背景
        </div>
      ) : (
        <img
          className={styles.img}
          src={value}
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
              assets={assets}
              style={{ overflowY: 'auto', height: 'calc(100% - 30px)' }}
              value={value}
              onChange={onChange}
            />
          ) : (
            <Tabs>
              {picList.map((picItem) => (
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
export type IComponentConfig = {
  showTitle?: boolean;
  onChange: (e: Record<string, any>) => void;
  defaultKey?: string;
  isPage?: boolean;
  page?: IPage;
} & Omit<ICommonConfig, 'borderSlice'>;
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
            const [width, height] = e;
            if (width === page.width && height === page.height) {
              return;
            }
            updatePage({ width, height });
          }}
        />
        <ImgSelector
          title="背景"
          value={ASSETS_URL + page.background}
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
        value={ASSETS_URL + border}
        imgtype="borders"
        onChange={(nextBorder, borderSlice) => {
          updatePage({
            border: nextBorder,
            borderSlice,
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
          onChange={(radius) => {
            updatePage({ borderRadius: radius });
          }}
        />
      </Field>
      <Field title="背景" style={{ padding: 10 }}>
        <ColorPicker
          value={chartBackground}
          onChange={(bg) => {
            updatePage({
              chartBackground: bg,
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
  const updatePage = (nextPage) => {
    dispatch({
      type: 'common/updatePage',
      payload: {
        page: nextPage,
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
