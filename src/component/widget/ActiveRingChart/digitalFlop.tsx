import React, { useEffect, useRef, useMemo } from 'react';

import PropTypes from 'prop-types';

import classnames from 'classnames';

import CRender from '@jiaminghi/c-render';

import '@jiaminghi/charts/lib/extend/index';
import styles from './digitalFlop.less';

import * as R from 'ramda';
const deepClone = R.clone,
  deepMerge = R.merge;

const defaultConfig = {
  /**
   * @description Number for digital flop
   * @type {Array<Number>}
   * @default number = []
   * @example number = [10]
   */
  number: [],
  /**
   * @description Content formatter
   * @type {String}
   * @default content = ''
   * @example content = '{nt}个'
   */
  content: '',
  /**
   * @description Number toFixed
   * @type {Number}
   * @default toFixed = 0
   */
  toFixed: 0,
  /**
   * @description Text align
   * @type {String}
   * @default textAlign = 'center'
   * @example textAlign = 'center' | 'left' | 'right'
   */
  textAlign: 'center',
  /**
   * @description Text style configuration
   * @type {Object} {CRender Class Style}
   */
  style: {
    fontSize: 30,
    fill: '#3de7c9',
  },
  /**
   * @description CRender animationCurve
   * @type {String}
   * @default animationCurve = 'easeOutCubic'
   */
  animationCurve: 'easeOutCubic',
  /**
   * @description CRender animationFrame
   * @type {String}
   * @default animationFrame = 50
   */
  animationFrame: 50,
};

const DigitalFlop = ({ config = {}, className, style }) => {
  const domRef = useRef(null);
  const rendererRef = useRef(null);
  const graphRef = useRef(null);

  function getGraph(mergedConfig) {
    const { animationCurve, animationFrame } = mergedConfig;

    return rendererRef.current.add({
      name: 'numberText',
      animationCurve,
      animationFrame,
      shape: getShape(mergedConfig),
      style: getStyle(mergedConfig),
    });
  }

  function getShape({ number, content, toFixed, textAlign }) {
    const [w, h] = rendererRef.current.area;

    const position = [w / 2, h / 2];

    if (textAlign === 'left') position[0] = 0;
    if (textAlign === 'right') position[0] = w;

    return { number, content, toFixed, position };
  }

  function getStyle({ style, textAlign }) {
    return deepMerge(style, {
      textAlign,
      textBaseline: 'middle',
    });
  }

  useEffect(() => {
    const mergedConfig = deepMerge(deepClone(defaultConfig, true), config || {});

    if (!rendererRef.current) {
      rendererRef.current = new CRender(domRef.current);

      graphRef.current = getGraph(mergedConfig);
    }

    const graph = graphRef.current;
    graph.animationEnd();

    const shape = getShape(mergedConfig);

    const cacheNum = graph.shape.number.length;
    const shapeNum = shape.number.length;

    cacheNum !== shapeNum && (graph.shape.number = shape.number);

    const { animationCurve, animationFrame } = mergedConfig;

    Object.assign(graph, { animationCurve, animationFrame });

    graph.animation('style', getStyle(mergedConfig), true);
    graph.animation('shape', shape);
  }, [config]);

  const classNames = useMemo(() => classnames(styles['dv-digital-flop'], className), [className]);

  return (
    <div className={classNames} style={style}>
      <canvas ref={domRef} />
    </div>
  );
};

DigitalFlop.propTypes = {
  config: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
};

// 指定 props 的默认值：
DigitalFlop.defaultProps = {
  config: {},
};

export default DigitalFlop;
