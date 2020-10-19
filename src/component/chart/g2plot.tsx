import React, { useEffect, useState, useRef } from 'react';
import * as g2plot from '@antv/g2plot';
import { useSize, useDebounce } from 'react-use';
import theme from './theme';
import { showDefaultOption, IAChart } from './lib';
import { themeName } from '@/utils/setting';

// g2plot.registerGlobalTheme('dashboard', theme);

export const AChart = ({
  option: {
    data,
    config: { type, configs: option },
  },
  ...props
}: IAChart) => {
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
    500,
    [width, height],
  );

  useEffect(() => {
    if (!instance) {
      return;
    }

    showDefaultOption(type);

    console.log(g2plot, type, option);
    let _plot = new g2plot[type](
      instance.current,
      {
        // animation: false,
        data,
        ...option,
        theme: themeName,
      } || {},
    );

    _plot.render();
    setPlot(_plot);

    return () => {
      if (_plot) {
        _plot.destroy();
      }
    };
  }, [type]);

  useEffect(() => {
    if (!plot) {
      return;
    }
    plot.updateConfig(option);
    plot.render();
  }, [option]);

  useEffect(() => {
    if (!plot || !size.width) {
      return;
    }
    plot.updateConfig(size);
    plot.render();
  }, [size]);

  useEffect(() => {
    if (!plot) {
      return;
    }
    plot.changeData(data);
    // plot.render();
  }, [data]);

  return chartDom;
};
