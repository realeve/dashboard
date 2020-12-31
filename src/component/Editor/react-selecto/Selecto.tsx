import * as React from 'react';
import type { SelectoOptions, SelectoProperties, SelectoMethods } from './selecto.esm.js';
import VanillaSelecto, { CLASS_NAME, OPTIONS, PROPERTIES, EVENTS, METHODS } from './selecto.esm.js';

import type { MethodInterface } from 'framework-utils';
import { ref, withMethods } from 'framework-utils';
import type { SelectoProps } from './types';
import { REACT_EVENTS } from './consts';

export default class Selecto extends React.PureComponent<Partial<SelectoProps>> {
  @withMethods(METHODS as any)
  private selecto!: VanillaSelecto;
  private selectionElement!: HTMLElement;
  public render() {
    return <div className={CLASS_NAME} ref={ref(this, 'selectionElement')} />;
  }
  public componentDidMount() {
    const { props } = this;
    const options: Partial<SelectoOptions> = {};

    OPTIONS.forEach((name) => {
      if (name in props) {
        (options as any)[name] = props[name];
      }
    });
    this.selecto = new VanillaSelecto({
      ...options,
      target: this.selectionElement,
    });

    EVENTS.forEach((name, i) => {
      this.selecto.on(name, (e: any) => {
        const selfProps = this.props as any;
        const result = selfProps[REACT_EVENTS[i]] && selfProps[REACT_EVENTS[i]](e);

        if (result === false) {
          e.stop();
        }
      });
    });
  }
  public componentDidUpdate(prevProps: Partial<SelectoProperties>) {
    const { props } = this;
    const { selecto } = this;
    PROPERTIES.forEach((name) => {
      if (prevProps[name] !== props[name]) {
        (selecto as any)[name] = props[name];
      }
    });
  }
  public componentWillUnmount() {
    this.selecto?.destroy?.();
  }
}

export default interface Selecto extends MethodInterface<SelectoMethods, VanillaSelecto, Selecto> {}
