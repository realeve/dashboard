import { prefixNames } from 'framework-utils';
import { PREFIX, DATA_SCENA_ELEMENT_ID } from '../consts';
import { EDITOR_PROPERTIES } from '../consts';
import type {
  ScenaFunctionComponent,
  ScenaProps,
  ScenaComponent,
  ScenaJSXElement,
  ScenaFunctionJSXElement,
} from '../types';
import type { IObject } from '@daybrush/utils';
import { isFunction, isObject } from 'util';

import localforage from 'localforage';
import type { IPage } from '@/models/common';

export function prefix(...classNames: string[]) {
  return prefixNames(PREFIX, ...classNames);
}
export function getContentElement(el: HTMLElement): HTMLElement | null {
  if (el?.contentEditable === 'inherit') {
    return getContentElement(el.parentElement!);
  }
  if (el?.contentEditable === 'true') {
    return el;
  }
  return null;
}

export function connectEditorProps(component: any) {
  const {prototype} = component;
  Object.defineProperty(prototype, 'editor', {
    get () {
      return this.props.editor;
    },
  });
  EDITOR_PROPERTIES.forEach((name) => {
    Object.defineProperty(prototype, name, {
      get () {
        return this.props.editor[name];
      },
    });
  });
}
export function between(val: number, min: number, max: number) {
  return Math.min(Math.max(min, val), max);
}
export function getTargetsById(id: string) {
  return document.querySelector<HTMLElement>(`[${DATA_SCENA_ELEMENT_ID}="${id}"]`);
}
export function getId(el: HTMLElement | SVGElement) {
  return el.getAttribute(DATA_SCENA_ELEMENT_ID)!;
}
export function getIds(els: (HTMLElement | SVGElement)[]): string[] {
  return els.map((el) => getId(el));
}

export function checkInput(target: HTMLElement | SVGElement) {
  const tagName = target.tagName.toLowerCase();

  return (target as HTMLElement).isContentEditable || tagName === 'input' || tagName === 'textarea';
}
export function checkImageLoaded(el: HTMLElement | SVGElement): Promise<any> {
  if (el.tagName.toLowerCase() !== 'img') {
    return Promise.all([].slice.call(el.querySelectorAll('img')).map((el) => checkImageLoaded(el)));
  }
  return new Promise((resolve) => {
    if ((el as HTMLImageElement).complete) {
      resolve();
    } else {
      el.addEventListener('load', function loaded() {
        resolve();

        el.removeEventListener('load', loaded);
      });
    }
  });
}

export function getParnetScenaElement(
  el: HTMLElement | SVGElement,
): HTMLElement | SVGElement | null {
  if (!el) {
    return null;
  }
  if (el.hasAttribute(DATA_SCENA_ELEMENT_ID)) {
    return el;
  }
  return getParnetScenaElement(el.parentElement as HTMLElement | SVGElement);
}

export function makeScenaFunctionComponent<T = IObject<any>>(
  id: string,
  component: (props: ScenaProps & T) => React.ReactElement<any, any>,
): ScenaFunctionComponent<T> {
  (component as ScenaFunctionComponent<T>).scenaComponentId = id;

  return component as ScenaFunctionComponent<T>;
}

export function getScenaAttrs(el: HTMLElement | SVGElement) {
  const {attributes} = el;
  const {length} = attributes;
  const attrs: IObject<any> = {};

  for (let i = 0; i < length; ++i) {
    const { name, value } = attributes[i];

    if (name === DATA_SCENA_ELEMENT_ID || name === 'style') {
      continue;
    }
    attrs[name] = value;
  }

  return attrs;
}

export function isScenaFunction(value: any): value is ScenaComponent {
  return isFunction(value) && 'scenaComponentId' in value;
}

export function isScenaElement(value: any): value is ScenaJSXElement {
  return isObject(value) && !isScenaFunction(value);
}
export function isScenaFunctionElement(value: any): value is ScenaFunctionJSXElement {
  return isScenaElement(value) && isFunction(value.type);
}

export function isNumber(value: any): value is number {
  return typeof value === 'number';
}

export const generateId: () => string = () => Math.random().toString(16).slice(7);

const key = 'datav_guide';

const GUIDE_OFFSET = 0;
export const guideDb = {
  save: (e) => {
    const res = {
      h: e.h.filter((item) => item > -50),
      v: e.v.filter((item) => item > -50),
    };
    localforage.setItem(key, res);
  },
  load: ({ width, height }: IPage) =>
    localforage
      .getItem<IGuideProps>(key)
      .then(
        (res) =>
          res || { v: [Number(width) / 2 + GUIDE_OFFSET], h: [Number(height) / 2 + GUIDE_OFFSET] },
      ),
};

export const calcDefaultGuidline = ({ width, height, padding }: IPage) => {
  return {
    v: [0, padding, Number(width) / 2, Number(width) - padding, Number(width)],
    h: [0, padding, Number(height) / 2, Number(height) - padding, Number(height)],
  };
};

export interface IGuideProps {
  h: number[];
  v: number[];
}
