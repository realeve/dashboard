import React, { useState, useEffect } from 'react';

import { Confirm } from '@/component/Editor/Popup/Popup';
import FieldComponent from '@/component/field';
import Radio, { Select } from '@/component/field/Radio';
import styles from './SavePanel.less';
import type { IBusinessProps, IBusinessEditProps } from './db';
import { getSaveOption, getSelectedComponent } from './db';
import * as db from './db';
import type { IPanelConfig, IBusinessCategory } from '@/models/common';
import { useSetState } from 'react-use';
import { message } from 'antd';
import * as R from 'ramda';
import type { Dispatch } from 'redux';

const FieldStyle = { background: 'unset' };
export const Field = ({ children, ...props }) => (
  <FieldComponent {...props} style={FieldStyle} titleWidth={80}>
    {children}
  </FieldComponent>
);

interface ISavePanelProps {
  onClose: () => void;
  selectedPanel: string[];
  panel: IPanelConfig[];
  businessCategory: IBusinessCategory[];
  dispatch: Dispatch;
}
export default ({ onClose, selectedPanel, panel, businessCategory, dispatch }: ISavePanelProps) => {
  const [option, setOption] = useSetState<IBusinessProps | null>(null);

  const [cateIdx, setCateIdx] = useState(0);
  const [editId, setEditId] = useState(null);

  // 缩略图列表
  const [thumb, setThumb] = useState<string[]>([]);
  const onLoad = () => {
    const panels = getSelectedComponent(selectedPanel, panel);

    // 获取 当前编辑的id
    const edit_id = R.uniq(R.pluck<string>('edit_id')(panels));
    // 记录待编辑id
    setEditId(edit_id[0]);

    const thumbImages = R.uniq(R.pluck<string>('image')(panels));
    setThumb(thumbImages.filter((item) => item));

    const nextOption = getSaveOption(panels, businessCategory[0]);
    if (!nextOption) {
      onClose();
      return;
    }
    setOption(nextOption);
  };

  useEffect(onLoad, []);

  // 编辑成功后将面板列表中对应的edit_id属性删除掉；
  const closeEditModeFromPanels = () => {
    const nextPanel = R.map(({ edit_id, ...item }) => item)(panel);
    dispatch({
      type: 'common/updatePanel',
      payload: {
        panel: nextPanel,
        selectedPanel: [],
      },
    });

    // 清空当前选择项
    // dispatch({
    //   type: 'common/setStore',
    //   payload: {
    //     selectedPanel: [],
    //   },
    // });
  };

  const reset = () => {
    setEditId(null);
    setCateIdx(0);
    onClose();
    setThumb([]);
  };

  const saveComponent = () => {
    let _option: Partial<IBusinessEditProps> = {};
    const method = editId ? 'setDashboardBusiness' : 'addTblBusiness';
    if (editId) {
      _option = R.pick('title category_main category_sub image config is_hide'.split(' '))(option);
      _option._id = editId;
      _option.is_hide = '0';
    }

    db[method]((editId ? _option : option) as any)
      .then((success) => {
        if (success) {
          reset();
          message.success(`业务组件${editId ? '编辑' : '添加'}成功`);
          if (editId) {
            closeEditModeFromPanels();
          }
          // 保存成功后需要重新刷新业务组件列表
          dispatch({
            type: 'common/loadBusinessCategory',
          });
        }
      })
      .catch(() => {
        message.warn('业务组件保存失败');
      });
  };

  return (
    <Confirm
      title="保存业务组件"
      spinning={!option}
      style={{ width: 400, minHeight: 330, height: 'auto' }}
      onCancel={onClose}
      onOk={saveComponent}
    >
      {option && (
        <div className={styles.popContainer}>
          <Field title="业务名称">
            <input
              type="text"
              className="data_input"
              value={option.title}
              onChange={(e) => {
                setOption({ title: e.target.value });
              }}
            />
          </Field>

          <Field title="缩略图">
            <Radio
              value={option.image}
              className={styles.imglist}
              onChange={(image) => {
                setOption({ image });
              }}
              config={thumb.map((value) => ({
                value,
                title: <img src={value} style={{ height: 60, maxWidth: 100 }} />,
              }))}
            />
          </Field>
          <Field title="业务分类">
            <Radio
              value={option.category_main}
              onChange={(category_main) => {
                const idx = R.findIndex(R.propEq('title', category_main))(businessCategory);
                setCateIdx(idx);
                setOption({ category_main, category_sub: businessCategory[idx]?.list?.[0] });
              }}
              config={R.map(
                ({ title }) => ({
                  value: title,
                  title,
                }),
                businessCategory,
              )}
            />
          </Field>
          <Field title="二级分类">
            <Select
              value={option.category_sub}
              onChange={(category_sub) => {
                setOption({ category_sub });
              }}
              config={R.nth(cateIdx, businessCategory).list.map((title) => ({
                value: title,
                title,
              }))}
            />
          </Field>
        </div>
      )}
    </Confirm>
  );
};
