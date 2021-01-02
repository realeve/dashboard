import React from 'react';
import Ruler from '@scena/react-ruler';
import { ref, refs } from 'framework-utils';
import type { OnDragEnd } from '@daybrush/drag';
import Dragger from '@daybrush/drag';
import type { StyledInterface } from 'react-css-styled';
import styled from 'react-css-styled';
import { GUIDES, GUIDE, DRAGGING, ADDER, DISPLAY_DRAG, GUIDES_CSS } from './consts';
import { prefix } from './utils';
import { hasClass, addClass, removeClass } from '@daybrush/utils';
import type { GuidesState, GuidesProps, GuidesInterface } from './types';
import './guides.less';
import * as R from 'ramda';

const GuidesElement = styled('div', GUIDES_CSS);

export default class Guides
  extends React.PureComponent<GuidesProps, GuidesState>
  implements GuidesInterface {
  public static defaultProps: GuidesProps = {
    className: '',
    type: 'horizontal',
    setGuides: () => {},
    zoom: 1,
    style: { width: '100%', height: '100%' },
    snapThreshold: 5,
    snaps: [],
    onChangeGuides: () => {},
    displayDragPos: false,
    dragPosFormat: (v) => v,
  };
  public state: GuidesState = {
    guides: [],
    dragPos: 0,
  };
  public adderElement!: HTMLElement;
  public scrollPos: number = 0;
  public ruler!: Ruler;
  private manager!: StyledInterface;
  private guidesElement!: HTMLElement;
  private displayElement!: HTMLElement;
  private dragger!: Dragger;
  private guideElements: HTMLElement[] = [];

  public render() {
    const {
      className,
      type,
      width,
      height,
      unit,
      zoom,
      style,
      rulerStyle,
      backgroundColor,
      lineColor,
      textColor,
      direction,
      displayDragPos,
    } = this.props as Required<GuidesProps>;

    return (
      <GuidesElement
        ref={ref(this, 'manager')}
        className={`${prefix('manager', type)} ${className}`}
        style={style}
      >
        <Ruler
          ref={ref(this, 'ruler')}
          type={type}
          width={width}
          height={height}
          unit={unit}
          zoom={zoom}
          backgroundColor={backgroundColor}
          lineColor={lineColor}
          style={rulerStyle}
          textColor={textColor}
          direction={direction}
        />
        <div className={GUIDES} ref={ref(this, 'guidesElement')}>
          {displayDragPos && <div className={DISPLAY_DRAG} ref={ref(this, 'displayElement')} />}
          <div className={ADDER} ref={ref(this, 'adderElement')}>
            <span>{this.state.dragPos}</span>
          </div>
          {this.renderGuides()}
        </div>
      </GuidesElement>
    );
  }
  public renderGuides() {
    const { type, zoom } = this.props as Required<GuidesProps>;
    const translateName = type === 'horizontal' ? 'translateY' : 'translateX';
    const guides = R.uniq(this.state.guides);

    this.guideElements = [];
    return guides.map((pos, i) => {
      return (
        <div
          className={prefix('guide', type)}
          ref={refs(this, 'guideElements', i)}
          key={pos}
          data-index={i}
          data-pos={pos}
          style={{
            transform: `${translateName}(${pos * zoom}px)`,
          }}
          title="双击删除参考线"
        >
          <span>{this.props.dragPosFormat(pos)}</span>
        </div>
      );
    });
  }
  public componentDidMount() {
    this.dragger = new Dragger(this.manager.getElement(), {
      container: document.body,
      dragstart: (e) => {
        const { target } = e.inputEvent;
        const { datas } = e;

        if (target === this.ruler.canvasElement) {
          e.datas.fromRuler = true;
          datas.target = this.adderElement;
        } else if (!hasClass(target, GUIDE)) {
          return false;
        } else {
          datas.target = target;
        }
        this.onDragStart(e);
        return true;
      },
      drag: this.onDrag,
      dragend: this.onDragEnd,
    });
  }
  public componentWillUnmount() {
    this.dragger.unset();
  }
  /**
   * Load the current guidelines.
   * @memberof Guides
   * @instance
   */
  public loadGuides(guides: number[]) {
    this.setState({
      guides,
    });
  }
  /**
   * Get current guidelines.
   * @memberof Guides
   * @instance
   */
  public getGuides(): number[] {
    return this.state.guides;
  }
  /**
   * Scroll the positions of the guidelines opposite the ruler.
   * @memberof Guides
   * @instance
   */
  public scrollGuides(pos: number) {
    const { zoom } = this.props as Required<GuidesProps>;
    const { guidesElement } = this;

    this.scrollPos = pos;
    guidesElement.style.transform = `${this.getTranslateName()}(${-pos * zoom}px)`;

    const { guides } = this.state;
    this.guideElements.forEach((el, i) => {
      if (!el) {
        return;
      }
      el.style.display = -pos + guides[i] < 0 ? 'none' : 'block';
    });
  }
  /**
   * Recalculate the size of the ruler.
   * @memberof Guides
   * @instance
   */
  public resize() {
    this.ruler.resize();
  }
  /**
   * Scroll the position of the ruler.
   * @memberof Guides
   * @instance
   */
  public scroll(pos: number) {
    this.ruler.scroll(pos);
  }
  private onDragStart = ({ datas, clientX, clientY, inputEvent }: any) => {
    const isHorizontal = this.props.type === 'horizontal';
    const rect = this.guidesElement.getBoundingClientRect();
    datas.rect = rect;
    datas.offset = isHorizontal ? rect.top : rect.left;

    addClass(datas.target, DRAGGING);
    this.onDrag({ datas, clientX, clientY });

    inputEvent.stopPropagation();
    inputEvent.preventDefault();
  };
  private onDrag = ({ datas, clientX, clientY }: any) => {
    const { type, zoom, snaps, snapThreshold, displayDragPos, dragPosFormat } = this.props;
    const isHorizontal = type === 'horizontal';
    let nextPos = Math.round((isHorizontal ? clientY : clientX) - datas.offset);
    let guidePos = Math.round(nextPos / zoom!);
    const guideSnaps = snaps!.slice().sort((a, b) => {
      return Math.abs(guidePos - a) - Math.abs(guidePos - b);
    });

    if (guideSnaps.length && Math.abs(guideSnaps[0] - guidePos) < snapThreshold!) {
      guidePos = R.head(guideSnaps);
      nextPos = guidePos * zoom!;
    }
    if (displayDragPos) {
      const displayPos = type === 'horizontal' ? [-40, nextPos] : [nextPos - 32, 0];

      this.displayElement.style.cssText += `transform:translate(${displayPos
        .map((v) => `${v}px`)
        .join(', ')})`;

      //   this.displayElement.innerHTML = `${dragPosFormat!(guidePos)}`;
      this.setState({
        dragPos: dragPosFormat!(guidePos),
      });
    }
    datas.target.setAttribute('data-pos', guidePos);
    datas.target.style.transform = `${this.getTranslateName()}(${nextPos}px)`;
    datas.target.innerHTML = `<span>${this.props.dragPosFormat(guidePos)}</span>`;
    return nextPos;
  };
  private onDragEnd = ({ datas, clientX, clientY, isDouble }: OnDragEnd) => {
    const pos = this.onDrag({ datas, clientX, clientY });
    const { guides } = this.state;
    const { setGuides, onChangeGuides, zoom, displayDragPos } = this.props;
    const guidePos = Math.round(pos / zoom!);

    if (displayDragPos) {
      this.displayElement.style.cssText += `display: none;`;
    }
    removeClass(datas.target, DRAGGING);

    /**
     * The `changeGuides` event occurs when the guideline is added / removed / changed.
     * @memberof Guides
     * @event changeGuides
     * @param {OnChangeGuides} - Parameters for the changeGuides event
     */
    if (datas.fromRuler) {
      if (pos >= this.scrollPos && guides.indexOf(guidePos) < 0) {
        this.setState(
          {
            guides: [...guides, guidePos],
          },
          () => {
            onChangeGuides!({
              guides: this.state.guides,
            });
            setGuides!(this.state.guides);
          },
        );
      }
    } else {
      const index = datas.target.getAttribute('data-index');

      if (isDouble || pos < this.scrollPos) {
        guides.splice(index, 1);
      } else if (guides.indexOf(guidePos) > -1) {
        return;
      } else {
        guides[index] = guidePos;
      }
      this.setState(
        {
          guides: [...guides],
        },
        () => {
          const nextGuides = this.state.guides;
          setGuides!(nextGuides);
          onChangeGuides!({
            guides: nextGuides,
          });
        },
      );
    }
  };
  private getTranslateName() {
    return this.props.type === 'horizontal' ? 'translateY' : 'translateX';
  }
}
