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

interface IPanel {
  selectedIdx: number;
  panel: IPanelConfig[];
  page: IPage;
  dispatch: Dispatch;
  onChange: (e: any, type: string) => void;
}

// 获取通用配置
const getGeneralConfig = ({ selectedIdx, panel, page }) =>
  R.clone(
    panel[selectedIdx].general || {
      border: page.border,
      chartBackground: page.chartBackground,
      head: page.head,
    },
  );

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
    setGeneral(getGeneralConfig({ selectedIdx, panel, page }));
  }, [selectedIdx]);

  // 更新样式
  const updateStyle = (item: { [key: string]: any }) => {
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
      <Tabs.TabPane tab="通用设置" key="1" style={{ color: '#eee', height: '100%' }}>
        <div className={styles.pageconfig} style={{ height: '100%' }}>
          <div className={styles['datav-gui']}>
            <Field title="组件尺寸">
              <div className="alignRow">
                <input
                  type="number"
                  step="2"
                  style={{ marginRight: 10 }}
                  value={size.width}
                  onChange={e => {
                    const style = { width: Number(e.target.value) };
                    setSize(style);
                    updateStyle(style);
                  }}
                />
                <input
                  type="number"
                  step="2"
                  onChange={e => {
                    const style = { height: Number(e.target.value) };
                    setSize(style);
                    updateStyle(style);
                  }}
                  value={size.height}
                />
              </div>
            </Field>
            <Field title="显示标题">
              <Switch
                checked={panel[selectedIdx].showTitle}
                onChange={showTitle => {
                  updateAttrib({
                    showTitle,
                  });
                }}
                checkedChildren="显示"
                unCheckedChildren="隐藏"
              />
            </Field>
            {general && panel[selectedIdx].showTitle && (
              <ComponentConfig
                {...general}
                onChange={e => {
                  const next = {
                    ...general,
                    ...e,
                  };
                  setGeneral(next);
                  updateAttrib({ general: next });
                }}
              />
            )}
          </div>
        </div>
      </Tabs.TabPane>
      <Tabs.TabPane tab="接口配置" key="2">
        Content of Tab Pane 2
      </Tabs.TabPane>
    </Tabs>
  );
};

export default connect(({ common }: { common: ICommon }) => ({
  panel: common.panel,
  page: common.page,
}))(Index);
