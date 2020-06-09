import { RulerProps } from '@scena/react-ruler/declaration/types';
import { IObject } from '@daybrush/utils';
import { ReactText } from 'react';

export interface GuidesState {
  guides: number[];
  dragPos: number | ReactText;
}

export interface GuideOptions extends RulerProps {
  className?: string;
  setGuides?: (guides: number[]) => any;
  rulerStyle?: IObject<any>;
  snapThreshold?: number;
  snaps?: number[];
  displayDragPos?: boolean;
  dragPosFormat?: (value: number) => string | number;
}
export interface GuidesProps extends GuideOptions {
  onChangeGuides?: (e: OnChangeGuides) => any;
}
export interface OnChangeGuides {
  guides: number[];
}
export interface GuidesInterface {
  getGuides(): number[];
  scroll(pos: number): void;
  scrollGuides(pos: number): void;
  loadGuides(guides: number[]): void;
  resize(): void;
}
