import React, { useState, useEffect, useRef } from 'react';
import styles from './layer.less';
import classnames from 'classnames';
import { useToggle } from 'react-use';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import * as R from 'ramda';
import { connect } from 'dva';
import { ICommon, IPanelConfig, GROUP_COMPONENT_KEY } from '@/models/common';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import ContentEditable from 'react-contenteditable';

import { message } from 'antd';

/**
 * https://codesandbox.io/s/k260nyxq9v?file=/index.js:1257-1263
 * beautiful dnd 文档
 */

// a little function to help us with reordering the result
const reorder: <T>(list: T[], startIndex: number, endIndex: number) => T[] = (
  list,
  startIndex,
  endIndex,
) => {
  const result = R.clone(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

interface ILayerItem {
  type: string;
  img: string;
  title: string;
  icon: string;
  id: string;
  [key: string]: any;
}

export enum MENU_ACTIONS {
  TOP,
  BOTTOM,
  MOVE_PREV,
  MOVE_NEXT,
  LOCK,
  HIDE,
  COPY,
  REMOVE,
  FAVORITE,
  GROUP,
  UN_GROUP,
}

const MENU_LIST = [
  {
    title: '置顶',
    action: MENU_ACTIONS.TOP,
    icon: 'icon-to-top',
  },
  {
    title: '置底',
    action: MENU_ACTIONS.BOTTOM,
    icon: 'icon-to-bottom',
  },
  {
    title: '上移一层',
    action: MENU_ACTIONS.MOVE_PREV,
    icon: 'icon-move-prev',
  },
  {
    title: '下移一层',
    action: MENU_ACTIONS.MOVE_NEXT,
    icon: 'icon-move-next',
  },
  {
    icon: 'divider1',
  },
  {
    title: '编组',
    action: MENU_ACTIONS.GROUP,
    icon: 'icon-group',
  },
  {
    title: '取消编组',
    action: MENU_ACTIONS.UN_GROUP,
    icon: 'icon-ungroup',
  },
  {
    icon: 'divider0',
  },
  {
    title: '锁定/解锁',
    action: MENU_ACTIONS.LOCK,
    icon: 'icon-lock',
  },
  {
    title: '隐藏/显示',
    action: MENU_ACTIONS.HIDE,
    icon: 'icon-hide',
  },
  {
    icon: 'divider2',
  },
  {
    title: '复制',
    action: MENU_ACTIONS.COPY,
    icon: 'icon-copy',
  },
  {
    title: '删除',
    action: MENU_ACTIONS.REMOVE,
    icon: 'icon-delete',
  },
  {
    title: '收藏',
    action: MENU_ACTIONS.FAVORITE,
    icon: 'icon-favorite',
  },
  {
    icon: 'divider3',
  },
];

const MENU_TYPE = 'CONTEXT_MENU';

const LayerItem = ({ isThumb, isSelected, item, dispatch, handleAction }) => {
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

const getShowedPanel = (panel) => {
  let folds = R.compose(R.pluck('id'), R.filter(R.propEq('fold', true)))(panel);
  return R.reject((item) => folds.includes(item.group))(panel);
};

const Index = ({ setHide, hide, panel, selectedPanel, onRemove, dispatch, ...props }) => {
  const [isThumb, setIsThumb] = useToggle(true);

  const [selected, setSelected] = useState<number[]>([]);

  const getSelectedIdx = (selectedPanel) => {
    let _selected = [];
    showPanel.forEach((item, idx) => {
      if (selectedPanel.includes(item.id)) {
        _selected.push(idx);
      }
    });
    return _selected;
  };

  const [showPanel, setShowPanel] = useState([]);

  useEffect(() => {
    let nextPanel = getShowedPanel(panel);
    setShowPanel(nextPanel);
  }, [panel]);

  useEffect(() => {
    let _selected = getSelectedIdx(selectedPanel);
    setSelected(_selected);
  }, [selectedPanel.join(''), showPanel.join(',')]);

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    moveLayerItem(result.source.index, result.destination.index);
  };

  /**
   *
   * 移动图层元素
   *
   * @param from 开始索引
   * @param to 结束索引
   */
  const moveLayerItem = (from: number, to: number) => {
    const items: { key: string; id: string; group: string }[] = reorder(showPanel, from, to);
    // 需要对被分组且被展开的组件排序，保证组名在上，其次才是里面的内容；
    let groupPanels = R.compose(
      R.pluck('id'),
      R.filter(R.propEq('key', GROUP_COMPONENT_KEY)),
    )(items);

    let groupId = null,
      needUpdate = items[to].id,
      groupItem = items[to].group;
    // 处理将图层拖入分组的场景；
    if (to > 1) {
      let prevItem = items[to - 1];
      // 更新groupId
      groupId = prevItem.key === GROUP_COMPONENT_KEY ? prevItem.id : prevItem.group || null;
    }

    // 不包含子元素的列表
    let _panel = R.reject((item) => groupPanels.includes(item.group))(items);

    // 最终结果
    let _nextPanel: {}[] = [];

    _panel.forEach((item: { key: string; id: string }) => {
      if (needUpdate == item.id && groupId) {
        item.group = groupId;
      }
      if (item.key === GROUP_COMPONENT_KEY) {
        // 处理组内移动
        let childrenPanel = R.filter(R.propEq('group', item.id))(
          groupItem == item.id ? items : panel,
        ) as {}[];
        _nextPanel = [..._nextPanel, item, ...childrenPanel];
      } else {
        _nextPanel.push(item);
      }
    });

    dispatch({
      type: 'common/updatePanel',
      payload: {
        panel: _nextPanel,
      },
    });
    setSelected([to]);
  };

  // 更新第idx个数据的属性
  const updatePanelItem = (idx: string, attrib: {}, isGroup) => {
    // 处理整组数据的更新;
    let idxList = [idx];
    if (isGroup) {
      idxList = R.compose(
        R.pluck('id'),
        R.filter((item) => [item.id, item.group].includes(idx)),
      )(panel);
    }

    dispatch({
      type: 'common/updatePanelAttrib',
      payload: {
        idx: idxList,
        attrib,
      },
    });
  };

  const handleClick = (data) => {
    let action = data.action;
    let idx = data.idx;
    handleAction(action, idx);
  };
  const handleAction = (action, arr: number[]) => {
    if (typeof arr === 'undefined') {
      return;
    } else if (typeof arr === 'number') {
      contextMenuHandler(action, arr);
      return;
    }
    arr.forEach((idx) => {
      contextMenuHandler(action, idx);
    });
  };

  const contextMenuHandler = (action, idx: number) => {
    let item = R.nth<IPanelConfig>(idx, showPanel);

    let index = showPanel[idx]?.id;

    switch (action) {
      case MENU_ACTIONS.TOP:
        idx > 0 && moveLayerItem(idx, 0);
        break;
      case MENU_ACTIONS.BOTTOM:
        idx >= 0 && idx < showPanel.length - 1 && moveLayerItem(idx, showPanel.length - 1);
        break;
      case MENU_ACTIONS.MOVE_PREV:
        if (idx > 0) {
          moveLayerItem(idx, idx - 1);
        }
        break;
      case MENU_ACTIONS.MOVE_NEXT:
        if (idx >= 0 && idx < showPanel.length - 1) {
          moveLayerItem(idx, idx + 1);
        }
        break;
      case MENU_ACTIONS.LOCK:
        let lock = item.lock || false;
        updatePanelItem(item.id, { lock: !lock }, item.key === GROUP_COMPONENT_KEY);
        break;
      case MENU_ACTIONS.HIDE:
        let hide = item.hide || false;
        updatePanelItem(item.id, { hide: !hide }, item.key === GROUP_COMPONENT_KEY);
        break;
      case MENU_ACTIONS.COPY:
        let prevIndex = R.findIndex(R.propEq('id', index))(panel);
        dispatch({
          type: 'common/copyPanel',
          payload: {
            idx: prevIndex,
          },
        });
        break;
      case MENU_ACTIONS.REMOVE:
        // 全局状态在父组件中更新；
        onRemove?.([index]);
        break;

      // TODO 组件收藏功能
      case MENU_ACTIONS.FAVORITE:
        message.success('该功能待添加。id:' + index);
        break;

      case MENU_ACTIONS.GROUP:
        // 暂不允许多重编组
        if (item.key === GROUP_COMPONENT_KEY) {
          return;
        }

        dispatch({
          type: 'common/addGroupPanel',
          payload: {
            panel: selectedPanel,
          },
        });
        break;
      case MENU_ACTIONS.UN_GROUP:
        dispatch({
          type: 'common/unGroup',
          payload: {
            id: index,
          },
        });
        break;
      default:
        break;
    }
  };

  const getDisabled = (item) => {
    let choosedItem: IPanelConfig;
    switch (item.action) {
      case MENU_ACTIONS.GROUP:
        return selected.length <= 1;
      case MENU_ACTIONS.UN_GROUP:
        // 当前选择项
        if (selected.length !== 1) {
          return true;
        }
        choosedItem = showPanel[selected[0]];
        if (choosedItem.key == GROUP_COMPONENT_KEY) {
          return false;
        }
        return typeof choosedItem.group !== 'string';
      case MENU_ACTIONS.TOP:
      case MENU_ACTIONS.MOVE_PREV:
        if (selected.length == 0) {
          return true;
        }
        return selected[0] == 0;

      case MENU_ACTIONS.BOTTOM:
      case MENU_ACTIONS.MOVE_NEXT:
        if (selected.length == 0) {
          return true;
        }
        return R.last(selected) == showPanel.length - 1;
    }
    return false;
  };

  // console.log(selectedPanel, selected, showPanel);

  return (
    <div
      className={classnames(styles['layer-panel-wp'], {
        [styles.hide]: hide.layer,
      })}
    >
      <div className={styles['layer-manager-top']}>
        <div className={styles['layer-num']}>图层</div>
        <div className={styles['layer-manager-layout-selector']}>
          <i
            className={classnames('datav-icon datav-font icon-logo', {
              [styles.selected]: isThumb,
            })}
            title="缩略图版"
            onClick={setIsThumb}
          />
          <i
            className={classnames('datav-icon datav-font icon-list', {
              [styles.selected]: !isThumb,
            })}
            title="文字版"
            onClick={setIsThumb}
          />
          <i
            className="datav-icon datav-font icon-back"
            onClick={() => {
              setHide({
                layer: !hide.layer,
              });
            }}
          />
        </div>
      </div>
      <div className={styles.toolbar}>
        <i
          className={classnames(
            'datav-icon datav-font icon-move-prev',
            styles['layer-toolbar-icon'],
            {
              [styles.enable]: selected.length > 0 && selected.join('') != panel[0]?.id,
            },
          )}
          title="上移一层"
          onClick={() => {
            handleAction(MENU_ACTIONS.MOVE_PREV, selected);
          }}
        />
        <i
          className={classnames(
            'datav-icon datav-font icon-move-next',
            styles['layer-toolbar-icon'],
            {
              [styles.enable]:
                selected.length > 0 && selected.join('') != panel[panel.length - 1]?.id,
            },
          )}
          title="下移一层"
          onClick={() => {
            handleAction(MENU_ACTIONS.MOVE_NEXT, selected);
          }}
        />
        <i
          className={classnames('datav-icon datav-font icon-to-top', styles['layer-toolbar-icon'], {
            [styles.enable]: selected.length > 0 && selected.join('') != panel[0]?.id,
          })}
          title="置顶"
          onClick={() => {
            handleAction(MENU_ACTIONS.TOP, selected);
          }}
        />
        <i
          className={classnames(
            'datav-icon datav-font icon-to-bottom',
            styles['layer-toolbar-icon'],
            {
              [styles.enable]:
                selected.length >= 0 && selected.join('') != panel[panel.length - 1]?.id,
            },
          )}
          title="置底"
          onClick={() => {
            handleAction(MENU_ACTIONS.BOTTOM, selected);
          }}
        />
      </div>

      <div className={styles.layerWrap}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div
                //provided.droppableProps应用的相同元素.
                {...provided.droppableProps}
                // 为了使 droppable 能够正常工作必须 绑定到最高可能的DOM节点中provided.innerRef.
                ref={provided.innerRef}
              >
                {showPanel.map((item, idx) => (
                  <Draggable key={item.id} draggableId={item.id} index={idx}>
                    {(provided, snapshot) => (
                      <li
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={classnames({
                          [styles.thumbnail]: isThumb,
                          [styles.locked]: item.lock,
                          [styles.hided]: item.hide,
                          [styles.selected]: selectedPanel.includes(item.id),
                          [styles.dragging]: snapshot.isDragging,
                          [styles.group_item]: item.group,
                        })}
                        onClick={(e) => {
                          const CTRL_CLICK = e.ctrlKey,
                            SHIFT_CLICK = e.shiftKey;
                          let nextPanel = [item.id];

                          if (CTRL_CLICK) {
                            nextPanel = !selectedPanel.includes(item.id)
                              ? [...selectedPanel, item.id]
                              : selectedPanel.filter((panelItem) => panelItem !== item.id);
                          } else if (SHIFT_CLICK) {
                            // DONE shift 连续选择的场景
                            console.log('shift被按下', selectedPanel);
                            if (selectedPanel.length === 0) {
                              message.error('请先选中一个组件');
                              return;
                            }
                            let id = R.findIndex(R.propEq('id', selectedPanel[0]))(showPanel);
                            let nextId = R.findIndex(R.propEq('id', item.id))(showPanel);
                            if (id === nextId) {
                              return;
                            }

                            let idList = [id, nextId].sort();
                            let idx = R.range(idList[0], idList[1] + 1);
                            nextPanel = R.compose(R.pluck('id'), R.values, R.pick(idx))(showPanel);
                          }

                          // 需处理分组的逻辑，存在互斥；
                          if (item.key == GROUP_COMPONENT_KEY) {
                            let childrenPanel = panel
                              .filter((panelItem) => panelItem.group == item.id)
                              .map((panelItem) => panelItem.id);
                            nextPanel = R.uniq([...nextPanel, ...childrenPanel]);
                          }

                          dispatch({
                            type: 'common/setStore',
                            payload: {
                              selectedPanel: nextPanel,
                            },
                          });
                        }}
                      >
                        <ContextMenuTrigger
                          id={MENU_TYPE}
                          holdToDisplay={1000}
                          idx={idx}
                          collect={(props) => props}
                        >
                          <LayerItem
                            isSelected={selectedPanel.join('') === item.id}
                            handleAction={(e) => handleAction(e, [idx])}
                            item={item}
                            isThumb={isThumb}
                            dispatch={dispatch}
                          />
                        </ContextMenuTrigger>
                      </li>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <div
          className={styles['last-flex-item']}
          onClick={() => {
            setSelected([]);
            dispatch({
              type: 'common/setStore',
              payload: {
                selectedPanel: [],
              },
            });
          }}
        />
      </div>

      <ContextMenu
        id={MENU_TYPE}
        onShow={(e) => {
          // 右键点击选中当前
          let id = e.detail.data.idx;

          // 当选中多个时或在当前选中项点击右键，不执行后续操作；
          if (selected.length > 1 || selected.join(',') == id) {
            return;
          }

          setSelected([id]);
          dispatch({
            type: 'common/setStore',
            payload: {
              selectedPanel: [showPanel[id].id],
            },
          });
        }}
      >
        {MENU_LIST.map((item) =>
          item.icon.includes('divider') ? (
            <div className="react-contextmenu-item--divider" key={item.icon} />
          ) : (
            <MenuItem
              className={classnames({ disabled: getDisabled(item) })}
              key={item.icon}
              onClick={(_, data) => {
                handleClick(data);
              }}
              data={{ action: item.action }}
            >
              <i className={`datav-icon datav-font ${item.icon}`} />
              {item.title}
            </MenuItem>
          ),
        )}
      </ContextMenu>
      <div className={classnames(styles['layer-toolbar'], styles['layer-toolbar-bottom'])}>
        <i
          className={classnames('datav-icon datav-font icon-group', {
            enable: selected.length > 1,
          })}
          title="编组"
          onClick={() => {
            selected.length > 1 && handleAction(MENU_ACTIONS.GROUP, selected);
          }}
        />
        <i
          className={classnames('datav-icon datav-font icon-delete', {
            enable: selected.length > 0,
          })}
          title="删除"
          onClick={() => {
            selected.length > 0 && handleAction(MENU_ACTIONS.REMOVE, selected);
          }}
        />
        <i
          className={classnames('datav-icon datav-font icon-lock', {
            enable: selected.length > 0,
          })}
          title="锁定"
          onClick={() => {
            selected.length > 0 && handleAction(MENU_ACTIONS.LOCK, selected);
          }}
        />
        <i
          className={classnames('datav-icon datav-font icon-hide', {
            enable: selected.length > 0,
          })}
          title="隐藏"
          onClick={() => {
            selected.length > 0 && handleAction(MENU_ACTIONS.HIDE, selected);
          }}
        />
      </div>
    </div>
  );
};

export default connect(({ common }: { common: ICommon }) => ({
  panel: common.panel,
  selectedPanel: common.selectedPanel,
}))(Index);
