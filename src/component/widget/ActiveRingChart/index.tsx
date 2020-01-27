import React, { useRef, useState, useEffect, useMemo } from 'react';

import PropTypes from 'prop-types';

import classnames from 'classnames';

import Charts from '@jiaminghi/charts';

import DigitalFlop from './digitalFlop';

import { co } from '@/utils/useAutoResize';

import * as R from 'ramda';
const deepClone = R.clone,
  deepMerge = R.merge;

import styles from './index.less';

const defaultConfig = {
  /**
   * @description Ring radius
   * @type {String|Number}
   * @default radius = '50%'
   * @example radius = '50%' | 100
   */
  radius: '50%',
  /**
   * @description Active ring radius
   * @type {String|Number}
   * @default activeRadius = '55%'
   * @example activeRadius = '55%' | 110
   */
  activeRadius: '55%',
  /**
   * @description Ring data
   * @type {Array<Object>}
   * @default data = [{ name: '', value: 0 }]
   */
  data: [{ name: '', value: 0 }],
  /**
   * @description Ring line width
   * @type {Number}
   * @default lineWidth = 20
   */
  lineWidth: 20,
  /**
   * @description Active time gap (ms)
   * @type {Number}
   * @default activeTimeGap = 3000
   */
  activeTimeGap: 3000,
  /**
   * @description Ring color (hex|rgb|rgba|color keywords)
   * @type {Array<String>}
   * @default color = [Charts Default Color]
   * @example color = ['#000', 'rgb(0, 0, 0)', 'rgba(0, 0, 0, 1)', 'red']
   */
  color: [],
  /**
   * @description Digital flop style
   * @type {Object}
   */
  digitalFlopStyle: {
    fontSize: 25,
    fill: '#fff',
  },
  /**
   * @description Digital flop toFixed
   * @type {Number}
   */
  digitalFlopToFixed: 0,
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

const ActiveRingChart = ({ config = {}, className, style }) => {
  const [{ activeIndex, mergedConfig }, setState] = useState({
    activeIndex: 0,
    mergedConfig: null,
  });

  const domRef = useRef(null);
  const chartRef = useRef(null);

  const digitalFlop = useMemo(() => {
    if (!mergedConfig) return {};

    const { digitalFlopStyle, digitalFlopToFixed, data } = mergedConfig;

    const value = data.map(({ value }) => value);

    const sum = value.reduce((all, v) => all + v, 0);

    const percent = parseFloat((value[activeIndex] / sum) * 100) || 0;

    return {
      content: '{nt}%',
      number: [percent],
      style: digitalFlopStyle,
      toFixed: digitalFlopToFixed,
    };
  }, [mergedConfig, activeIndex]);

  const ringName = useMemo(() => (!mergedConfig ? '' : mergedConfig.data[activeIndex].name), [
    mergedConfig,
    activeIndex,
  ]);

  const fontSize = useMemo(
    () => (!mergedConfig ? {} : { fontSize: `${mergedConfig.digitalFlopStyle.fontSize}px` }),
    [mergedConfig],
  );

  function getRingOption(mergedConfig) {
    const radius = getRealRadius(mergedConfig);

    const newMergedConfig = {
      ...mergedConfig,
      data: mergedConfig.data.map(item => ({ ...item, radius })),
    };

    return {
      series: [
        {
          type: 'pie',
          ...newMergedConfig,
          outsideLabel: {
            show: false,
          },
        },
      ],
      color: newMergedConfig.color,
    };
  }

  function getRealRadius({ radius, activeRadius, lineWidth }, active = false) {
    const maxRadius = Math.min(...chartRef.current.render.area) / 2;

    const halfLineWidth = lineWidth / 2;

    let realRadius = active ? activeRadius : radius;

    if (typeof realRadius !== 'number') {
      realRadius = (parseInt(realRadius) / 100) * maxRadius;
    }

    const insideRadius = realRadius - halfLineWidth;
    const outSideRadius = realRadius + halfLineWidth;

    return [insideRadius, outSideRadius];
  }

  function getOption(mergedConfig, activeIndex) {
    const radius = getRealRadius(mergedConfig);
    const active = getRealRadius(mergedConfig, true);

    let option = getRingOption(mergedConfig);

    return {
      ...option,
      series: option.series.reduce(
        (prev, serie, index) =>
          index !== 0
            ? [...prev, serie]
            : [
                ...prev,
                {
                  ...serie,
                  data: serie.data.map((item, i) => ({
                    ...item,
                    radius: i === activeIndex ? active : radius,
                  })),
                },
              ],
        [],
      ),
    };
  }

  useEffect(() => {
    // 第一次时初始化
    chartRef.current || (chartRef.current = new Charts(domRef.current));

    const mergedConfig = deepMerge(deepClone(defaultConfig, true), config || {});

    chartRef.current.setOption(getRingOption(mergedConfig), true);

    let activeIndex = 0;

    function* loop() {
      while (true) {
        setState({ mergedConfig, activeIndex });

        const option = getOption(mergedConfig, activeIndex);

        chartRef.current.setOption(option, true);

        const { activeTimeGap, data } = option.series[0];

        yield new Promise(resolve => setTimeout(resolve, activeTimeGap));

        activeIndex += 1;

        if (activeIndex >= data.length) {
          activeIndex = 0;
        }
      }
    }

    return co(loop);
  }, [config]);

  const classNames = useMemo(() => classnames(styles['dv-active-ring-chart'], className), [
    className,
  ]);

  return (
    <div className={classNames} style={style}>
      <div className={styles['active-ring-chart-container']} ref={domRef} />
      <div className={styles['active-ring-info']}>
        <DigitalFlop config={digitalFlop} />
        <div className={styles['active-ring-name']} style={fontSize}>
          {ringName}
        </div>
      </div>
    </div>
  );
};

ActiveRingChart.propTypes = {
  config: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
};

// 指定 props 的默认值：
ActiveRingChart.defaultProps = {
  config: {},
};

export default ActiveRingChart;
