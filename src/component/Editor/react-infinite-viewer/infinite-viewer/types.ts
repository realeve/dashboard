import { PROPERTIES, METHODS, OPTIONS } from './consts';
import InfiniteViewer from './InfiniteViewer';

/**
 * @typedef
 * @memberof InfiniteViewer
 */
export interface InfiniteViewerOptions {
  margin: number;
  threshold: number;
  zoom: number;
  scrollArea: HTMLElement;
  rangeX: number[];
  rangeY: number[];
  usePinch: boolean;
  pinchThreshold: number;
  wheelScale: number;
  cspNonce: string;

  // 缩放范围，最大最小值
  zoomRange?: number[];

  // 缩放变更
  onZoom?: (e: number) => void;

  // 允许滚动
  allowWheel?: boolean;
}

/**
 * @typedef
 * @memberof InfiniteViewer
 */
export interface OnScroll {
  scrollLeft: number;
  scrollTop: number;
}
/**
 * @typedef
 * @memberof InfiniteViewer
 */
export interface OnAbortPinch {
  inputEvent: any;
}
/**
 * @typedef
 * @memberof InfiniteViewer
 */
export interface OnDragStart {
  inputEvent: any;
  stop(): void;
}
/**
 * @typedef
 * @memberof InfiniteViewer
 */
export interface OnDrag {
  inputEvent: any;
}
/**
 * @typedef
 * @memberof InfiniteViewer
 */
export interface OnDragEnd {
  isDrag: boolean;
  isDouble: boolean;
  inputEvent: any;
}
/**
 * @typedef
 * @memberof InfiniteViewer
 */
export interface OnPinch {
  distance: number;
  scale: number;
  zoom: number;
  inputEvent: any;
}
export interface InfiniteViewerEvents {
  scroll: OnScroll;
  abortPinch: OnAbortPinch;
  dragStart: OnDragStart;
  drag: OnDrag;
  dragEnd: OnDragEnd;
  pinch: OnPinch;
}
export type InfiniteViewerProperties = {
  [P in typeof PROPERTIES[number]]: InfiniteViewerOptions[P];
};
export type InfiniteViewerMethods = { [P in typeof METHODS[number]]: InfiniteViewer[P] };
