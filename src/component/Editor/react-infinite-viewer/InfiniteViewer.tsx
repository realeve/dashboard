import React from 'react';
import type { InfiniteViewerOptions, InfiniteViewerMethods } from './infinite-viewer';
import VanillaInfiniteViewer, {
  CLASS_NAME,
  OPTIONS,
  PROPERTIES,
  EVENTS,
  METHODS,
} from './infinite-viewer';
import type { MethodInterface } from 'framework-utils';
import { ref, withMethods } from 'framework-utils';
import type { InfiniteViewerProps } from './types';
import { REACT_EVENTS } from './consts';

export default class InfiniteViewer extends React.PureComponent<Partial<InfiniteViewerProps>> {
  @withMethods(METHODS as any)
  private infiniteViewer!: VanillaInfiniteViewer;
  private containerElement!: HTMLElement;
  private wrapperElement!: HTMLElement;
  private scrollAreaElement!: HTMLElement;
  private horizontalScrollElement!: HTMLElement;
  private verticalScrollElement!: HTMLElement;
  public render() {
    const { className } = this.props;

    return (
      <div className={`${className || ''} ${CLASS_NAME}`} ref={ref(this, 'containerElement')}>
        <div className="infinite-viewer-wrapper" ref={ref(this, 'wrapperElement')}>
          <div className="infinite-viewer-scroll-area" ref={ref(this, 'scrollAreaElement')}></div>
          {this.props.children}
        </div>
        <div
          className="infinite-viewer-scroll-bar infinite-viewer-horizontal-scroll-bar"
          ref={ref(this, 'horizontalScrollElement')}
        >
          <div className="infinite-viewer-scroll-thumb"></div>
        </div>
        <div
          className="infinite-viewer-scroll-bar infinite-viewer-vertical-scroll-bar"
          ref={ref(this, 'verticalScrollElement')}
        >
          <div className="infinite-viewer-scroll-thumb"></div>
        </div>
      </div>
    );
  }
  public componentDidMount() {
    const { props } = this;
    const options: Partial<InfiniteViewerOptions> = {};

    OPTIONS.forEach((name) => {
      if (name in props && typeof props[name] !== 'undefined') {
        (options as any)[name] = props[name];
      }
    });
    this.infiniteViewer = new VanillaInfiniteViewer(
      this.containerElement,
      this.scrollAreaElement.nextElementSibling as HTMLElement,
      {
        ...options,
        wrapperElement: this.wrapperElement,
        scrollAreaElement: this.scrollAreaElement,
        horizontalScrollElement: this.horizontalScrollElement,
        verticalScrollElement: this.verticalScrollElement,
      },
    );

    EVENTS.forEach((name, i) => {
      this.infiniteViewer.on(name, (e: any) => {
        const selfProps = this.props as any;
        const result = selfProps[REACT_EVENTS[i]] && selfProps[REACT_EVENTS[i]](e);

        if (result === false) {
          e.stop();
        }
      });
    });
  }
  public componentDidUpdate() {
    const { props } = this;
    const { infiniteViewer } = this;

    PROPERTIES.forEach((name) => {
      if (name in props && infiniteViewer[name] !== props[name]) {
        (infiniteViewer as any)[name] = props[name];
      }
    });
  }
  public componentWillUnmount() {
    this.infiniteViewer.destroy();
  }
  public getElement() {
    return this.containerElement;
  }
}

// tslint:disable-next-line: max-line-length
export interface InfiniteViewerProp
  extends MethodInterface<InfiniteViewerMethods, VanillaInfiniteViewer, InfiniteViewer> {}
