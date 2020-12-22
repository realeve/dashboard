import * as React from 'react';
import InfiniteViewer, { OnScroll } from './react-infinite-viewer';
// import Guides from '@scena/react-guides';

import Guides from '@/component/react-guides';

import Selecto from './react-selecto';
import './Editor.less';
import Viewport, { ElementInfo, MovedInfo, MovedResult } from './Viewport/Viewport';
import { prefix, getIds, checkImageLoaded, getScenaAttrs, IGuideProps } from './utils/utils';

import EventBus from './utils/EventBus';
import { IObject } from '@daybrush/utils';
import Memory from './utils/Memory';
import MoveableManager from './Viewport/MoveableMananger';
import MoveableData from './utils/MoveableData';
import KeyManager from './KeyManager/KeyManager';
import { ScenaEditorState, SavedScenaData, ScenaJSXType, TQuickTool } from './types';
import HistoryManager from './utils/HistoryManager';
import Debugger from './utils/Debugger';
import { isMacintosh, DATA_SCENA_ELEMENT_ID } from './consts';
import ClipboardManager from './utils/ClipboardManager';
import { generateId, guideDb, calcDefaultGuidline } from './utils/utils';
import classnames from 'classnames';
import * as R from 'ramda';
import assets from '@/component/widget/assets';
import { IPage } from '@/models/common';
import { Dispatch } from 'redux';
import fileSaver from 'file-saver';
import { getDefaultStyle } from './lib';
import { isColor } from '@/component/chartItem/option/lib';

const backgroundStyle = { backgroundRepeat: 'repeat', backgroundPosition: 'top center' }; // backgroundRepeat: 'no-repeat',
export const getDashboardStyle = (page: { width: string; height: string; background: string }) => {
  let url = page.background
    ? assets.backgrounds[page.background].url
    : 'url(/img/panel/panelbg.png)';
  let background = isColor(url)
    ? { background: url }
    : {
        backgroundImage: page.background
          ? `url('${assets.backgrounds[page.background].url}')`
          : 'url(/img/panel/panelbg.png)',
        backgroundSize: 'cover',
        ...backgroundStyle,
      };

  return {
    width: `${page.width}px`,
    height: `${page.height}px`,
    ...background,
  };
};

const edgeConfig = {
  zoom60: 50,
  zoom70: 56,
  zoom80: 60,
  zoom90: 64,
  zoom100: 70,
  zoom110: 72,
  zoom120: 74,
  zoom130: 76,
  zoom140: 78,
  zoom150: 80,
};

function undoCreateElements({ infos, prevSelected }: IObject<any>, editor: Editor) {
  const res = editor.removeByIds(
    infos.map((info: ElementInfo) => info.id),
    true,
  );

  if (prevSelected) {
    res.then(() => {
      editor.setSelectedTargets(editor.getViewport().getElements(prevSelected), true);
    });
  }
}
function restoreElements({ infos }: IObject<any>, editor: Editor) {
  editor.appendJSXs(
    infos.map((info: ElementInfo) => ({
      ...info,
    })),
    true,
  );
}
function undoSelectTargets({ prevs, nexts }: IObject<any>, editor: Editor) {
  editor.setSelectedTargets(editor.viewport.current!.getElements(prevs), true);
}
function redoSelectTargets({ prevs, nexts }: IObject<any>, editor: Editor) {
  editor.setSelectedTargets(editor.viewport.current!.getElements(nexts), true);
}
function undoChangeText({ prev, next, id }: IObject<any>, editor: Editor) {
  const info = editor.getViewport().getInfo(id)!;
  info.innerText = prev;
  info.el!.innerText = prev;
}
function redoChangeText({ prev, next, id }: IObject<any>, editor: Editor) {
  const info = editor.getViewport().getInfo(id)!;
  info.innerText = next;
  info.el!.innerText = next;
}
function undoMove({ prevInfos }: MovedResult, editor: Editor) {
  editor.moves(prevInfos, true);
}
function redoMove({ nextInfos }: MovedResult, editor: Editor) {
  editor.moves(nextInfos, true);
}

export const calcDragPos = (
  left: number,
  top: number,
  canvasSize: {
    width: string;
    height: string;
  },
) => {
  const init = { x: -105, y: -105 };
  const delta = { x: left - init.x, y: top - init.y };
  return {
    x: (delta.x / Number(canvasSize.width)) * 100,
    y: (delta.y / Number(canvasSize.height)) * 100,
  };
};

export interface IEditorProps {
  // width: string;
  // height: string;
  // background?: string;
  page: IPage;
  debug?: boolean;
  style?: React.CSSProperties;

  dispatch: Dispatch;

  // 缩放系数
  zoom?: number;

  curTool?: TQuickTool;
  setCurTool?: (e: TQuickTool) => void;

  // DOM变更时，hash值变更，重新计算偏移量
  domHash?: string;

  lockedPanel: string[];

  // 缩放回调
  onZoom?: (e: number) => void;

  // 选中元素
  onSelect?: (name: string[]) => void;

  // 计算选中元素
  calcNextSelectedPanel: (name: string[]) => string[];

  // 移除元素
  onRemove?: (name: string[]) => void;

  // 元素属性变更
  onChange?: (name: { id: string; next: {} }[]) => void;

  // 辅助线变更
  onGuidesChange?: (e: IGuideProps) => void;

  // 画面拖动
  onDrag?: (e: { x: number; y: number }) => void;

  // 粘贴
  onPaste: (e: string[]) => void;

  selectMenu?: React.Dispatch<React.SetStateAction<TQuickTool>>;
}
/**
 * @param page 全局page设置
 * @param debug 调试模式
 * @param style 样式
 * @param domHash 页面变更hash值，该值变更时需要重新计算偏移;
 * @param zoom 缩放系数
 * @param lockedPanel 被锁定的组件
 * @param onZoom 缩放回调
 * @param onSelect 选中元素
 * @param onRemove 移除元素
 * @param onChange 元素属性变更
 * @param onDrag 拖动画布
 * @param selectMenu 选择菜单
 */
class Editor extends React.PureComponent<IEditorProps, Partial<ScenaEditorState>> {
  public state: ScenaEditorState = {
    selectedTargets: [],
    horizontalGuides: [],
    verticalGuides: [],
    zoom: this.props.zoom || 1,
    rectOffset: {
      x: 0,
      y: 0,
    },
    guideVisible: true,
  };
  public historyManager = new HistoryManager(this);
  public console = new Debugger(this.props.debug);
  public eventBus = new EventBus();
  public memory = new Memory();
  public moveableData = new MoveableData(this.memory);
  public keyManager = new KeyManager(this.console);
  public clipboardManager = new ClipboardManager(this);

  public horizontalGuides = React.createRef<Guides>();
  public verticalGuides = React.createRef<Guides>();
  public infiniteViewer = React.createRef<InfiniteViewer>();
  public selecto = React.createRef<Selecto>();
  public moveableManager = React.createRef<MoveableManager>();
  public viewport = React.createRef<Viewport>();

  public editorElement = React.createRef<HTMLDivElement>();

  // 获取编辑器相对于屏幕的位置
  public getEditorPosition = () => {
    let rect = this.editorElement.current.getBoundingClientRect();
    let rectOffset = {
      x: rect.x,
      y: rect.y,
    };
    this.setState({
      rectOffset,
    });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.domHash !== nextProps.domHash) {
      // hash变更
      this.getEditorPosition();
      return;
    }

    if (this.props.curTool !== nextProps.curTool) {
      if (nextProps.curTool === 'home') {
        this.infiniteViewer.current!.scrollCenter();
      }
    }

    if (this.props.zoom != nextProps.zoom) {
      this.setState({ zoom: nextProps.zoom });
    }
  }

  componentWillMount() {
    setTimeout(async () => {
      // 载入辅助线
      let initGuides: IGuideProps = await guideDb.load(this.props.page);
      this.setState({
        horizontalGuides: initGuides.h,
        verticalGuides: initGuides.v,
      });

      this.horizontalGuides?.current?.loadGuides(initGuides.h);
      this.verticalGuides?.current?.loadGuides(initGuides.v);

      this.props.onGuidesChange?.(initGuides);
    }, 0);
  }

  toggleGuides = () => {
    const { horizontalGuides, verticalGuides } = this;
    const prevVisible = this.state.guideVisible;
    horizontalGuides.current.loadGuides(prevVisible ? [] : this.state.horizontalGuides);
    verticalGuides.current.loadGuides(prevVisible ? [] : this.state.verticalGuides);
    this.setState((preState) => ({
      guideVisible: !preState.guideVisible,
    }));
  };

  public selectMenu(menu: TQuickTool) {
    this.props.selectMenu(menu);
  }

  public async getThumbnail(scale: number, quality = 0.8, filename = null) {
    let canvasEl = this.viewport.current.viewport.el;
    return import('html2canvas').then(({ default: html2canvas }) =>
      html2canvas(canvasEl, {
        backgroundColor: null,
        scale,
      }).then((canvas) => {
        /* canvas.toBlob 对于各个浏览器有兼容问题. ie会报错没有toBlob对象
         * 解决方式：引入canvas-toBlob.js（https://github.com/eligrey/canvas-toBlob.js/blob/master/canvas-toBlob.js）
         * */
        if (filename) {
          canvas.toBlob(function (blob) {
            fileSaver.saveAs(blob, filename + '.jpg');
          });
          return;
        }

        return canvas.toDataURL('image/jpeg', quality);
      }),
    );
  }

  // 更新缩略图
  public updateThumbnail = () => {
    this.getThumbnail(0.1 / this.state.zoom).then((thumbnail) => {
      // 更新缩略图
      this.props.dispatch({
        type: 'common/updatePage',
        payload: {
          page: {
            thumbnail,
          },
        },
      });
    });
  };

  public render() {
    const {
      horizontalGuides,
      verticalGuides,
      infiniteViewer,
      moveableManager,
      viewport,
      selecto,
      state,
    } = this;
    const { selectedTargets, zoom, guideVisible } = state;

    const defaultGuides = calcDefaultGuidline(this.props.page);

    const { curTool: selectedMenu } = this.props;
    const { width, height } = this.props.page;
    const horizontalSnapGuides = [
      // 0,
      // Number(height),
      // Number(height) / 2,
      ...defaultGuides.h,
      ...(state.horizontalGuides || []),
    ];
    const verticalSnapGuides = [
      // 0,
      // Number(width),
      // Number(width) / 2,
      ...defaultGuides.v,
      ...(state.verticalGuides || []),
    ];
    let unit = 50;

    if (zoom < 0.8) {
      unit = Math.floor(1 / zoom) * 50;
    }

    const GuideStyle = {
      backgroundColor: '#0e1013',
      lineColor: '#364152',
      textColor: '#808e9b',
      unit: 100,
      dragPosFormat: (e) => e - 44,
    };

    return (
      <div
        className={classnames(prefix('editor'), {
          [prefix('hand')]: selectedMenu === 'hand',
        })}
        style={this.props.style}
        ref={this.editorElement}
      >
        <div
          className={prefix('reset')}
          onClick={() => {
            this.toggleGuides();
          }}
        >
          <i
            className={`datav-icon datav-font icon-line-${guideVisible ? 'show' : 'hide'}`}
            style={{ zIndex: 10 }}
          />
        </div>
        <Guides
          ref={horizontalGuides}
          type="horizontal"
          className={prefix('guides', 'horizontal')}
          {...GuideStyle}
          snapThreshold={5}
          snaps={horizontalSnapGuides}
          displayDragPos={true}
          zoom={zoom}
          unit={unit}
          dragPosFormat={(e) => e}
          onChangeGuides={({ guides: h }) => {
            const next = { v: this.state.verticalGuides, h };
            guideDb.save(next);
            this.setState({
              horizontalGuides: h,
            });
            this.props.onGuidesChange?.(next);
          }}
        />
        <Guides
          ref={verticalGuides}
          type="vertical"
          className={prefix('guides', 'vertical')}
          snapThreshold={5}
          snaps={verticalSnapGuides}
          {...GuideStyle}
          displayDragPos={true}
          zoom={zoom}
          unit={unit}
          dragPosFormat={(e) => e}
          onChangeGuides={({ guides: v }) => {
            const next = { h: this.state.horizontalGuides, v };
            guideDb.save(next);
            this.setState({
              verticalGuides: v,
            });
            this.props.onGuidesChange?.(next);
          }}
        />
        <InfiniteViewer
          ref={infiniteViewer}
          className={prefix('viewer')}
          usePinch={true}
          threshold={100}
          pinchThreshold={50}
          zoom={zoom}
          allowWheel={false}
          onZoom={this.props.onZoom}
          zoomRange={[0.3, 1.5]}
          onAbortPinch={(e) => {
            selecto.current!.triggerDragStart(e.inputEvent);
          }}
          onScroll={(e: OnScroll) => {
            horizontalGuides.current!.scroll(e.scrollLeft);
            horizontalGuides.current!.scrollGuides(e.scrollTop);

            verticalGuides.current!.scroll(e.scrollTop);
            verticalGuides.current!.scrollGuides(e.scrollLeft);
          }}
          onPinch={(e) => {
            this.setState({
              zoom: e.zoom,
            });
          }}
        >
          <Viewport ref={viewport} style={getDashboardStyle(this.props.page)}>
            <MoveableManager
              ref={moveableManager}
              selectedTargets={selectedTargets}
              verticalGuidelines={verticalSnapGuides}
              horizontalGuidelines={horizontalSnapGuides}
              editor={this}
              onChange={(e) => {
                this.props.onChange(e);
                // this.updateThumbnail();
              }}
              selectedMenu={this.props.curTool}
            />
          </Viewport>
        </InfiniteViewer>
        <Selecto
          ref={selecto}
          dragContainer={`.scena-viewer`}
          hitRate={0}
          selectableTargets={[`.scena-viewport [${DATA_SCENA_ELEMENT_ID}]:not(.scenaIgnore)`]}
          selectByClick={selectedMenu !== 'hand'}
          selectFromInside={false}
          toggleContinueSelect={['shift']}
          preventDefault={true}
          rectOffset={this.state.rectOffset}
          // scrollOptions={
          //   infiniteViewer.current
          //     ? {
          //         container: infiniteViewer.current.getContainer(),
          //         threshold: 30,
          //         throttleTime: 30,
          //         getScrollPosition: () => {
          //           const current = infiniteViewer.current!;
          //           return [current.getScrollLeft(), current.getScrollTop()];
          //         },
          //       }
          //     : undefined
          // }
          onDragStart={(e) => {
            if (selectedMenu === 'hand') {
              return;
            }
            const inputEvent = e.inputEvent;
            const target = inputEvent.target;
            this.checkBlur();

            if (
              (inputEvent.type === 'touchstart' && e.isTrusted) ||
              moveableManager.current!.getMoveable().isMoveableElement(target) ||
              state.selectedTargets.some((t) => t === target || t.contains(target))
            ) {
              e.stop();
            }
          }}
          onDrag={(e: { deltaX: number; deltaY: number }) => {
            if (selectedMenu !== 'hand') {
              return;
            }
            const { offsetWidth, offsetHeight } = infiniteViewer.current.getContainer();
            let zoomWidth = Number(width) * zoom,
              zoomHeight = Number(height) * zoom;

            const dragPos = {
              x: zoomWidth < offsetWidth - 40 ? 0 : -e.deltaX,
              y: zoomHeight < offsetHeight - 40 ? 0 : -e.deltaY,
            };

            let left = infiniteViewer.current!.getScrollLeft(),
              top = infiniteViewer.current!.getScrollTop();

            let pos = calcDragPos(left, top, {
              width: this.props.page.width,
              height: this.props.page.height,
            });
            let zoomKey = 'zoom' + Math.floor(zoom * 100);
            let maxPos = edgeConfig[zoomKey] || 50;

            infiniteViewer.current!.scrollBy(
              left < -150 ? 20 : pos.x < maxPos ? dragPos.x : -20,
              top < -150 ? 20 : pos.y < maxPos ? dragPos.y : -20,
            );
            this.props?.onDrag?.(pos);
          }}
          onSelectEnd={({ isDragStart, selected, inputEvent }) => {
            if (selectedMenu === 'hand') {
              return;
            }
            let _selected = R.clone(selected);
            if (isDragStart) {
              inputEvent.preventDefault();
            }
            // console.log('编辑面板手动触发选中', _selected);
            this.setSelectedTargets(_selected, true, true).then(() => {
              if (!isDragStart) {
                return;
              }
              moveableManager.current!.getMoveable().dragStart(inputEvent);
            });
          }}
        />
      </div>
    );
  }
  public componentDidMount() {
    const { infiniteViewer, memory, eventBus } = this;
    memory.set('background-color', '#4af');

    requestAnimationFrame(() => {
      infiniteViewer.current?.scrollCenter?.();
    });
    window.addEventListener('resize', this.onResize);
    const viewport = this.getViewport();

    eventBus.on('selectLayers', (e: any) => {
      const selected = e.selected as string[];

      this.setSelectedTargets(selected.map((key) => viewport.getInfo(key)!.el!));
    });
    eventBus.on('update', () => {
      this.forceUpdate();
    });

    const handleSelectMode = (selectedMenu: TQuickTool) => {
      this.props.setCurTool(selectedMenu);
    };

    this.keyManager.keydown(
      ['h'],
      (e) => {
        handleSelectMode('hand');
      },
      '移动工具：移动屏幕位置',
    );

    this.keyManager.keydown(
      ['m'],
      (e) => {
        this.infiniteViewer.current!.scrollCenter();
      },
      '画布居中',
    );

    this.keyManager.keydown(
      ['v'],
      (e) => {
        handleSelectMode('MoveTool');
      },
      '选择工具：选择屏幕中的组件',
    );

    this.keyManager.keydown(
      ['left'],
      (e) => {
        this.move(-10, 0);
        e.inputEvent.preventDefault();
      },
      '向左移动',
    );
    this.keyManager.keydown(
      ['up'],
      (e) => {
        this.move(0, -10);
        e.inputEvent.preventDefault();
      },
      '向上移动',
    );
    this.keyManager.keydown(
      ['right'],
      (e) => {
        this.move(10, 0);
        e.inputEvent.preventDefault();
      },
      '向右移动',
    );
    this.keyManager.keydown(
      ['down'],
      (e) => {
        this.move(0, 10);
        e.inputEvent.preventDefault();
      },
      '向下移动',
    );

    // delete允许删除，backspace禁止删除
    // this.keyManager.keyup(
    //   ['backspace'],
    //   () => {
    //     let targets = this.getSelectedTargets();
    //     const ids = getIds(targets);
    //     this.props.onRemove?.(ids);
    //     this.removeElements(targets);
    //   },
    //   '删除',
    // );
    this.keyManager.keyup(
      ['delete'],
      () => {
        let targets = this.getSelectedTargets();
        const ids = getIds(targets);
        this.props.onRemove?.(ids);
        this.removeElements(targets);
      },
      '删除',
    );
    this.keyManager.keydown([isMacintosh ? 'meta' : 'ctrl', 'x'], () => {}, '剪切');
    this.keyManager.keydown([isMacintosh ? 'meta' : 'ctrl', 'c'], () => {}, '复制');
    this.keyManager.keydown([isMacintosh ? 'meta' : 'ctrl', 'v'], () => {}, '粘贴');
    this.keyManager.keydown(
      [isMacintosh ? 'meta' : 'ctrl', 'z'],
      () => {
        this.historyManager.undo();
      },
      '撤销',
    );
    this.keyManager.keydown(
      [isMacintosh ? 'meta' : 'ctrl', 'shift', 'z'],
      () => {
        this.historyManager.redo();
      },
      '重做',
    );
    this.keyManager.keydown(
      [isMacintosh ? 'meta' : 'ctrl', 'a'],
      (e) => {
        this.setSelectedTargets(this.getViewportInfos().map((info) => info.el!));
        e.inputEvent.preventDefault();
      },
      '全选',
    );

    this.historyManager.registerType('createElements', undoCreateElements, restoreElements);
    this.historyManager.registerType('removeElements', restoreElements, undoCreateElements);
    this.historyManager.registerType('selectTargets', undoSelectTargets, redoSelectTargets);
    this.historyManager.registerType('changeText', undoChangeText, redoChangeText);
    this.historyManager.registerType('move', undoMove, redoMove);
  }
  public componentWillUnmount() {
    this.eventBus.off();
    this.memory.clear();
    this.moveableData.clear();
    this.keyManager.destroy();
    this.clipboardManager.destroy();
    window.removeEventListener('resize', this.onResize);
  }
  public promiseState(state: Partial<ScenaEditorState>) {
    return new Promise((resolve) => {
      this.setState(state, () => {
        resolve();
      });
    });
  }

  /**
   * 滚动editor到相对位置
   * @param x/y 相对坐标
   */
  public scrollTo({ x, y }) {
    this.infiniteViewer.current!.scrollTo(x, y);
  }

  public getSelectedTargets() {
    return this.state.selectedTargets;
  }
  public setSelectedTargets(
    targets: Array<HTMLElement | SVGElement>,
    isRestore = false,
    selectGroupTarget = false,
  ) {
    targets = targets.filter((target) => {
      return targets.every((parnetTarget) => {
        return parnetTarget === target || !parnetTarget.contains(target);
      });
    });

    // 被锁定的面板不允许选择
    targets = targets.filter((target) => {
      let targetId = getIds([target])[0];
      return !this.props.lockedPanel.includes(targetId);
    });

    // 是否需要计算关联的选中组件
    /**
     * 2020-12-08 调整bug
     * 当用户点击画布中的组件时，此时应选中同组的组件，用于拖动；
     * 当需要调整属性时，请选择列表中的单项；
     */
    let nexts: string[] = [];
    if (selectGroupTarget) {
      nexts = getIds(targets);
      // 计算关联的父子组件
      nexts = this.props?.calcNextSelectedPanel(nexts);
      targets = this.getViewport().getElements(nexts);
      this.props?.onSelect?.(nexts);
    }

    return this.promiseState({
      selectedTargets: targets,
    }).then(() => {
      if (!isRestore) {
        const prevs = getIds(this.moveableData.getSelectedTargets());
        if (prevs.length !== nexts.length || !prevs.every((prev, i) => nexts[i] === prev)) {
          // 被选中
          this.props?.onSelect?.(nexts);
          this.historyManager.addAction('selectTargets', {
            prevs,
            nexts,
          });
        }
      }
      this.selecto.current!.setSelectedTargets(targets);
      this.moveableData.setSelectedTargets(targets);
      this.eventBus.trigger('setSelectedTargets');
      return targets;
    });
  }

  public appendJSX(info: ElementInfo) {
    return this.appendJSXs([info]).then((targets) => targets[0]);
  }
  public append(
    jsx: ScenaJSXType,
    config: { id?: string; name?: string; style?: React.CSSProperties },
  ) {
    let id = config.id || generateId();
    let name = config.name || id;
    return this.appendJSXs([
      {
        jsx,
        name,
        id,
        frame: config?.style || getDefaultStyle(),
      },
    ]).then((targets) => targets[0]);
  }

  // 待优化
  // public updateJSX({ id, style }) {
  //   const viewport = this.getViewport();
  //   viewport.forceUpdate(() => {
  //     const target = document.querySelector<HTMLElement>(`[${DATA_SCENA_ELEMENT_ID}="${id}"]`)!;
  //     let { translate, rotate, scale } = style.transform;
  //     target.style.transform = `translate(${translate}) rotate(${rotate}) scale(${scale})`;
  //   });
  // }

  public appendJSXs(
    jsxs: ElementInfo[],
    isRestore?: boolean,
  ): Promise<Array<HTMLElement | SVGElement>> {
    const viewport = this.getViewport();
    const indexesList = viewport.getSortedIndexesList(this.getSelectedTargets());
    const indexesListLength = indexesList.length;
    let appendIndex = -1;
    let scopeId: string = '';

    if (!isRestore && indexesListLength) {
      const indexes = indexesList[indexesListLength - 1];

      const info = viewport.getInfoByIndexes(indexes);

      scopeId = info.scopeId!;
      appendIndex = indexes[indexes.length - 1] + 1;
    }

    this.console.log('append jsxs', jsxs, appendIndex, scopeId);
    // console.log(this.getViewport().jsxs);
    return this.getViewport()
      .appendJSXs(jsxs, appendIndex, scopeId)
      .then(({ added }) => this.appendComplete(added, isRestore));
  }

  public appendComplete(infos: ElementInfo[], isRestore?: boolean) {
    !isRestore &&
      this.historyManager.addAction('createElements', {
        infos,
        prevSelected: getIds(this.getSelectedTargets()),
      });
    const data = this.moveableData;
    const targets = infos
      .map(function registerFrame(info) {
        data.createFrame(info.el!, info.frame);
        data.render(info.el!);

        info.children!.forEach(registerFrame);
        return info.el!;
      })
      .filter((el) => el);

    return Promise.all(targets.map((target) => checkImageLoaded(target))).then(() => {
      this.setSelectedTargets(targets, true);
      return targets;
    });
  }
  public removeByIds(ids: string[], isRestore?: boolean) {
    return this.removeElements(this.getViewport().getElements(ids), isRestore);
  }
  public getMoveable() {
    return this.moveableManager.current!.getMoveable();
  }
  public removeFrames(targets: Array<HTMLElement | SVGElement>) {
    const frameMap: IObject<any> = {};
    const moveableData = this.moveableData;
    const viewport = this.getViewport();

    targets.forEach(function removeFrame(target) {
      const info = viewport.getInfoByElement(target)!;
      if (!info) {
        return;
      }

      frameMap[info.id!] = moveableData.getFrame(target).get();
      moveableData.removeFrame(target);

      info.children!.forEach((childInfo) => {
        removeFrame(childInfo.el!);
      });
    });

    return frameMap;
  }
  public restoreFrames(infos: ElementInfo[], frameMap: IObject<any>) {
    const viewport = this.getViewport();
    const moveableData = this.moveableData;

    infos.forEach(function registerFrame(info) {
      info.frame = frameMap[info.id!];
      delete frameMap[info.id!];

      info.children!.forEach(registerFrame);
    });
    for (const id in frameMap) {
      moveableData.createFrame(viewport.getInfo(id).el!, frameMap[id]);
    }
  }
  public removeElements(targets: Array<HTMLElement | SVGElement>, isRestore?: boolean) {
    const viewport = this.getViewport();
    const frameMap = this.removeFrames(targets);
    const indexesList = viewport.getSortedIndexesList(targets);
    const indexesListLength = indexesList.length;
    let scopeId = '';
    let selectedInfo: ElementInfo | null = null;

    if (indexesListLength) {
      const lastInfo = viewport.getInfoByIndexes(indexesList[indexesListLength - 1]);
      const nextInfo = viewport.getNextInfo(lastInfo.id!);

      scopeId = lastInfo.scopeId!;
      selectedInfo = nextInfo;
    }
    // return;
    return viewport.removeTargets(targets).then(({ removed }) => {
      let selectedTarget =
        selectedInfo || viewport.getLastChildInfo(scopeId)! || viewport.getInfo(scopeId);

      this.setSelectedTargets(
        selectedTarget && selectedTarget.el ? [selectedTarget.el!] : [],
        true,
      );

      this.console.log('removeTargets', removed);
      !isRestore &&
        this.historyManager.addAction('removeElements', {
          infos: removed.map(function removeTarget(info: ElementInfo): ElementInfo {
            if (!info) {
              return {};
            }
            return {
              ...info,
              children: info.children!.map(removeTarget),
              frame: frameMap[info.id!] || info.frame,
            };
          }),
        });
      return targets;
    });
  }
  public setProperty(scope: string[], value: any, isUpdate?: boolean) {
    const infos = this.moveableData.setProperty(scope, value);
    this.historyManager.addAction('renders', { infos });
    if (isUpdate) {
      this.moveableManager.current!.updateRect();
    }
    this.eventBus.requestTrigger('render');
  }

  // 处理粘贴
  public loadDatas(datas: SavedScenaData[]) {
    let ids = datas.map((item) => item.jsxId);
    this.props.onPaste(ids);
  }
  public saveTargets(targets: Array<HTMLElement | SVGElement>): SavedScenaData[] {
    const viewport = this.getViewport();
    const moveableData = this.moveableData;
    this.console.log('save targets', targets);
    return targets
      .map((target) => viewport.getInfoByElement(target))
      .map(function saveTarget(info): SavedScenaData {
        const target = info.el!;
        const isContentEditable = info.attrs!.contenteditable;
        return {
          name: info.name,
          attrs: getScenaAttrs(target),
          jsxId: info.jsxId || '',
          componentId: info.componentId!,
          innerHTML: isContentEditable ? '' : target.innerHTML,
          innerText: isContentEditable ? (target as HTMLElement).innerText : '',
          tagName: target.tagName.toLowerCase(),
          frame: moveableData.getFrame(target).get(),
          children: info.children!.map(saveTarget),
        };
      });
  }
  public getViewport() {
    return this.viewport.current!;
  }
  public getViewportInfos() {
    return this.getViewport().getViewportInfos();
  }
  public appendBlob(blob: Blob) {
    const url = URL.createObjectURL(blob);

    return this.appendJSX({
      jsx: <img src={url} alt="appended blob" />,
      name: '(Image)',
    });
  }
  public moves(movedInfos: MovedInfo[], isRestore?: boolean) {
    const frameMap = this.removeFrames(movedInfos.map(({ info }) => info.el!));

    return this.getViewport()
      .moves(movedInfos)
      .then((result) => this.moveComplete(result, frameMap, isRestore));
  }

  private move(deltaX: number, deltaY: number) {
    this.getMoveable().request('draggable', { deltaX, deltaY }, true);
  }
  private checkBlur() {
    const activeElement = document.activeElement as HTMLElement;
    activeElement?.blur();

    const selection = document.getSelection()!;
    selection?.removeAllRanges();
  }
  private onResize = () => {
    this.horizontalGuides.current!.resize();
    this.verticalGuides.current!.resize();
  };

  private moveComplete(result: MovedResult, frameMap: IObject<any>, isRestore?: boolean) {
    this.console.log('Move', result);

    const { moved, prevInfos, nextInfos } = result;
    this.restoreFrames(moved, frameMap);

    if (moved.length) {
      if (!isRestore) {
        this.historyManager.addAction('move', {
          prevInfos,
          nextInfos,
        });
      }
      // move complete
      this.appendComplete(moved, true);
    }

    return result;
  }
}
export default Editor;

// 旋转组件
export const rotateJSX = (moveableData, { id, rotate }) => {
  const target = document.querySelector<HTMLElement>(`[${DATA_SCENA_ELEMENT_ID}="${id}"]`)!;
  const frame = moveableData.getFrame(target);
  frame.set('transform', 'rotate', `${rotate}deg`);
  target.style.cssText += frame.toCSS();
};
