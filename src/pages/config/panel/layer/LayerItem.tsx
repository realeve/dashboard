import React, { useState, useEffect, useRef } from 'react';
import ContentEditable from 'react-contenteditable';
import { GROUP_COMPONENT_KEY } from '@/models/common';
import classnames from 'classnames';
import styles from './index.less';
import { MENU_ACTIONS } from './lib';

export const LayerItem = ({ isThumb, isSelected, item, dispatch, handleAction }) => {
  // let type = lib.getType(item);
  let IS_GROUP = item.key === GROUP_COMPONENT_KEY;

  const [disableEdit, setDisableEdit] = useState(true);

  const text = useRef(item?.componentConfig?.imgname || item.title);

  const handleChange = (e) => {
    text.current = e.target.value;
  };

  const handleBlur = () => {
    updateAttrib({
      title: text.current,
    });
    setDisableEdit(true);
  };

  const updateAttrib = (attrib) => {
    dispatch({
      type: 'common/updatePanelAttrib',
      payload: {
        idx: item.id,
        attrib,
      },
    });
  };

  const ref = useRef(null);
  useEffect(() => {
    // 允许编辑时获取焦点
    if (disableEdit) {
      return;
    }

    ref.current.focus();
    let range = window.getSelection(); //创建range
    range.selectAllChildren(ref.current); //range 选择obj下所有子内容
    range.collapseToEnd(); //光标移至最后
  }, [disableEdit]);

  return (
    <>
      {IS_GROUP && (
        <i
          className={classnames('datav-font fold-toggle-btn icon-right', {
            'icon-fold': item.fold,
          })}
          style={{ marginRight: 5 }}
          onClick={() => {
            updateAttrib({ fold: !item.fold });
          }}
        />
      )}
      {!isThumb || IS_GROUP ? (
        <i className={item.icon} />
      ) : (
        <img src={item.image} alt={item.title} className={styles.img} />
      )}
      <div
        className={styles.text}
        onDoubleClick={() => {
          setDisableEdit(false);
        }}
      >
        <ContentEditable
          innerRef={ref}
          tagName="span"
          html={text.current}
          onBlur={handleBlur}
          onChange={handleChange}
          disabled={isSelected && disableEdit}
        />
      </div>
      <div
        className={classnames({
          [styles['layer-thumbail-item']]: item.lock || !item.show,
        })}
      >
        {item.hide && (
          <i
            className="lock-toggle-btn datav-font icon-hide"
            onClick={() => {
              handleAction(MENU_ACTIONS.HIDE);
            }}
          />
        )}
        {item.lock && (
          <i
            className="lock-toggle-btn datav-font icon-lock"
            onClick={() => {
              handleAction(MENU_ACTIONS.LOCK);
            }}
          />
        )}
      </div>
    </>
  );
};
