import React, { useEffect, useState } from 'react';
import styles from './index.less';
import Field from '@/component/field';
import { IPanelConfig, ICommon, IPage } from '@/models/common';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { useSetState } from 'react-use';
import * as R from 'ramda';
import { ComponentConfig } from './page';
import { Tabs, Switch } from 'antd';
import ComponentSetting from './componentSetting';
import ApiSetting from './apiSetting';
import InputRange from '@/component/field/InputRange';
import { Divider } from 'antd';

interface IPanel {
  selectedIdx: number;
  panel: IPanelConfig[];
  page: IPage;
  dispatch: Dispatch;
  onChange: (e: any, type: string) => void;
}

// 获取通用配置
const getGeneralConfig = ({ selectedIdx, panel, page }) => {
  let item = panel[selectedIdx];
  let commonConfig = {
    border: page.border,
    chartBackground: page.chartBackground,
    head: page.head,
  };

  let res = R.clone(item.general || commonConfig);
  return item.useGeneralStyle ? null : res;
};

const Index = ({ selectedIdx, panel, page, dispatch, onChange }: IPanel) => {
  // 尺寸
  const [size, setSize] = useSetState({ width: 480, height: 270 });
  useEffect(() => {
    let setting = panel[selectedIdx];
    const _size = {
      width: Number(String(setting?.style?.width).replace('px', '')),
      height: Number(String(setting?.style?.height).replace('px', '')),
    };
    setSize(_size);

    let next = getGeneralConfig({ selectedIdx, panel, page });
    setGeneral(next);
  }, [selectedIdx, JSON.stringify(panel)]);

  // 更新样式
  const updateStyle = (item: { [key: string]: any }, type = 'size') => {
    const style = R.clone(panel[selectedIdx].style || {});
    const nextStyle = {
      style: {
        ...style,
        ...item,
      },
    };
    updateAttrib(nextStyle);
    onChange(item, 'size');
  };

  const updateAttrib = (res: {}) => {
    dispatch({
      type: 'common/updatePanelAttrib',
      payload: {
        idx: panel[selectedIdx].id,
        attrib: {
          ...res,
        },
      },
    });
  };

  // 通用配置
  const [general, setGeneral] = useState(null);

  return (
    <Tabs defaultActiveKey="1" type="line">
      <Tabs.TabPane tab="外观设置" key="1" style={{ color: '#eee', height: '100%' }}>
        <div className={styles.pageconfig} style={{ height: '100%' }}>
          <div className={styles['datav-gui']}>
            <Field title="组件尺寸">
              <div className="alignRow">
                <input
                  type="number"
                  className="data_input"
                  step="2"
                  value={size.width}
                  onChange={(e) => {
                    const style = { width: Number(e.target.value) };
                    setSize(style);
                    updateStyle(style);
                  }}
                />
                <span style={{ margin: '0 8px' }}>x</span>
                <input
                  type="number"
                  className="data_input"
                  step="2"
                  onChange={(e) => {
                    const style = { height: Number(e.target.value) };
                    setSize(style);
                    updateStyle(style);
                  }}
                  value={size.height}
                />
              </div>
            </Field>
            <Field title="旋转角度">
              <InputRange
                step={15}
                min={0}
                max={360}
                disabled
                value={Math.floor(
                  panel[selectedIdx].style.transform?.rotate?.replace('deg', '') || '0',
                )}
                onChange={(rotate) => {
                  const style = R.clone(panel[selectedIdx].style || {});
                  const nextStyle = {
                    style: {
                      ...style,
                      transform: {
                        ...style.transform,
                        rotate: `${rotate}deg`,
                      },
                    },
                  };
                  updateAttrib(nextStyle);
                }}
              />
            </Field>
            <Field title="使用全局样式">
              <Switch
                checked={panel[selectedIdx]?.useGeneralStyle}
                onChange={(useGeneralStyle) => {
                  if (useGeneralStyle) {
                    updateAttrib({
                      useGeneralStyle,
                      general: null, // 使用全局配置时，当前项置为空
                    });
                  } else {
                    updateAttrib({
                      useGeneralStyle,
                    });
                  }
                }}
                checkedChildren="是"
                unCheckedChildren="否"
              />
            </Field>
            <Divider plain>显示设置</Divider>
            <Field title="标题">
              <Switch
                checked={panel[selectedIdx]?.showTitle}
                onChange={(showTitle) => {
                  updateAttrib({
                    showTitle,
                  });
                }}
                checkedChildren="显示"
                unCheckedChildren="隐藏"
              />
            </Field>
            <Field title="边框">
              <Switch
                checked={panel[selectedIdx]?.showBorder}
                onChange={(showBorder) => {
                  updateAttrib({
                    showBorder,
                  });
                }}
                checkedChildren="显示"
                unCheckedChildren="隐藏"
              />
            </Field>
            <Field title="背景">
              <Switch
                checked={panel[selectedIdx]?.showBackground}
                onChange={(showBackground) => {
                  updateAttrib({
                    showBackground,
                  });
                }}
                checkedChildren="显示"
                unCheckedChildren="隐藏"
              />
            </Field>
            {general && (
              <ComponentConfig
                {...general}
                showTitle={panel[selectedIdx].showTitle}
                onChange={(e) => {
                  const next = {
                    ...general,
                    ...e,
                  };
                  setGeneral(next);
                  updateAttrib({ general: next, useGeneralStyle: false });
                }}
              />
            )}
          </div>
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane tab="组件配置" key="2">
        <ComponentSetting
          onChange={(componentConfig) => {
            updateAttrib({ componentConfig });
          }}
          panel={panel[selectedIdx]}
        />
      </Tabs.TabPane>

      {/* 业务组件不允许设置ajax，此处新增字段需要与不发起ajax做区分 */}
      {panel[selectedIdx].ajax && !panel[selectedIdx].business && (
        <Tabs.TabPane tab="接口配置" key="3">
          <ApiSetting
            onChange={(api) => {
              updateAttrib({ api });
            }}
            panel={panel[selectedIdx]}
          />
        </Tabs.TabPane>
      )}
    </Tabs>
  );
};

export default connect(({ common }: { common: ICommon }) => ({
  panel: common.panel,
  page: common.page,
}))(Index);
