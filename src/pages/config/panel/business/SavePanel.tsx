import React, { useState, useEffect } from 'react';

import Popup from '@/component/Editor/Popup/Popup';
import Field from '@/component/field';
import Radio, { Select } from '@/component/field/Radio';
import styles from './SavePanel.less';
import { getSaveOption, getSelectedComponent, IBusinessProps } from './db';
import { IPanelConfig, IBusinessCategory } from '@/models/common';
import { useSetState } from 'react-use';
import { Button } from 'antd';
import * as R from 'ramda';

const FieldStyle = { background: 'unset' };

interface ISavePanelProps {
  show: boolean;
  onClose: () => void;
  selectedPanel: string[];
  panel: IPanelConfig[];
  businessCategory: IBusinessCategory[];
}
export default ({ show, onClose, selectedPanel, panel, businessCategory }: ISavePanelProps) => {
  const [option, setOption] = useSetState<IBusinessProps | null>(null);
  console.log(businessCategory);
  // 缩略图列表
  const [thumb, setThumb] = useState<string[]>([]);
  const onLoad = () => {
    if (!show) {
      return;
    }
    let panels = getSelectedComponent(selectedPanel, panel);
    let thumbImages = R.pluck<string>('image')(panels);
    setThumb(thumbImages.filter((item) => item));

    let _option = getSaveOption(panels);
    if (!_option) {
      onClose();
      return;
    }
    setOption(_option);
  };

  useEffect(onLoad, [show]);

  const saveComponent = () => {
    console.log(option);
    onClose();
    setThumb([]);
  };

  return (
    show &&
    option && (
      <Popup style={{ width: 400 }} onClose={onClose}>
        <h2>保存业务组件</h2>
        <div className={styles.popContainer}>
          <Field title="业务名称" style={FieldStyle}>
            <input
              type="text"
              className="data_input"
              value={option.title}
              onChange={(e) => {
                setOption({ title: e.target.value });
              }}
            />
          </Field>

          <Field title="缩略图" style={FieldStyle}>
            <Radio
              value={option.image}
              onChange={(image) => {
                setOption({ image });
              }}
              config={thumb.map((value) => ({
                value,
                title: <img src={value} style={{ height: 60, maxWidth: 100 }} />,
              }))}
            />
          </Field>
          <Field title="业务分类" style={FieldStyle}>
            <Select
              value={option.image}
              onChange={(image) => {
                setOption({ image });
              }}
              config={businessCategory.map(({ title }) => ({
                value: title,
                title,
              }))}
            />
          </Field>

          <div
            style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}
          >
            <Button type="primary" style={{ width: 120 }} onClick={saveComponent}>
              保存
            </Button>
          </div>
        </div>
      </Popup>
    )
  );
};
