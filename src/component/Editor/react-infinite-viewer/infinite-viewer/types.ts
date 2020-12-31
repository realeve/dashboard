import type { PROPERTIES, METHODS } from './consts';
import type InfiniteViewer from './InfiniteViewer';

/**
 * @typedef
 * @memberof InfiniteViewer
 */
export type InfiniteViewerOptions = {
  margin: number;
  threshold: number;
  zoom: number;
  rangeX: number[];
  rangeY: number[];
  usePinch: boolean;
  pinchThreshold: number;
  wheelScale: number;

  /** 缩放范围 */
  zoomRange: [number, number];
  /** 鼠标缩放事件 */
  onZoom: (scale: number) => void;

  cspNonce: string;
  displayVerticalScroll: boolean;
  displayHorizontalScroll: boolean;
  useForceWheel: boolean;

  wrapperElement: HTMLElement;
  scrollAreaElement: HTMLElement;
  verticalScrollElement: HTMLElement;
  horizontalScrollElement: HTMLElement;
};

/**
 * @typedef
 * @memberof InfiniteViewer
 */
export type OnScroll = {
  scrollLeft: number;
  scrollTop: number;
};
/**
 * @typedef
 * @memberof InfiniteViewer
 */
export type OnAbortPinch = {
  inputEvent: any;
};
/**
 * @typedef
 * @memberof InfiniteViewer
 */
export type OnDragStart = {
  inputEvent: any;
  stop: () => void;
};
/**
 * @typedef
 * @memberof InfiniteViewer
 */
export type OnDrag = {
  inputEvent: any;
};
/**
 * @typedef
 * @memberof InfiniteViewer
 */
export type OnDragEnd = {
  isDrag: boolean;
  isDouble: boolean;
  inputEvent: any;
};
/**
 * @typedef
 * @memberof InfiniteViewer
 */
export type OnPinchStart = {
  inputEvent: any;
  stop: () => void;
};
/**
 * @typedef
 * @memberof InfiniteViewer
 */
export type OnPinch = {
  distance: number;
  scale: number;
  zoom: number;
  inputEvent: any;
};
export type InfiniteViewerEvents = {
  scroll: OnScroll;
  abortPinch: OnAbortPinch;
  dragStart: OnDragStart;
  drag: OnDrag;
  dragEnd: OnDragEnd;
  pinchStart: OnPinchStart;
  pinch: OnPinch;
};
export type InfiniteViewerProperties = {
  [P in typeof PROPERTIES[number]]: InfiniteViewerOptions[P];
};
export type InfiniteViewerMethods = { [P in typeof METHODS[number]]: InfiniteViewer[P] };
