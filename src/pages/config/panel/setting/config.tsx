import React, { useEffect, useState } from 'react';
import styles from './index.less';
import Field from '@/component/field';
import { IPanelConfig, ICommon } from '@/models/common';
import { connect } from 'dva';
import { Dispatch } from 'redux';
import { useSetState } from 'react-use';
import * as R from 'ramda';

interface IPanel {
  selectedIdx: number;
  panel: IPanelConfig[];
  dispatch: Dispatch;
  setHide: () => void;
  onChange: (e: any, type: string) => void;
}

const Index = ({ setHide, selectedIdx, panel, dispatch, onChange }: IPanel) => {
  const [size, setSize] = useSetState({ width: 480, height: 270 });
  useEffect(() => {
    const setting = panel[selectedIdx];
    const _size = {
      width: Number(String(setting?.style?.width).replace('px', '')),
      height: Number(String(setting?.style?.height).replace('px', '')),
    };
    setSize(_size);
  }, [selectedIdx]);

  const updateStyle = (item: { [key: string]: any }) => {
    const style = R.clone(panel[selectedIdx].style || {});
    dispatch({
      type: 'common/updatePanelAttrib',
      payload: {
        idx: selectedIdx,
        attrib: {
          style: {
            ...style,
            ...item,
          },
        },
      },
    });
    onChange(item, 'size');
  };

  return (
    <>
      <div className={styles.head}>组件设置</div>
      <div className={styles.body}>
        <div className={styles.pageconfig}>
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
          </div>
        </div>
      </div>
      <div className={styles.bottom} onClick={setHide}>
        确定
      </div>
    </>
  );
};

export default connect(({ common }: { common: ICommon }) => ({
  panel: common.panel,
}))(Index);
