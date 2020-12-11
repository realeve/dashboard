import React, { useEffect, useState } from 'react';
import styles from './index.less';
import Field from '@/component/field';
import { IPanelConfig, ICommon, IPage, IHistoryProps } from '@/models/common';
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

interface IPanel extends IHistoryProps {
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

// [-] 已知bug，当form渲染出来后，切换组件时，会导致两个组件配置项不一致，对应的数据读取错误而使页面崩溃，
// 此处应先重置面板，进入切换状态；

const Index = ({
  selectedIdx,
  history,
  curHistoryIdx,
  panel: _panel,
  page,
  dispatch,
  onChange,
}: IPanel) => {
  let panel = history[curHistoryIdx]?.panel || _panel;
  // 尺寸
  const [size, setSize] = useSetState({ width: 480, height: 270 });
  const [activeKey, setActiveKey] = useState('1');
  useEffect(() => {
    setActiveKey('1');
  }, [selectedIdx]);

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
    updateAttrib(nextStyle, true, `调整【${panel[selectedIdx].title}】基础样式`);
    onChange(item, 'size');
  };

  const updateAttrib = (res: {}, recordHistory = true, historyTitle = '') => {
    dispatch({
      type: 'common/updatePanelAttrib',
      payload: {
        idx: panel[selectedIdx].id,
        attrib: {
          ...res,
        },
        recordHistory,
        historyTitle,
      },
    });
  };

  // 通用配置
  const [general, setGeneral] = useState(null);

  // 当前选中的面板
  let currentPanel = panel[selectedIdx];

  return (
    <Tabs defaultActiveKey="1" activeKey={activeKey} type="line" onChange={setActiveKey}>
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
                value={Math.floor(currentPanel.style.transform?.rotate?.replace('deg', '') || '0')}
                onChange={(rotate) => {
                  const style = R.clone(currentPanel.style || {});
                  const nextStyle = {
                    style: {
                      ...style,
                      transform: {
                        ...style.transform,
                        rotate: `${rotate}deg`,
                      },
                    },
                  };
                  updateAttrib(nextStyle, false);
                }}
              />
            </Field>
            <Field title="使用全局样式">
              <Switch
                checked={currentPanel?.useGeneralStyle}
                onChange={(useGeneralStyle) => {
                  if (useGeneralStyle) {
                    updateAttrib(
                      {
                        useGeneralStyle,
                        general: null, // 使用全局配置时，当前项置为空
                      },
                      true,
                      `使用全局样式 - ${panel[selectedIdx].title}`,
                    );
                  } else {
                    updateAttrib(
                      {
                        useGeneralStyle,
                      },
                      true,
                      `禁用全局样式 - ${panel[selectedIdx].title}`,
                    );
                  }
                }}
                checkedChildren="是"
                unCheckedChildren="否"
              />
            </Field>
            <Divider plain>显示设置</Divider>
            <Field title="标题">
              <Switch
                checked={currentPanel?.showTitle}
                onChange={(showTitle) => {
                  updateAttrib(
                    {
                      showTitle,
                    },
                    true,
                    `${showTitle ? '显示' : '隐藏'}标题 - ${panel[selectedIdx].title}`,
                  );
                }}
                checkedChildren="显示"
                unCheckedChildren="隐藏"
              />
            </Field>
            <Field title="边框">
              <Switch
                checked={currentPanel?.showBorder}
                onChange={(showBorder) => {
                  updateAttrib(
                    {
                      showBorder,
                    },
                    true,
                    `${showBorder ? '显示' : '隐藏'}边框 - ${panel[selectedIdx].title}`,
                  );
                }}
                checkedChildren="显示"
                unCheckedChildren="隐藏"
              />
            </Field>
            <Field title="背景">
              <Switch
                checked={currentPanel?.showBackground}
                onChange={(showBackground) => {
                  updateAttrib(
                    {
                      showBackground,
                    },
                    true,
                    `${showBackground ? '显示' : '隐藏'}显示背景 - ${panel[selectedIdx].title}`,
                  );
                }}
                checkedChildren="显示"
                unCheckedChildren="隐藏"
              />
            </Field>
            {general && (
              <ComponentConfig
                {...general}
                showTitle={currentPanel.showTitle}
                onChange={(e) => {
                  const next = {
                    ...general,
                    ...e,
                  };
                  setGeneral(next);
                  updateAttrib(
                    { general: next, useGeneralStyle: false },
                    true,
                    `个性化设置 - ${panel[selectedIdx].title}`,
                  );
                }}
              />
            )}
          </div>
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane tab="组件配置" key="2">
        <ComponentSetting
          onChange={(componentConfig, title) => {
            updateAttrib({ componentConfig }, true, title + ` - ${panel[selectedIdx].title}`);
          }}
          panel={currentPanel}
        />
      </Tabs.TabPane>

      {/* 业务组件不允许设置ajax，此处新增字段需要与不发起ajax做区分 */}
      {currentPanel.ajax && (
        <Tabs.TabPane tab="接口配置" key="3">
          <ApiSetting
            onChange={(api) => {
              updateAttrib({ api }, true, '调整接口配置项' + ` - ${panel[selectedIdx].title}`);
            }}
            panel={currentPanel}
            isBusiness={currentPanel.business && !currentPanel.edit_id}
          />
        </Tabs.TabPane>
      )}
    </Tabs>
  );
};

export default connect(({ common }: { common: ICommon }) => common)(Index);
