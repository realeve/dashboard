import React, { useState, useEffect } from 'react';
import styles from './layer.less';
import classnames from 'classnames';
import { useToggle } from 'react-use';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import * as R from 'ramda';
import { connect } from 'dva';
import { ICommon, IPanelConfig } from '@/models/common';

// contextmenu 右键菜单
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';

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
  RENAME,
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
    title: '重命名',
    action: MENU_ACTIONS.RENAME,
    icon: 'icon-edit',
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

const Index = ({ setHide, hide, panel, selectedPanel, onRemove, dispatch, ...props }) => {
  const [isThumb, setIsThumb] = useToggle(true);

  const [selected, setSelected] = useState<number[]>([]);

  const getSelectedIdx = (selectedPanel) => {
    let _selected = [];
    panel.forEach((item, idx) => {
      if (selectedPanel.includes(item.id)) {
        _selected.push(idx);
      }
    });
    return _selected;
  };

  useEffect(() => {
    let _selected = getSelectedIdx(selectedPanel);
    setSelected(_selected);
  }, [selectedPanel.join('')]);

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
    const items = reorder(panel, from, to);
    dispatch({
      type: 'common/updatePanel',
      payload: {
        panel: items,
      },
    });
    setSelected([to]);
  };

  // 更新第idx个数据的属性
  const updatePanelItem = (idx: string, attrib: {}) => {
    dispatch({
      type: 'common/updatePanelAttrib',
      payload: {
        idx,
        attrib,
      },
    });
  };

  const handleClick = (_, data) => {
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
    let item = R.nth<IPanelConfig>(idx, panel);
    console.log(item, idx);
    switch (action) {
      case MENU_ACTIONS.TOP:
        idx > 0 && moveLayerItem(idx, 0);
        break;
      case MENU_ACTIONS.BOTTOM:
        idx >= 0 && idx < panel.length - 1 && moveLayerItem(idx, panel.length - 1);
        break;
      case MENU_ACTIONS.MOVE_PREV:
        if (idx > 0) {
          moveLayerItem(idx, idx - 1);
        }
        break;
      case MENU_ACTIONS.MOVE_NEXT:
        if (idx >= 0 && idx < panel.length - 1) {
          moveLayerItem(idx, idx + 1);
        }
        break;
      case MENU_ACTIONS.LOCK:
        let lock = item.lock || false;
        updatePanelItem(item.id, { lock: !lock });
        break;
      case MENU_ACTIONS.HIDE:
        let hide = item.hide || false;
        updatePanelItem(item.id, { hide: !hide });
        break;
      case MENU_ACTIONS.RENAME:
        console.log('该功能待添加');
        break;
      case MENU_ACTIONS.COPY:
        dispatch({
          type: 'common/copyPanel',
          payload: {
            idx,
          },
        });
        break;
      case MENU_ACTIONS.REMOVE:
        // 全局状态在父组件中更新；
        onRemove?.([panel[idx]?.id]);
        break;
      case MENU_ACTIONS.FAVORITE:
        console.log('该功能待添加');
        break;
      default:
        break;
    }
  };

  // const [panelList, setPanelList] = useState([]);

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
                {panel.map((item, idx) => (
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
                          [styles.selected]: selected.includes(idx),
                          [styles.dragging]: snapshot.isDragging,
                        })}
                        onClick={(e) => {
                          const CTRL_CLICK = e.ctrlKey,
                            SHIFT_CLICK = e.shiftKey;
                          if (CTRL_CLICK) {
                            let nextPanel = !selectedPanel.includes(item.id)
                              ? [...selectedPanel, item.id]
                              : selectedPanel.filter((panelItem) => panelItem !== item.id);
                            // setPanelList(nextPanel);
                            dispatch({
                              type: 'common/setStore',
                              payload: {
                                selectedPanel: nextPanel,
                              },
                            });
                            // let _selected = getSelectedIdx(nextPanel);
                            // setSelected(_selected);
                            return;
                          }
                          if (SHIFT_CLICK) {
                            console.log('shift被按下');
                            return;
                          }

                          dispatch({
                            type: 'common/setStore',
                            payload: {
                              selectedPanel: [item.id],
                            },
                          });
                        }}
                        // onKeyUp={(e) => {
                        //   const CTRL_CLICK = e.key === 'Control',
                        //     SHIFT_CLICK = e.key === 'Shift';
                        //   if (CTRL_CLICK) {
                        //     // dispatch({
                        //     //   type: 'common/setStore',
                        //     //   payload: {
                        //     //     selectedPanel: panelList,
                        //     //   },
                        //     // });
                        //     setPanelList([]);
                        //   } else if (SHIFT_CLICK) {
                        //   }
                        // }}
                      >
                        <ContextMenuTrigger
                          id={MENU_TYPE}
                          holdToDisplay={1000}
                          idx={idx}
                          collect={(props) => props}
                        >
                          {!isThumb ? (
                            <i className={item.icon} />
                          ) : (
                            <img src={item.image} alt={item.title} className={styles.img} />
                          )}

                          <div className={styles.text}>
                            <span>{item.componentConfig.imgname || item.title}</span>
                          </div>
                          <div
                            className={classnames({
                              [styles['layer-thumbail-item']]: item.lock || !item.show,
                            })}
                          >
                            {item.hide && <i className="lock-toggle-btn datav-font icon-hide" />}
                            {item.lock && <i className="lock-toggle-btn datav-font icon-lock" />}
                          </div>
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
          setSelected([e.detail.data.idx]);
        }}
      >
        {MENU_LIST.map((item) =>
          item.icon.includes('divider') ? (
            <div className="react-contextmenu-item--divider" key={item.icon} />
          ) : (
            <MenuItem key={item.icon} onClick={handleClick} data={{ action: item.action }}>
              <i className={`datav-icon datav-font ${item.icon}`} />
              {item.title}
            </MenuItem>
          ),
        )}
      </ContextMenu>
      <div className={classnames(styles['layer-toolbar'], styles['layer-toolbar-bottom'])}>
        <i
          className={classnames('datav-icon datav-font icon-group', {
            enable: selected.length > 0,
          })}
          title="成组"
        />
        <i
          className={classnames('datav-icon datav-font icon-delete', {
            enable: selected.length > 0,
          })}
          title="删除"
          onClick={() => {
            handleAction(MENU_ACTIONS.REMOVE, selected);
          }}
        />
        <i
          className={classnames('datav-icon datav-font icon-lock', {
            enable: selected.length > 0,
          })}
          title="锁定"
          onClick={() => {
            handleAction(MENU_ACTIONS.LOCK, selected);
          }}
        />
        <i
          className={classnames('datav-icon datav-font icon-hide', {
            enable: selected.length > 0,
          })}
          title="隐藏"
          onClick={() => {
            handleAction(MENU_ACTIONS.HIDE, selected);
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
