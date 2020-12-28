import React, { useEffect, useState, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as R from 'ramda';
import { useMeasure } from 'react-use';
import { co } from '@/utils/useAutoResize';
import { isArray } from '@antv/util';
import styles from './index.less';

export const emojiList = ['🥇', '🥈', '🥉'];

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
  align: ('left' | 'center' | 'right')[];
  index: boolean;
  indexHeader: string;
  carousel: 'single' | 'page';
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

function calcRows({
  data,
  index,
  headerBGC,
  rowNum,
  formatIndex = true,
  hoverColumns = [],
}: IScrollBoardProps) {
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

  data = data.map((ceils, i) => ({ ceils, rowIndex: i }));

  const rowLength = data.length;

  if (rowLength > rowNum && rowLength < 2 * rowNum) {
    data = [...data, ...data];
  }

  return data.map((d, i) => ({ ...d, scroll: i }));
}

function calcAligns(mergedConfig, header) {
  const columnNum = header.length;

  let aligns = new Array(columnNum).fill('left');

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

  const { mergedConfig, header, rows, widths, heights, aligns } = state;

  const stateRef = useRef({
    ...state,
    rowsData: [],
    avgHeight: 0,
    animationIndex: 0,
  });

  Object.assign(stateRef.current, state);

  function onResize() {
    if (!mergedConfig) return;

    const widths = calcWidths(mergedConfig, stateRef.current.rowsData);

    const heights = calcHeights(mergedConfig, header);

    const data = { widths, heights };

    Object.assign(stateRef.current, data);
    setState((state) => ({ ...state, ...data }));
  }

  function calcData() {
    const mergedConfig = R.merge(R.clone(defaultConfig), config || {});

    const header = calcHeaderData(mergedConfig);

    const rows = calcRows(mergedConfig);

    const widths = calcWidths(mergedConfig, stateRef.current.rowsData);

    const heights = calcHeights(mergedConfig, header);

    const aligns = calcAligns(mergedConfig, header);

    const data = {
      mergedConfig,
      header,
      rows,
      widths,
      aligns,
      heights,
    };

    Object.assign(stateRef.current, data, {
      rowsData: rows,
      animationIndex: 0,
    });

    setState((state) => ({ ...state, ...data }));
  }

  function calcWidths({ columnWidth, header }, rowsData) {
    const usedWidth = columnWidth.reduce((all, w) => all + w, 0);

    let columnNum = 0;
    if (rowsData[0]) {
      columnNum = rowsData[0].ceils.length;
    } else if (header.length) {
      columnNum = header.length;
    }

    const avgWidth = (width - usedWidth) / (columnNum - columnWidth.length);

    const widths = new Array(columnNum).fill(avgWidth);

    return R.merge(widths, columnWidth);
  }

  function calcHeights({ headerHeight, rowNum, data }, header) {
    let allHeight = height;

    if (header.length) allHeight -= headerHeight;

    const avgHeight = allHeight / rowNum;

    Object.assign(stateRef.current, { avgHeight });

    return new Array(data.length).fill(avgHeight);
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

    let rows = rowsData.slice(animationIndex);
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

  function emitEvent(ri, ci, row, ceil) {
    const { ceils, rowIndex } = row;
    let appendIndex = config.formatIndex;

    onClick?.({
      data: appendIndex ? ceils.slice(1) : ceils,
      ceil,
      row: rowIndex,
      col: appendIndex ? ci - 1 : ci,
    });
  }

  const getBackgroundColor = (rowIndex) =>
    mergedConfig[rowIndex % 2 === 0 ? 'evenRowBGC' : 'oddRowBGC'];

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

  useEffect(onResize, [width, height, domRef.current]);

  const classNames = useMemo(() => classnames(styles['dv-scroll-board'], className), [className]);

  return (
    <div
      className={classNames}
      style={{ ...style, fontFamily: config.beautyFont ? 'inherit' : 'Acens' }}
      ref={domRef}
    >
      {!!header.length && !!mergedConfig && (
        <div
          className={styles.header}
          style={{
            backgroundColor: `${mergedConfig.headerBGC}`,
            fontSize: config.fontSize,
            fontWeight: config.fontWeight,
            color: config.fontColor,
            textAlign: config.textAlign,
          }}
        >
          {header.map((headerItem, i) => (
            <div
              className={styles['header-item']}
              key={headerItem + i}
              style={{
                height: `${mergedConfig.headerHeight}px`,
                lineHeight: `${mergedConfig.headerHeight}px`,
                width: `${widths[i]}px`,
                flex: config.index && i === 0 ? 'unset' : 1,
              }}
              align={aligns[i]}
              dangerouslySetInnerHTML={{ __html: headerItem }}
            />
          ))}
        </div>
      )}

      {!!mergedConfig && (
        <div
          className={styles.rows}
          style={{
            height: `${height - (header.length ? mergedConfig.headerHeight : 0)}px`,
          }}
        >
          {rows.map((row, ri) => (
            <div
              className={styles['row-item']}
              key={row.toString() + row.scroll}
              style={{
                height: `${heights[ri]}px`,
                lineHeight: `${heights[ri]}px`,
                backgroundColor: `${getBackgroundColor(row.rowIndex)}`,
                fontSize: config.fontSize,
                fontWeight: config.fontWeight,
                color: config.fontColor,
                textAlign: config.textAlign,
              }}
            >
              {row.ceils.map((ceil, ci) => {
                let showDetail = (config?.hoverColumns || []).includes(
                  ci - (config.formatIndex ? 1 : 0),
                );
                let Item = (
                  <div
                    className={classnames(styles.ceil, {
                      [styles.hoverAble]: showDetail,
                    })}
                    title={showDetail ? '点击查看详情' : ''}
                    key={ceil + ri + ci}
                    style={{
                      width: `${widths[ci]}px`,
                      flex: config.index && ci === 0 ? 'unset' : 1,
                    }}
                    align={aligns[ci]}
                    dangerouslySetInnerHTML={{ __html: ceil }}
                    onClick={() => emitEvent(ri, ci, row, ceil)}
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
