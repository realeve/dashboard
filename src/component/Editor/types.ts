import type { IObject } from '@daybrush/utils';
import type Memory from './utils/Memory';
import type EventBus from './utils/EventBus';
import type MoveableData from './utils/MoveableData';
import type MoveableManager from './Viewport/MoveableMananger';
import type KeyManager from './KeyManager/KeyManager';
import type Editor from './Editor';
import type HistoryManager from './utils/HistoryManager';
import type Debugger from './utils/Debugger';
import type React from 'react';

export type TQuickTool = 'MoveTool' | 'hand' | 'Text';

export type ScenaEditorState = {
  selectedTargets: (SVGElement | HTMLElement)[];
  horizontalGuides: number[];
  verticalGuides: number[];
  zoom: number;
  rectOffset: {
    x: number;
    y: number;
  };
  guideVisible?: boolean;
}

export type TagAppendInfo = {
  tag: any;
  props: IObject<any>;
  name: string;
  frame: IObject<any>;
}

export type EditorInterface = {
  editor: Editor;
  memory: Memory;
  eventBus: EventBus;
  moveableData: MoveableData;
  keyManager: KeyManager;
  historyManager: HistoryManager;
  console: Debugger;
  moveableManager: React.RefObject<MoveableManager>;
}

export type Clipboard = {
  write: (items: ClipboardItem[]) => Promise<void>;
}
export type ClipboardItem = {
  types: string[];
  getType: (type: string) => Promise<Blob>;
}

export type SavedScenaData = {
  name: string;
  jsxId: string;
  componentId: string;
  tagName: string;
  innerHTML?: string;
  innerText?: string;
  attrs: IObject<any>;
  frame: IObject<any>;
  children: SavedScenaData[];
}
export type ScenaProps = {
  scenaElementId?: string;
  scenaAttrs?: IObject<any>;
  scenaText?: string;
  scneaHTML?: string;
}

export type ScenaFunctionComponent<T> = ((
  props: T & ScenaProps,
) => React.ReactElement<any, any>) & { scenaComponentId: string };
export type ScenaComponent = React.JSXElementConstructor<ScenaProps> & {
  scenaComponentId: string;
};
export type ScenaJSXElement = React.ReactElement<any, string> | ScenaFunctionJSXElement;
export type ScenaFunctionJSXElement = React.ReactElement<any, ScenaComponent>;
export type ScenaJSXType = ScenaJSXElement | string | ScenaComponent;
