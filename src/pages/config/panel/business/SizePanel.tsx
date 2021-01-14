import React, { useState } from 'react';
import { Confirm } from '@/component/Editor/Popup/Popup';
import Radio from '@/component/field/Radio';
import styles from './SavePanel.less';
import type { IPanelConfig } from '@/models/common';
import type { Dispatch } from 'redux';
import { Field } from './SavePanel';
import * as R from 'ramda';
import { GROUP_COMPONENT_KEY, SCREEN_EDGE_KEY } from '@/models/common';
import { getTargetsById } from '@/component/Editor/utils/utils';

interface ISavePanelProps {
  onClose: () => void;
  selectedPanel: string[];
  panel: IPanelConfig[];
  dispatch: Dispatch;
}

const panelConfig = [
  {
    value: '0',
    title: '宽度相同',
  },
  {
    value: '1',
    title: '高度相同',
  },
  {
    value: '2',
    title: '宽高相同',
  },
];

export default ({ onClose, selectedPanel, panel, dispatch }: ISavePanelProps) => {
  const [option, setOption] = useState('2');
  const saveComponent = () => {
    const distId = selectedPanel[0];
    const distStyle = R.find<IPanelConfig>(R.propEq<string>('id', distId))(panel);
    let needUpdateStyle: { width?: string | number; height?: string | number } = {};
    switch (option) {
      case '0':
        needUpdateStyle = { width: distStyle.style.width };
        break;
      case '1':
        needUpdateStyle = { height: distStyle.style.height };
        break;
      default:
      case '2':
        needUpdateStyle = { width: distStyle.style.width, height: distStyle.style.height };
        break;
    }

    // 更新后的面板尺寸
    const nextPanel = panel.map((item) => {
      // 分组、屏幕分割线组件、当前组件、未选中的组件不处理宽高逻辑
      const isSelected = !selectedPanel.includes(item.id);
      const isIgnoredComponents = [GROUP_COMPONENT_KEY, SCREEN_EDGE_KEY].includes(item.type);
      if (isIgnoredComponents || item.id === distId || isSelected) {
        return item;
      }
      const nextStyle = R.clone(item.style);
      return {
        ...item,
        style: {
          ...nextStyle,
          ...needUpdateStyle,
        },
      };
    });

    dispatch({
      type: 'common/updatePanel',
      payload: {
        panel: nextPanel,
        recordHistory: true,
        historyTitle: `批量调整组件尺寸 —— ${panelConfig[option].title}`,
      },
    });
    dispatch({
      type: 'common/setStore',
      payload: {
        selectedPanel: [],
      },
    });
    onClose();
    R.tail(selectedPanel).forEach((id) => {
      const el = getTargetsById(id);
      needUpdateStyle.width && (el.style.width = String(needUpdateStyle.width));
      needUpdateStyle.height && (el.style.height = String(needUpdateStyle.height));
    });
  };

  return (
    <Confirm
      title="调整组件尺寸"
      style={{ width: 400, minHeight: 330, height: 'auto' }}
      onCancel={onClose}
      onOk={saveComponent}
    >
      <div className={styles.popContainer}>
        <Field title="调整内容">
          <Radio
            value={option}
            onChange={(v) => {
              setOption(v);
            }}
            config={panelConfig}
          />
        </Field>
      </div>
    </Confirm>
  );
};
