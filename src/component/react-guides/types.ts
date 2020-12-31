import type { RulerProps } from '@scena/react-ruler/declaration/types';
import type { IObject } from '@daybrush/utils';
import type { ReactText } from 'react';

export type GuidesState = {
  guides: number[];
  dragPos: number | ReactText;
}

export type GuideOptions = {
  className?: string;
  setGuides?: (guides: number[]) => any;
  rulerStyle?: IObject<any>;
  snapThreshold?: number;
  snaps?: number[];
  displayDragPos?: boolean;
  dragPosFormat?: (value: number) => string | number;
} & RulerProps
export type GuidesProps = {
  onChangeGuides?: (e: OnChangeGuides) => any;
} & GuideOptions
export type OnChangeGuides = {
  guides: number[];
}
export type GuidesInterface = {
  getGuides: () => number[];
  scroll: (pos: number) => void;
  scrollGuides: (pos: number) => void;
  loadGuides: (guides: number[]) => void;
  resize: () => void;
}
