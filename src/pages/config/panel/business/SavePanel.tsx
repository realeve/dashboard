import React, { useState, useEffect } from 'react';

import { Confirm } from '@/component/Editor/Popup/Popup';
import FieldComponent from '@/component/field';
import Radio, { Select } from '@/component/field/Radio';
import styles from './SavePanel.less';
import { getSaveOption, getSelectedComponent, IBusinessProps, addTblBusiness } from './db';
import { IPanelConfig, IBusinessCategory } from '@/models/common';
import { useSetState } from 'react-use';
import { message } from 'antd';
import * as R from 'ramda';
import { Dispatch } from 'redux';

const FieldStyle = { background: 'unset' };
const Field = ({ children, ...props }) => (
  <FieldComponent {...props} style={FieldStyle} titleWidth={80}>
    {children}
  </FieldComponent>
);

interface ISavePanelProps {
  show: boolean;
  onClose: () => void;
  selectedPanel: string[];
  panel: IPanelConfig[];
  businessCategory: IBusinessCategory[];
  dispatch: Dispatch;
}
export default ({
  show,
  onClose,
  selectedPanel,
  panel,
  businessCategory,
  dispatch,
}: ISavePanelProps) => {
  const [option, setOption] = useSetState<IBusinessProps | null>(null);

  const [cateIdx, setCateIdx] = useState(0);

  // 缩略图列表
  const [thumb, setThumb] = useState<string[]>([]);
  const onLoad = () => {
    if (!show) {
      return;
    }
    let panels = getSelectedComponent(selectedPanel, panel);
    let thumbImages = R.uniq(R.pluck<string>('image')(panels));
    setThumb(thumbImages.filter((item) => item));

    let _option = getSaveOption(panels, businessCategory[0]);
    if (!_option) {
      onClose();
      return;
    }
    setOption(_option);
  };

  useEffect(onLoad, [show]);

  const saveComponent = () => {
    addTblBusiness(option)
      .then(({ data: [{ affected_rows }] }) => {
        if (affected_rows > 0) {
          reset();
          message.success('业务组件保存成功');

          // 保存成功后需要重新刷新业务组件列表
          dispatch({
            type: 'common/loadBusinessCategory',
          });
        }
      })
      .catch((e) => {
        message.warn('业务组件保存失败');
      });
  };

  const reset = () => {
    setCateIdx(0);
    onClose();
    setThumb([]);
  };

  return (
    show && (
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
                  let idx = R.findIndex(R.propEq('title', category_main))(businessCategory);
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
    )
  );
};
