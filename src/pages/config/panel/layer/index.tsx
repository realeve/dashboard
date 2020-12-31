import React, { useState, useEffect } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import { useToggle } from 'react-use';
import * as R from 'ramda';
import type { ICommon, IPanelConfig, IHistoryProps } from '@/models/common';
import { GROUP_COMPONENT_KEY } from '@/models/common';
import type { TFnHide, IHideProps } from '../setting';

import { message } from 'antd';
import type { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { reorder, MENU_ACTIONS, MENU_LIST, MENU_TYPE, reorderPanel, getShowedPanel } from './lib';

import { LayerItem } from './LayerItem';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';

export { reorder, MENU_ACTIONS, MENU_LIST, MENU_TYPE, reorderPanel, getShowedPanel } from './lib';

// 无法按此方式引用
// const { DragDropContext, Droppable, Draggable } = React.lazy(() => import('react-beautiful-dnd'));
// const { ContextMenu, MenuItem, ContextMenuTrigger } = React.lazy(() => import('react-contextmenu'));

type ILayerProps = {
  setHide: TFnHide;
  panel: IPanelConfig[];
  selectedPanel: string[];
  onRemove: (e: string[]) => void;
  dispatch: Dispatch;
  className: string;
  hide: IHideProps;
  [key: string]: any;
} & IHistoryProps;
const Index = ({
  hide,
  setHide,
  selectedPanel,
  onRemove,
  dispatch,
  className,
  history,
  curHistoryIdx,
  panel: _panel,
}: // DragDropContext,
// Droppable,
// Draggable,
// ContextMenu,
// MenuItem,
// ContextMenuTrigger,
ILayerProps) => {
  const panel = history[curHistoryIdx]?.panel || _panel;
  const [isThumb, setIsThumb] = useToggle(true);

  const [selected, setSelected] = useState<number[]>([]);

  const getSelectedIdx = (selectedPanel) => {
    const _selected = [];
    showPanel.forEach((item, idx) => {
      if (selectedPanel.includes(item.id)) {
        _selected.push(idx);
      }
    });
    return _selected;
  };

  const [showPanel, setShowPanel] = useState<IPanelConfig[]>([]);

  useEffect(() => {
    const nextPanel = getShowedPanel(panel);
    setShowPanel(nextPanel);
  }, [panel]);

  useEffect(() => {
    const _selected = getSelectedIdx(selectedPanel);
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
    // 需要对被分组且被展开的组件排序，保证组名在上，其次才是里面的内容；
    // 跨组件移动,需要判断目标组件是否被分组，如果是则合并分组

    // 拖动分组组件
    const isDragingGroupRect = showPanel[from].key === GROUP_COMPONENT_KEY;
    // console.log(JSON.stringify(showPanel[from]), JSON.stringify(showPanel[to]));
    if (showPanel[to].group) {
      // 2020-11-12 此处需要判断对应的类型是否为分组，暂时不支持多层分组；取消此处即可打开，但需要处理点击页面时父组件的选择；
      if (isDragingGroupRect) {
        return;
      }
      // console.log(panel[from]);
      const _nextPanel = R.clone(panel);
      _nextPanel[from].group = _nextPanel[to].group;
      const distPanel = reorder(_nextPanel, from, to);

      dispatch({
        type: 'common/updatePanel',
        payload: {
          panel: distPanel,
          recordHistory: true,
          historyTitle: `调整组件层级 - ${distPanel[0].title}`,
        },
      });
      return;
    }

    const items: IPanelConfig[] = reorder(showPanel, from, to);
    const _groupPanel = R.filter<IPanelConfig>(R.propEq<string>('key', GROUP_COMPONENT_KEY))(items);
    const groupPanels = R.pluck('id', _groupPanel);

    let groupId = null;
    const distId = items[to].id;
    const groupItem = items[to].group;
    // 处理将图层拖入分组的场景；
    if (to > 1) {
      const prevItem = items[to - 1];
      // 更新groupId
      groupId = prevItem.key === GROUP_COMPONENT_KEY ? prevItem.id : prevItem.group || null;
    }

    // 不包含子元素的列表
    const _panel = R.reject<IPanelConfig>((item) => groupPanels.includes(item.group))(items);

    // 最终结果
    let _nextPanel: IPanelConfig[] = [];

    _panel.forEach((item: IPanelConfig) => {
      if (distId === item.id && groupId && item.key !== GROUP_COMPONENT_KEY) {
        item.group = groupId;
      }
      if (item.key === GROUP_COMPONENT_KEY) {
        // 处理组内移动
        const childrenPanel: IPanelConfig[] = R.filter(R.propEq<string>('group', item.id))(
          groupItem === item.id ? items : panel,
        ) as IPanelConfig[];
        _nextPanel = [..._nextPanel, item, ...childrenPanel];
      } else {
        _nextPanel.push(item);
      }
    });

    dispatch({
      type: 'common/updatePanel',
      payload: {
        panel: _nextPanel,
        recordHistory: true,
        historyTitle: `调整组件层级 - ${_nextPanel[0].title}`,
      },
    });
    setSelected([to]);
  };

  // 更新第idx个数据的属性
  const updatePanelItem = (idx: string, attrib: {}, isGroup) => {
    // 处理整组数据的更新;
    let idxList = [idx];
    if (isGroup) {
      const childrenPanel = R.filter<IPanelConfig>((item) => [item.id, item.group].includes(idx))(
        panel,
      );
      idxList = R.pluck('id', childrenPanel);
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
    const { action } = data;
    const { idx } = data;
    handleAction(action, idx);
  };
  const handleAction = (action, arr: number[]) => {
    if (typeof arr === 'undefined') {
      return;
    }
    if (typeof arr === 'number') {
      contextMenuHandler(action, arr);
      return;
    }
    arr.forEach((idx) => {
      contextMenuHandler(action, idx);
    });
  };

  const contextMenuHandler = (action, idx: number) => {
    const item = R.nth<IPanelConfig>(idx, showPanel);

    const index = showPanel[idx]?.id;

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
        const lock = item.lock || false;
        updatePanelItem(item.id, { lock: !lock }, item.key === GROUP_COMPONENT_KEY);
        break;
      case MENU_ACTIONS.HIDE:
        const hide = item.hide || false;
        updatePanelItem(item.id, { hide: !hide }, item.key === GROUP_COMPONENT_KEY);
        break;
      case MENU_ACTIONS.COPY:
        const prevIndex = R.findIndex(R.propEq('id', index))(panel);
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

      // 组件收藏功能（暂时不做）
      // case MENU_ACTIONS.FAVORITE:
      //   message.success('该功能待添加。id:' + index);
      //   break;

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
        if (selected.length === 0) {
          return true;
        }
        choosedItem = showPanel[selected[0]];
        if (choosedItem.key === GROUP_COMPONENT_KEY) {
          return false;
        }
        return typeof choosedItem.group !== 'string';
      case MENU_ACTIONS.TOP:
      case MENU_ACTIONS.MOVE_PREV:
        if (selected.length === 0) {
          return true;
        }
        return selected[0] === 0;

      case MENU_ACTIONS.BOTTOM:
      case MENU_ACTIONS.MOVE_NEXT:
        if (selected.length === 0) {
          return true;
        }
        return R.last(selected) === showPanel.length - 1;
    }
    return false;
  };

  // console.log(selectedPanel, selected, showPanel);

  return (
    <div className={classnames(styles['layer-panel-wp'], className)}>
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
                // provided.droppableProps应用的相同元素.
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
                          const CTRL_CLICK = e.ctrlKey;
                          const SHIFT_CLICK = e.shiftKey;
                          let nextPanel = [item.id];

                          if (CTRL_CLICK) {
                            nextPanel = !selectedPanel.includes(item.id)
                              ? [...selectedPanel, item.id]
                              : selectedPanel.filter((panelItem) => panelItem !== item.id);
                          } else if (SHIFT_CLICK) {
                            // DONE shift 连续选择的场景
                            // console.log('shift被按下', selectedPanel);
                            if (selectedPanel.length === 0) {
                              message.error('请先选中一个组件');
                              return;
                            }
                            const id = R.findIndex(R.propEq('id', selectedPanel[0]))(showPanel);
                            const nextId = R.findIndex(R.propEq('id', item.id))(showPanel);
                            if (id === nextId) {
                              return;
                            }

                            const idList = [id, nextId].sort();
                            const _panels = R.slice(idList[0], idList[1] + 1)(showPanel);
                            nextPanel = R.pluck('id', _panels);
                          }

                          // 需处理分组的逻辑，存在互斥；
                          if ((item.key = GROUP_COMPONENT_KEY)) {
                            const childrenPanel = panel
                              .filter((panelItem) => panelItem.group === item.id)
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
          const id = e.detail.data.idx;

          // 当选中多个时或在当前选中项点击右键，不执行后续操作；
          if (selected.length > 1 || selected.join(',') === id) {
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
          className={classnames('datav-icon datav-font icon-refresh refresh-btn', {
            enable: panel.length > 1,
          })}
          title="整理面板"
          onClick={() => {
            const nextPanel = reorderPanel(panel);
            dispatch({
              type: 'common/updatePanel',
              payload: {
                panel: nextPanel,
                recordHistory: true,
                historyTitle: `整理面板 - ${nextPanel[0].title}`,
              },
            });
          }}
        />

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
export default connect(({ common }: { common: ICommon }) => common)(Index);
