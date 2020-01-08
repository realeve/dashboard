import React, { useEffect, useState, useRef } from 'react';
import { autoChart } from '@/lib/chart-advisor/src';
import { useSize, useDebounce } from 'react-use';
import _ from 'lodash';
import theme from './theme';
import { showDefaultOption, IAChart } from './lib';
import * as g2plot from '@antv/g2plot';
g2plot.registerGlobalTheme('dashboard', theme);

import { themeName } from '@/utils/setting';

/**
 * 主页:https://www.npmjs.com/package/@antv/chart-advisor
 *
 *
 *  Comparison -- 比较
    Trend -- 趋势
    Distribution -- 分布
    Rank -- 排行
    Proportion -- 比例
    Composition -- 组成

 * 示例：https://observablehq.com/@jiazhewang/autochart-automatic-chart-dev-library-by-antv
 */

const getDefaultConfig = option => {
  let configs = {
    // forceFit: false,
    // animation: false,
    theme: themeName,
  };
  if (!option.config) {
    return {
      config: {
        configs,
      },
      toolbar: true,
      development: true,
      ...option,
    };
  } else if (option.config && !option.config.configs) {
    return {
      config: {
        configs,
        ...option.config,
      },
      toolbar: true,
      development: true,
      ...option,
    };
  }

  let _option = _.clone(option);
  _option.config.configs = {
    ..._option.config.configs,
    ...configs,
  };
  return {
    toolbar: true,
    development: true,
    ..._option,
  };
};

export const AChart = ({ option: { data = [], ...option }, ...props }: IAChart) => {
  const instance = useRef(null);
  const [plot, setPlot] = useState(null);

  const [chartDom, { width, height }] = useSize(() => (
    <div ref={instance} style={{ width: '100%', height: '100%' }} {...props} />
  ));

  const [size, setSize] = React.useState({
    width: null,
    height: null,
  });

  useDebounce(
    () => {
      setSize({ width, height });
    },
    300,
    [width, height],
  );

  useEffect(() => {
    if (!instance) {
      return;
    }

    let config = size.width
      ? {
          option,
          ...size,
        }
      : option || {};

    let chartType = option.config.type;
    showDefaultOption(chartType);
    let _plot = null;
    autoChart(instance.current, data, getDefaultConfig(config)).then(chart => {
      _plot = chart;
      setPlot(_plot);
    });
    return () => {
      if (!_plot) {
        return;
      }
      _plot.destroy();
    };
  }, []);

  useEffect(() => {
    if (!plot) {
      return;
    }
    plot.changeData(data);
    plot.render();
  }, [data]);

  useEffect(() => {
    if (!plot) {
      return;
    }
    plot.updateConfig(option.config.configs);
    plot.render();
  }, [option]);

  useEffect(() => {
    if (!plot || !size.width) {
      return;
    }
    plot.updateConfig(size);
    plot.render();
  }, [size]);

  return chartDom;
};
