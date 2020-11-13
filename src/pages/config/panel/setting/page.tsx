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
  return (
    <Field title={title} style={{ ...style, height: 100 }}>
      <img
        className={styles.img}
        src={assets[imgtype][value]?.url}
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
          {/* <div style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 10 }}>
            <SettingOutlined /> 设置 {title}
          </div> */}
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
        <Field title="屏幕大小">
          <div className="alignRow">
            <input
              type="number"
              className="data_input"
              step="2"
              defaultValue={page.width}
              onChange={(e) => {
                updatePage({
                  width: e.target.value,
                });
              }}
            />
            <span style={{ margin: '0 8px' }}>x</span>
            <input
              type="number"
              className="data_input"
              step="2"
              defaultValue={page.height}
              onChange={(e) => {
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
          imgtype="backgrounds"
          onChange={(background) => {
            updatePage({
              background,
            });
          }}
        />
        <Field title="作者">
          <input
            type="string"
            className="data_input"
            defaultValue={page.author}
            onChange={(e) => {
              updatePage({
                author: e.target.value,
              });
            }}
          />
        </Field>
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
        <Field title="屏幕拼接数量">
          <div className="alignRow">
            <input
              type="number"
              className="data_input"
              step="1"
              min={1}
              max={10}
              defaultValue={page.screen_x}
              onChange={(e) => {
                updatePage({
                  screen_x: e.target.value,
                });
              }}
            />
            <span style={{ margin: '0 8px' }}>x</span>
            <input
              type="number"
              className="data_input"
              step="1"
              min={1}
              max={10}
              defaultValue={page.screen_y}
              onChange={(e) => {
                updatePage({
                  screen_y: e.target.value,
                });
              }}
            />
          </div>
        </Field>
        <Field title="拼接边距">
          <InputRange
            step={1}
            value={page.screen_edge_width}
            onChange={(screen_edge_width) => {
              updatePage({
                screen_edge_width,
              });
            }}
            min={0}
            max={30}
          />
        </Field>
        <Field title="拼接线标签">
          <Switch
            checked={page.showEdgeTag}
            onChange={(showEdgeTag) => {
              updatePage({
                showEdgeTag,
              });
            }}
            checkedChildren="显示"
            unCheckedChildren="隐藏"
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
          <input
            type="number"
            className="data_input"
            step="1"
            defaultValue={head.fontSize}
            onChange={(e) => {
              updatePage({
                head: { ...head, fontSize: Number(e.target.value) },
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
          <input
            type="number"
            className="data_input"
            step="1"
            defaultValue={head.padding}
            onChange={(e) => {
              updatePage({
                head: { ...head, padding: Number(e.target.value) },
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
          chartBackground={page.chartBackground}
          head={page.head}
          defaultKey="画布"
          isPage={true}
        />
      </div>
    </div>
  );
};
