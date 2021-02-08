import React, { useEffect, useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as R from 'ramda';
import { useMeasure, useInterval } from 'react-use';
import { isArray } from '@antv/util';
import styles from './index.less';
import Play from '../Play';

export const emojiList = ['🥇', '🥈', '🥉'];

const sleep = (time = 300) => new Promise((resolve) => setTimeout(resolve, time));

export interface IScrollBoardProps {
  header: string[];
  data: string[][];
  rowNum: number;
  headerBGC: string;
  oddRowBGC: string;
  evenRowBGC: string;
  waitTime: number;
  headerHeight: number;
  columnWidth: number[];
  align?: ('left' | 'center' | 'right')[];
  index: boolean;
  indexHeader: string;
  carousel?: 'single' | 'page';
  fontSize: number;
  fontWeight: string;
  fontColor: string;
  formatIndex: boolean;
  hoverColumns?: number[];
}

const defaultConfig: IScrollBoardProps = {
  /**
   * @description Board header
   * @type {Array<String>}
   * @default header = []
   * @example header = ['column1', 'column2', 'column3']
   */
  header: [],
  /**
   * @description Board data
   * @type {Array<Array>}
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
   * @description Header background color
   * @type {String}
   * @default headerBGC = '#00BAFF'
   */
  headerBGC: '#0d5dff',
  /**
   * @description Odd row background color
   * @type {String}
   * @default oddRowBGC = '#003B51'
   */
  oddRowBGC: 'rgba(255,255,255,0.1)',
  /**
   * @description Even row background color
   * @type {String}
   * @default evenRowBGC = '#0A2732'
   */
  evenRowBGC: 'transparent',
  /**
   * @description Scroll wait time
   * @type {Number}
   * @default waitTime = 2000
   */
  waitTime: 2000,
  /**
   * @description Header height
   * @type {Number}
   * @default headerHeight = 35
   */
  headerHeight: 35,
  /**
   * @description Column width
   * @type {Array<Number>}
   * @default columnWidth = []
   */
  columnWidth: [],
  /**
   * @description Column align
   * @type {Array<String>}
   * @default align = []
   * @example align = ['left', 'center', 'right']
   */
  align: [],
  /**
   * @description Show index
   * @type {Boolean}
   * @default index = false
   */
  index: false,
  /**
   * @description index Header
   * @type {String}
   * @default indexHeader = '#'
   */
  indexHeader: '#',
  /**
   * @description Carousel type
   * @type {String}
   * @default carousel = 'single'
   * @example carousel = 'single' | 'page'
   */
  carousel: 'single',

  fontSize: 16,
  fontWeight: 'normal',
  fontColor: '#f2f2f2',

  formatIndex: true,
  hoverColumns: [],
};

function calcHeaderData({ header, index, indexHeader }) {
  if (!header.length) {
    return [];
  }

  header = [...header];

  if (index) header.unshift(indexHeader);

  return header;
}

function calcRows({ data, index, headerBGC, rowNum, formatIndex = true }: IScrollBoardProps) {
  if (index) {
    data = data.map((row, i) => {
      row = isArray(row) ? [...row] : Object.values(row);
      const needFormat = i < 3 && formatIndex;

      const indexTag = `<div class="${styles.index}" style="background-color: ${
        needFormat ? 'transparent' : headerBGC
      };">
      ${needFormat ? emojiList[i] : i + 1}
    </div>`;

      row.unshift(indexTag);

      return row;
    });
  }

  let nextData = data.map((ceils, i) => ({ ceils, rowIndex: i }));

  const rowLength = nextData.length;

  if (rowLength > rowNum && rowLength < 2 * rowNum) {
    nextData = [...nextData, ...nextData];
  }

  return nextData.map((d, i) => ({ ...d, scroll: i }));
}

function calcAligns(mergedConfig, header) {
  const columnNum = header.length;

  const aligns = new Array(columnNum).fill('left');

  const { align } = mergedConfig;

  return R.merge(aligns, align);
}

const ScrollBoard = ({ onClick, config, className, style }) => {
  // window resize时，以下语句才生效；在画板编辑模式中需要监听组件大小
  // const { width, height, domRef } = useAutoResize();

  const [domRef, { width, height }] = useMeasure();

  const [state, setState] = useState({
    mergedConfig: null,

    header: [],

    rows: [],

    widths: [],

    heights: [],

    aligns: [],
  });

  // const { mergedConfig, header, rows, widths, heights, aligns } = state;

  const stateRef = useRef({
    ...state,
    rowsData: [],
    avgHeight: 0,
    animationIndex: 0,
  });

  Object.assign(stateRef.current, state);

  function onResize() {
    const { mergedConfig, header } = state;
    if (!mergedConfig) return;

    const nextWith = calcWidths(mergedConfig, stateRef.current.rowsData);

    const nextHeight = calcHeights(mergedConfig, header);

    const data = { widths: nextWith, heights: nextHeight };

    Object.assign(stateRef.current, data);

    setState((prevState) => ({ ...prevState, ...data }));
  }

  function calcData() {
    const nextConfig = R.merge(R.clone(defaultConfig), config || {});
    const nextRows = calcRows(nextConfig);

    const { header } = state;

    const data = {
      mergedConfig: nextConfig,
      header: calcHeaderData(nextConfig),
      rows: nextRows,
      widths: calcWidths(nextConfig, stateRef.current.rowsData),
      aligns: calcAligns(nextConfig, header),
      heights: calcHeights(nextConfig, header),
    };

    Object.assign(stateRef.current, data, {
      rowsData: nextRows,
      animationIndex: 0,
    });

    setState((prevState) => ({ ...prevState, ...data }));
  }

  function calcWidths({ columnWidth, header: colHeader }, rowsData) {
    const usedWidth = columnWidth.reduce((all, w) => all + w, 0);

    let columnNum = 0;
    if (rowsData[0]) {
      columnNum = rowsData[0].ceils.length;
    } else if (colHeader.length) {
      columnNum = colHeader.length;
    }

    const avgWidth = (width - usedWidth) / (columnNum - columnWidth.length);

    const nextWidth = new Array(columnNum).fill(avgWidth);

    return R.merge(nextWidth, columnWidth);
  }

  function calcHeights({ headerHeight, rowNum, data }, head) {
    let allHeight = height;

    if (head.length) {
      allHeight -= headerHeight;
    }
    const totalRows = Math.min(data.length + 1, rowNum + 1);
    const avgHeight = allHeight / totalRows;

    Object.assign(stateRef.current, { avgHeight });

    return new Array(data.length).fill(avgHeight);
  }

  const nextPage = async (direction = 'next') => {
    let { animationIndex } = stateRef.current;
    const {
      avgHeight,
      mergedConfig: { carousel, rowNum },
      rowsData,
    } = stateRef.current;

    const rowLength = rowsData.length;

    const animationNum = carousel === 'single' ? 1 : rowNum;

    const nextRows = rowsData.slice(animationIndex);
    nextRows.push(...rowsData.slice(0, animationIndex));

    const nextHeights = new Array(rowLength).fill(avgHeight);

    setState((prevState) => ({ ...prevState, rows: nextRows, heights: nextHeights }));

    // 等待300 ms 动画加载
    await sleep(300);

    if (direction === 'next') {
      animationIndex += animationNum;
    } else {
      animationIndex -= animationNum;
    }

    const back = animationIndex - rowLength;
    if (back >= 0) animationIndex = back;

    const newHeights = [...nextHeights];
    newHeights.splice(0, animationNum, ...new Array(animationNum).fill(0));

    Object.assign(stateRef.current, { animationIndex });

    setState((prevState) => ({ ...prevState, heights: newHeights }));
  };

  function emitEvent(ri, ci, row, ceil) {
    const { ceils, rowIndex } = row;
    const appendIndex = config.index;

    onClick?.({
      data: appendIndex ? R.tail(ceils) : ceils,
      ceil,
      row: rowIndex,
      col: appendIndex ? ci - 1 : ci,
    });
  }

  const getBackgroundColor = (rowIndex) =>
    state.mergedConfig[rowIndex % 2 === 0 ? 'evenRowBGC' : 'oddRowBGC'];

  useEffect(() => {
    if (height === 0) {
      return;
    }
    calcData();
  }, [JSON.stringify(config), height]);

  const [isHover, setIshover] = useState(false);
  const [play, setPlay] = useState(true);

  useInterval(
    nextPage,
    !play || isHover ? null : (state?.mergedConfig?.waitTime || 10 * 1000) - 300,
  );

  useEffect(() => height > 0 && onResize(), [width, height]);

  const classNames = useMemo(() => classnames(styles['dv-scroll-board'], className), [className]);

  return (
    <div
      className={classNames}
      style={{ ...style, fontFamily: config.beautyFont ? 'inherit' : 'Acens' }}
      ref={domRef}
      onMouseEnter={() => {
        !isHover && setIshover(true);
      }}
      onMouseLeave={() => {
        setIshover(false);
      }}
    >
      <Play
        play={play}
        setPlay={setPlay}
        gotoNext={() => {
          nextPage('next');
        }}
        gotoPrev={() => {
          nextPage('prev');
        }}
        className={styles.arrow}
      />
      {!!state.header.length && !!state.mergedConfig && (
        <div
          className={styles.header}
          style={{
            backgroundColor: `${state.mergedConfig.headerBGC}`,
            fontSize: config.fontSize,
            fontWeight: config.fontWeight,
            color: config.fontColor,
            textAlign: config.textAlign,
          }}
        >
          {state.header.map((headerItem, i) => (
            <div
              className={styles['header-item']}
              key={headerItem + i}
              style={{
                height: `${state.mergedConfig.headerHeight}px`,
                lineHeight: `${state.mergedConfig.headerHeight}px`,
                width: `${state.widths[i]}px`,
                flex: config.index && i === 0 ? 'unset' : 1,
              }}
              align={state.aligns[i]}
              dangerouslySetInnerHTML={{ __html: headerItem }}
            />
          ))}
        </div>
      )}

      {!!state.mergedConfig && (
        <div
          className={styles.rows}
          style={{
            height: `${height - (state.header.length ? state.mergedConfig.headerHeight : 0)}px`,
          }}
        >
          {state.rows.map((row, ri) => (
            <div
              className={styles['row-item']}
              key={row.toString() + row.scroll}
              style={{
                height: `${state.heights[ri]}px`,
                lineHeight: `${state.heights[ri]}px`,
                backgroundColor: `${getBackgroundColor(row.rowIndex)}`,
                fontSize: config.fontSize,
                fontWeight: config.fontWeight,
                color: config.fontColor,
                textAlign: config.textAlign,
              }}
            >
              {row.ceils.map((ceil, ci) => {
                const showDetail = (config?.hoverColumns || []).includes(
                  ci - (config.index ? 1 : 0),
                );
                const Item = (
                  <div
                    className={classnames(styles.ceil, {
                      [styles.hoverAble]: showDetail,
                    })}
                    title={showDetail ? '点击查看详情' : ''}
                    key={ceil + ri + ci}
                    style={{
                      width: `${state.widths[ci]}px`,
                      flex: config.index && ci === 0 ? 'unset' : 1,
                    }}
                    align={state.aligns[ci]}
                    dangerouslySetInnerHTML={{ __html: ceil }}
                    onClick={() => showDetail && emitEvent(ri, ci, row, ceil)}
                  />
                );
                return Item;
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ScrollBoard.propTypes = {
  config: PropTypes.object,
  onClick: PropTypes.func,
  className: PropTypes.string,
  style: PropTypes.object,
};

// 指定 props 的默认值：
ScrollBoard.defaultProps = {
  config: {},
};

export default ScrollBoard;
