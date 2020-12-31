import type { InfiniteViewerEvents, InfiniteViewerProperties } from "infinite-viewer";

export type InfiniteViewerEventNames = {
    onScroll: "scroll";
    onDragStart: "dragStart";
    onDrag: "drag";
    onDragEnd: "dragEnd";
    onPinchStart: "pinchStart";
    onPinch: "pinch";
    onAbortPinch: "abortPinch";
}
export type InfiniteViewerEventProps = {
    [key in keyof InfiniteViewerEventNames]: (e: InfiniteViewerEvents[InfiniteViewerEventNames[key]]) => any;
};
export type InfiniteViewerProps = InfiniteViewerProperties & InfiniteViewerEventProps & Record<string, any>;
