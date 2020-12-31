import React, { useRef, useEffect, useMemo } from 'react';

import classnames from 'classnames';

import Chart from '@jiaminghi/charts';

import { useMeasure } from 'react-use';
import { IChartOption } from './';
import './style.less';

export default ({
  option = {},
  className,
  style,
}: {
  option: Partial<IChartOption>;
  className?: string;
  style?: React.CSSProperties;
}) => {
  const [domRef, { width, height }] = useMeasure();

  const chartRef = useRef(null);

  const chartInstanceofRef = useRef(null);

  useEffect(() => {
    chartInstanceofRef.current || (chartInstanceofRef.current = new Chart(chartRef.current));

    chartInstanceofRef.current.setOption(option || {}, true);
  }, [option]);

  useEffect(() => {
    chartInstanceofRef.current.resize();
  }, [width, height]);

  const classNames = useMemo(() => classnames('dv-charts-container', className), [className]);

  return (
    <div className={classNames} style={{ width: '100%', height: '100%', ...style }} ref={domRef}>
      <div ref={chartRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};
