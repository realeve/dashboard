import React, { useState } from 'react';
import styles from './layer.less';
import classnames from 'classnames';
import { useToggle } from 'react-use';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import * as R from 'ramda';
import { connect } from 'dva';
import { ICommon } from '@/models/common';

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
    title: '锁定',
    action: MENU_ACTIONS.LOCK,
    icon: 'icon-lock',
  },
  {
    title: '隐藏',
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

const Index = ({ setHide, hide, panel, dispatch, ...props }) => {
  const [isThumb, setIsThumb] = useToggle(true);

  const [selected, setSelected] = useState(-1);

  const onDragEnd = result => {
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
    setSelected(to);
  };

  const handleClick = (e, data, target) => {
    let action = data.action;
    let idx = data.idx;
    console.log({ action, idx, id: panel[idx].id });
  };

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
              [styles.enable]: selected > 0,
            },
          )}
          title="上移一层"
          onClick={() => {
            if (selected > 0) {
              moveLayerItem(selected, selected - 1);
            }
          }}
        />
        <i
          className={classnames(
            'datav-icon datav-font icon-move-next',
            styles['layer-toolbar-icon'],
            {
              [styles.enable]: selected >= 0 && selected < panel.length - 1,
            },
          )}
          title="下移一层"
          onClick={() => {
            if (selected >= 0 && selected < panel.length - 1) {
              moveLayerItem(selected, selected + 1);
            }
          }}
        />
        <i
          className={classnames('datav-icon datav-font icon-to-top', styles['layer-toolbar-icon'], {
            [styles.enable]: selected > 0,
          })}
          title="置顶"
          onClick={() => {
            if (selected > 0) {
              moveLayerItem(selected, 0);
            }
          }}
        />
        <i
          className={classnames(
            'datav-icon datav-font icon-to-bottom',
            styles['layer-toolbar-icon'],
            {
              [styles.enable]: selected >= 0 && selected < panel.length - 1,
            },
          )}
          title="置底"
          onClick={() => {
            if (selected >= 0 && selected < panel.length - 1) {
              moveLayerItem(selected, panel.length - 1);
            }
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
                          [styles.selected]: selected === idx,
                          [styles.dragging]: snapshot.isDragging,
                        })}
                        onClick={() => {
                          setSelected(idx);
                        }}
                      >
                        <ContextMenuTrigger
                          id={MENU_TYPE}
                          holdToDisplay={1000}
                          idx={idx}
                          collect={props => props}
                        >
                          {!isThumb ? (
                            <i className={item.icon} />
                          ) : (
                            <img src={item.image} alt={item.title} className={styles.img} />
                          )}

                          <div className={styles.text}>
                            <span>{item.title}</span>
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
            setSelected(-1);
          }}
        />
      </div>

      <ContextMenu id={MENU_TYPE} collect={props => props}>
        {MENU_LIST.map(item =>
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
        {/* <i
          className={classnames('datav-icon datav-font icon-group', {
            enable: selected > -1,
          })}
          title="成组"
        /> */}
        <i
          className={classnames('datav-icon datav-font icon-delete', {
            enable: selected > -1,
          })}
          title="删除"
          onClick={() => {
            dispatch({
              type: 'common/removePanel',
              payload: {
                idx: selected,
              },
            });
          }}
        />
        <i
          className={classnames('datav-icon datav-font icon-lock', {
            enable: selected > -1,
          })}
          title="锁定"
        />
        <i
          className={classnames('datav-icon datav-font icon-hide', {
            enable: selected > -1,
          })}
          title="隐藏"
        />
      </div>
    </div>
  );
};

export default connect(({ common }: { common: ICommon }) => ({ panel: common.panel }))(Index);
