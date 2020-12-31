import React, { useEffect, useRef, useState, useMemo } from 'react';

import PropTypes from 'prop-types';

import classnames from 'classnames';

import { co } from '@/utils/useAutoResize';

import styles from './index.less';

import { emojiList } from '../ScrollBoard';
import { useMeasure } from 'react-use';

import * as R from 'ramda';

const deepClone = R.clone;
  const deepMerge = R.merge;

const defaultConfig = {
  /**
   * @description Board data
   * @type {Array<Object>}
   * @default data = []
   */
  data: [],
  /**
   * @description Row num
   * @type {Number}
   * @default rowNum = 5
   */
  rowNum: 5,
  /**
   * @description Scroll wait time
   * @type {Number}
   * @default waitTime = 2000
   */
  waitTime: 4000,
  /**
   * @description Carousel type
   * @type {String}
   * @default carousel = 'single'
   * @example carousel = 'single' | 'page'
   */
  carousel: 'single',
  /**
   * @description Value unit
   * @type {String}
   * @default unit = ''
   * @example unit = 'ton'
   */
  unit: '',

  fontSize: 16,
  fontWeight: 'normal',
  fontColor: '#9aa8d4',
  padding: 6,
  barHeight: 16,
};

function calcRows({ data, rowNum }) {
  data.sort(({ value: a }, { value: b }) => {
    if (a > b) return -1;
    if (a < b) return 1;
    if (a === b) return 0;
  });

  const value = data.map(({ value }) => value);

  const max = Math.max(...value) || 0;

  data = data.map((row, i) => ({
    ...row,
    ranking: i + 1,
    percent: (row.value / max) * 100,
  }));

  const rowLength = data.length;

  if (rowLength > rowNum && rowLength < 2 * rowNum) {
    data = [...data, ...data];
  }

  data = data.map((d, i) => ({ ...d, scroll: i }));

  return data;
}

const ScrollRankingBoard = ({ config, className, style }) => {
  const [domRef, { width, height }] = useMeasure();

  const [state, setState] = useState({
    mergedConfig: null,

    rows: [],

    heights: [],
  });

  const { mergedConfig, rows, heights } = state;

  const stateRef = useRef({
    ...state,
    rowsData: [],
    avgHeight: 0,
    animationIndex: 0,
  });

  const heightRef = useRef(height);

  Object.assign(stateRef.current, state);

  function onResize(onresize = false) {
    if (!mergedConfig) return;

    const heights = calcHeights(mergedConfig, onresize);

    if (heights !== undefined) {
      Object.assign(stateRef.current, { heights });
      setState((state) => ({ ...state, heights }));
    }
  }

  function calcData() {
    const mergedConfig = deepMerge(deepClone(defaultConfig, true), config || {});

    const rows = calcRows(mergedConfig);

    const heights = calcHeights(mergedConfig);

    const data = { mergedConfig, rows };

    heights !== undefined && Object.assign(data, { heights });

    Object.assign(stateRef.current, data, { rowsData: rows, animationIndex: 0 });

    setState((state) => ({ ...state, ...data }));
  }

  function calcHeights({ rowNum, data }, onresize = false) {
    const avgHeight = height / rowNum;

    Object.assign(stateRef.current, { avgHeight });

    if (!onresize) {
      return new Array(data.length).fill(avgHeight);
    }
  }

  function* animation(start = false) {
    let {
      avgHeight,
      animationIndex,
      mergedConfig: { waitTime, carousel, rowNum },
      rowsData,
    } = stateRef.current;

    const rowLength = rowsData.length;

    if (start) yield new Promise((resolve) => setTimeout(resolve, waitTime));

    const animationNum = carousel === 'single' ? 1 : rowNum;

    const rows = rowsData.slice(animationIndex);
    rows.push(...rowsData.slice(0, animationIndex));

    const heights = new Array(rowLength).fill(avgHeight);
    setState((state) => ({ ...state, rows, heights }));

    yield new Promise((resolve) => setTimeout(resolve, 300));

    animationIndex += animationNum;

    const back = animationIndex - rowLength;
    if (back >= 0) animationIndex = back;

    const newHeights = [...heights];
    newHeights.splice(0, animationNum, ...new Array(animationNum).fill(0));

    Object.assign(stateRef.current, { animationIndex });
    setState((state) => ({ ...state, heights: newHeights }));
  }

  useEffect(() => {
    calcData();

    let start = true;

    function* loop() {
      while (true) {
        yield* animation(start);

        start = false;

        const { waitTime } = stateRef.current.mergedConfig;

        yield new Promise((resolve) => setTimeout(resolve, waitTime - 300));
      }
    }

    const {
      mergedConfig: { rowNum },
      rows: rowsData,
    } = stateRef.current;

    const rowLength = rowsData.length;

    if (rowNum >= rowLength) return;

    return co(loop);
  }, [config, domRef.current]);

  useEffect(() => {
    if (heightRef.current === 0 && height !== 0) {
      onResize();

      heightRef.current = height;
    } else {
      onResize(true);
    }
  }, [width, height, domRef.current]);

  const classNames = useMemo(() => classnames(styles['dv-scroll-ranking-board'], className), [
    className,
  ]);

  const fontConfig = {
    fontSize: config.fontSize,
    fontWeight: config.fontWeight,
    color: config.fontColor,
    textAlign: config.textAlign,
  };

  return (
    <div
      className={classNames}
      style={{
        ...style,
        ...fontConfig,
        padding: `0 ${config.padding}px`,
      }}
      ref={domRef}
    >
      {rows.map((item, i) => (
        <div
          className={styles['row-item']}
          key={item.toString() + item.scroll}
          style={{ height: `${heights[i]}px` }}
        >
          <div className={styles['ranking-info']}>
            <div className={styles.rank} style={fontConfig}>
              {item.ranking <= 3 ? emojiList[item.ranking - 1] : item.ranking}
            </div>
            <div className={styles['info-name']}>{item.name}</div>
            <div className={styles['info-value']}>
              {item.value} {mergedConfig.unit}
            </div>
          </div>

          <div className={styles['ranking-column']}>
            <div
              className={styles['inside-column']}
              style={{
                width: `${item.percent}%`,
                height: config.barHeight,
                borderRadius: `0 ${config.barHeight / 2}px ${config.barHeight / 2}px 0`,
              }}
            >
              <div className={styles.shine} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

ScrollRankingBoard.propTypes = {
  config: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
};

// 指定 props 的默认值：
ScrollRankingBoard.defaultProps = {
  config: {},
};

export default ScrollRankingBoard;
