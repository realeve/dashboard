import React, { useState } from 'react';
import { Confirm } from '@/component/Editor/Popup/Popup';
import Radio from '@/component/field/Radio';
import styles from './SavePanel.less';
import type { IPanelConfig } from '@/models/common';
import type { Dispatch } from 'redux';
import { Field } from './SavePanel';
import * as R from 'ramda';
import { GROUP_COMPONENT_KEY, SCREEN_EDGE_KEY } from '@/models/common';

interface ISavePanelProps {
  onClose: () => void;
  selectedPanel: string[];
  panel: IPanelConfig[];
  dispatch: Dispatch;
  editor: React.MutableRefObject<any>;
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

export default ({ onClose, selectedPanel, panel, dispatch, editor }: ISavePanelProps) => {
  const [option, setOption] = useState('2');
  const [align, setAlign] = useState('不处理');

  const saveComponent = () => {
    // 如果是分组选择，id不对
    const nextSelectedPanel = panel
      .filter((item) => ![GROUP_COMPONENT_KEY, SCREEN_EDGE_KEY].includes(item.key))
      .map((item) => item.id);

    const validPanels = selectedPanel.filter((item) => nextSelectedPanel.includes(item));

    const distId = validPanels[0];

    const distStyle = R.find<IPanelConfig>(R.propEq<string>('id', distId))(panel);

    let needUpdateStyle: {
      width?: string | number;
      height?: string | number;
      transform?: { translate: string };
    } = {};
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

    const [transX, transY] = distStyle.style.transform.translate.split(',');

    // 更新后的面板尺寸
    const nextPanel = panel.map((item) => {
      // 分组、屏幕分割线组件、当前组件、未选中的组件不处理宽高逻辑
      const isSelected = !validPanels.includes(item.id);
      const isIgnoredComponents = [GROUP_COMPONENT_KEY, SCREEN_EDGE_KEY].includes(item.type);
      if (isIgnoredComponents || item.id === distId || isSelected) {
        return item;
      }
      const nextStyle = R.clone(item.style);

      const currentTranslate = nextStyle.transform.translate.split(',');

      if (align === '左侧') {
        currentTranslate[0] = transX;
      } else if (align === '顶部') {
        currentTranslate[1] = transY;
      }

      // 左侧和顶部对齐
      needUpdateStyle = {
        ...needUpdateStyle,
        transform: {
          ...nextStyle.transform,
          translate: currentTranslate.join(','),
        },
      };

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
        selectedPanel: [distId],
      },
    });

    // 更新样式
    editor.current.updateTargetByIds(
      R.tail(validPanels).map((id) => ({
        id,
        style: needUpdateStyle,
      })),
    );
    onClose();
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

        <Field title="对齐">
          <Radio
            value={align}
            onChange={(v) => {
              setAlign(v);
            }}
            config="不处理,左侧,顶部"
          />
        </Field>
        <p>组件对齐调整后可能出现位置异常，刷新页面即可</p>
      </div>
    </Confirm>
  );
};
