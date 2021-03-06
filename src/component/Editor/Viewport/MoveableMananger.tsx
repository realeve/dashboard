import React, { Suspense } from 'react';
import type { MoveableManagerInterface } from 'react-moveable';
import { getContentElement, connectEditorProps, getId } from '../utils/utils';
import type Editor from '../Editor';
import type { EditorInterface } from '../types';
import type { IObject } from '@daybrush/utils';
import { diff } from '@egjs/list-differ';
import * as R from 'ramda';

const Moveable = React.lazy(() => import('react-moveable'));

// 每次旋转最小旋转度数；
const ROTATE_DEGREE = 5;

function restoreRender(id: string, state: IObject<any>, prevState: IObject<any>, editor: Editor) {
  const el = editor.viewport.current!.getElement(id);

  if (!el) {
    console.error('No Element');
    return false;
  }
  const { moveableData } = editor;
  const frame = moveableData.getFrame(el);

  frame.clear();
  frame.set(state);

  const result = diff(Object.keys(prevState), Object.keys(state));
  const { removed, prevList } = result;

  removed.forEach((index) => {
    el.style.removeProperty(prevList[index]);
  });
  moveableData.render(el);
  return true;
}
function undoRender({ id, prev, next }: IObject<any>, editor: Editor) {
  if (!restoreRender(id, prev, next, editor)) {
    return;
  }
  editor.moveableManager.current!.updateRect();
  editor.eventBus.trigger('render');
}
function redoRender({ id, prev, next }: IObject<any>, editor: Editor) {
  if (!restoreRender(id, next, prev, editor)) {
    return;
  }
  editor.moveableManager.current!.updateRect();
  editor.eventBus.trigger('render');
}
function undoRenders({ infos }: IObject<any>, editor: Editor) {
  infos.forEach(({ id, prev }: IObject<any>) => {
    restoreRender(id, prev, prev, editor);
  });
  editor.moveableManager.current!.updateRect();
  editor.eventBus.trigger('render');
}
function redoRenders({ infos }: IObject<any>, editor: Editor) {
  infos.forEach(({ id, next, prev }: IObject<any>) => {
    restoreRender(id, next, prev, editor);
  });
  editor.moveableManager.current!.updateRect();
  editor.eventBus.trigger('render');
}

export interface DimensionViewableProps {
  dimensionViewable?: boolean;
}
const DimensionViewable = {
  name: 'dimensionViewable',
  props: {
    dimensionViewable: Boolean,
  },
  events: {},
  render(moveable: MoveableManagerInterface) {
    const { left, top } = moveable.state;

    const rect = moveable.getRect();

    return (
      <div
        key={'dimension-viewer'}
        className={'moveable-dimension'}
        style={{
          left: `${rect.left + rect.width / 2 - left}px`,
          top: `${rect.top + rect.height + 20 - top}px`,
        }}
      >
        {Math.round(rect.offsetWidth)} x {Math.round(rect.offsetHeight)}
      </div>
    );
  },
};
@connectEditorProps
export default class MoveableManager extends React.PureComponent<{
  editor: Editor;
  selectedTargets: (HTMLElement | SVGElement)[];
  selectedMenu: string;
  verticalGuidelines: number[];
  horizontalGuidelines: number[];
  onChange?: (name: { id: string; next: Record<string, unknown> }[]) => void;
}> {
  public moveable = React.createRef<typeof Moveable>();
  public getMoveable() {
    return this.moveable.current!;
  }
  public render() {
    const {
      editor,
      verticalGuidelines,
      horizontalGuidelines,
      selectedTargets,
      selectedMenu,
    } = this.props;

    if (!selectedTargets.length) {
      return this.renderViewportMoveable();
    }
    const { moveableData, keyManager, eventBus, selecto, memory } = editor;
    const elementGuidelines = [...moveableData.getTargets()].filter((el) => {
      return selectedTargets.indexOf(el) === -1;
    });
    const isShift = keyManager.shiftKey;

    return (
      <Suspense fallback={null}>
        <Moveable
          ables={[DimensionViewable]}
          ref={this.moveable}
          targets={selectedTargets}
          dimensionViewable={true}
          draggable={true}
          resizable={true}
          originDraggable={true}
          originRelative={true}
          origin={true}
          onDragOriginStart={moveableData.onDragOriginStart}
          onDragOrigin={moveableData.onDragOrigin}
          throttleResize={1}
          clippable={false}
          dragArea={selectedTargets.length > 1}
          passDragArea={selectedMenu === 'Text'}
          checkInput={selectedMenu === 'Text'}
          throttleDragRotate={isShift ? 45 : 0}
          keepRatio={isShift}
          rotatable={true}
          snappable={true}
          snapCenter={true}
          snapGap={false}
          roundable={false}
          verticalGuidelines={verticalGuidelines}
          horizontalGuidelines={horizontalGuidelines}
          elementGuidelines={elementGuidelines}
          clipArea={false}
          onDragStart={moveableData.onDragStart}
          onDrag={moveableData.onDrag}
          onDragGroupStart={moveableData.onDragGroupStart}
          onDragGroup={moveableData.onDragGroup}
          onScaleStart={moveableData.onScaleStart}
          onScale={moveableData.onScale}
          onScaleGroupStart={moveableData.onScaleGroupStart}
          onScaleGroup={moveableData.onScaleGroup}
          onResizeStart={moveableData.onResizeStart}
          onResize={moveableData.onResize}
          onResizeGroupStart={moveableData.onResizeGroupStart}
          onResizeGroup={moveableData.onResizeGroup}
          onRotateStart={moveableData.onRotateStart}
          onRotate={(e) => {
            const rotate =
              (Math.floor(
                (e.beforeRotate >= 0 ? e.beforeRotate : e.beforeRotate + 360) / ROTATE_DEGREE,
              ) *
                ROTATE_DEGREE) %
              360;

            moveableData.onRotate({
              ...e,
              rotate,
              beforeRotate: rotate,
            });
          }}
          onRotateGroupStart={moveableData.onRotateGroupStart}
          onRotateGroup={moveableData.onRotateGroup}
          defaultClipPath={memory.get('crop') || 'inset'}
          onClip={moveableData.onClip}
          onDragOriginStart={moveableData.onDragOriginStart}
          onDragOrigin={moveableData.onDragOrigin}
          onRound={moveableData.onRound}
          onClick={(e) => {
            // 双击时编辑文字
            const target = e.inputTarget as any;
            if (e.isDouble && target.isContentEditable) {
              editor.selectMenu('Text');
              const el = getContentElement(target);
              el?.focus();
            }
          }}
          onClickGroup={(e) => {
            selecto.current!.clickTarget(e.inputEvent, e.inputTarget);
          }}
          onRenderStart={(e) => {
            e.datas.prevData = moveableData.getFrame(e.target).get();
          }}
          onRender={(e) => {
            e.datas.isRender = true;
            eventBus.requestTrigger('render');
          }}
          onRenderEnd={(e) => {
            eventBus.requestTrigger('render');

            if (!e.datas.isRender) {
              return;
            }
            const next = R.clone(moveableData.getFrame(e.target).get());

            const item = {
              id: getId(e.target),
              next,
            };

            this.props.onChange?.([item]);
            this.historyManager.addAction('render', {
              ...item,
              prev: e.datas.prevData,
            });
          }}
          onRenderGroupStart={(e) => {
            e.datas.prevDatas = e.targets.map((target) => moveableData.getFrame(target).get());
          }}
          onRenderGroup={(e) => {
            eventBus.requestTrigger('renderGroup', e);
            e.datas.isRender = true;
          }}
          onRenderGroupEnd={(e) => {
            eventBus.requestTrigger('renderGroup', e);

            if (!e.datas.isRender) {
              return;
            }
            const { prevDatas } = e.datas;
            const infos = e.targets.map((target, i) => {
              return {
                id: getId(target),
                prev: prevDatas[i],
                next: moveableData.getFrame(target).get(),
              };
            });

            this.props.onChange?.(infos.map(({ id, next }) => ({ id, next })));
            this.historyManager.addAction('renders', {
              infos,
            });
          }}
        />
      </Suspense>
    );
  }
  public renderViewportMoveable() {
    // const viewport = this.editor.getViewport();
    // const target = viewport ? viewport.viewportRef.current! : null;

    return (
      <Suspense fallback={null}>
        <Moveable
          ref={this.moveable} // target={target}
        />
      </Suspense>
    );
  }
  public componentDidMount() {
    this.historyManager.registerType('render', undoRender, redoRender);
    this.historyManager.registerType('renders', undoRenders, redoRenders);
    this.keyManager.keydown(['shift'], () => {
      this.forceUpdate();
    });
    this.keyManager.keyup(['shift'], () => {
      this.forceUpdate();
    });
  }
  public updateRect() {
    this.getMoveable().updateRect();
  }
}

export interface IMoveableManager extends EditorInterface {}
