import React, { useRef, useEffect } from 'react';
import * as _ from '@antv/util';
import type { IChartMock } from '@/component/chartItem/interface';
import styles from './index.less';
import classnames from 'classnames';
import type { ChartConfig } from '@/component/g2plot';
import G2Plot from '@/component/g2plot';
import { useSetState } from 'react-use';

interface ITrendChartState {
  tooltipItems: any[];
  activeTooltipTitle: any;
  activeSeriesList: any[];
}
interface ITrendChartProps {
  data: IChartMock;
  config: ChartConfig;
  x: number;
  y: number;
  legend: number;
  cardPosition: 'left' | 'right';
  [key: string]: any;
}

export default ({
  data: { data, header, hash },
  x: _x,
  y: _y,
  legend: _legend,
  config,
  cardPosition = 'left',
}: ITrendChartProps) => {
  const x = header[_x];
  const y = header[_y];
  const legend = header[_legend];

  const [state, setState] = useSetState<ITrendChartState>({
    tooltipItems: [],
    activeTooltipTitle: null,
    activeSeriesList: [],
  });

  const chartRef = useRef(null);

  useEffect(() => {
    const lastData = _.last(data);
    const activeTooltipTitle = lastData[x];

    setState({
      tooltipItems: data.filter((d) => d[x] === activeTooltipTitle),
      activeTooltipTitle,
    });
    // line.on('plot:mouseleave', () => {
    //   line.chart.hideTooltip();
    // });
  }, []);

  useEffect(() => {
    const line = chartRef?.current?.getChart();
    if (!line) {
      return;
    }
    line.on('tooltip:change', (evt) => {
      const { title: activeTooltipTitle, items } = evt.data;

      const tooltipItems = !config.isPercent
        ? data.filter((d) => d[x] === activeTooltipTitle)
        : items.map((item) => {
            const val = _.clone(item.data);
            val[y] = item.value;
            return val;
          });
      // [-] 由官方示例 https://g2plot.antv.vision/zh/examples/case/statistical-scenario#trend 所得
      // 此处在渲染state的时候有性能问题，此处已修复
      setState({ tooltipItems, activeTooltipTitle });
    });
  }, [config.isPercent, hash, x, y]);

  const changeActiveSeries = (activeSeries: string) => {
    const { activeTooltipTitle, activeSeriesList } = state;
    let newList = [];
    if (!activeSeriesList.includes(activeSeries)) {
      newList = [...activeSeriesList, activeSeries];
    } else {
      newList = activeSeriesList.filter((s) => s !== activeSeries);
    }
    setState({ activeSeriesList: newList });

    // @ts-ignore
    const chart = chartRef?.current?.getChart()?.chart;
    if (!chart || !activeSeries) {
      return;
    }
    chart.filter(legend, (series) => {
      return !newList.includes(series);
    });
    chart.render(true);
    chart.geometries
      .find((geom) => geom.type === 'point')
      .elements.forEach((ele) => {
        const item = ele.getModel().data;
        if (item[x] === activeTooltipTitle && item[legend] === activeSeries) {
          ele.setState('active', true);
        }
      });
  };

  const CustomTooltip = () => {
    // @ts-ignore
    const chart = chartRef?.current?.getChart();
    if (!chart) {
      return null;
    }
    const { tooltipItems, activeSeriesList, activeTooltipTitle } = state;
    const { colors10 } = chart.chart.themeObject;
    return (
      <div className="g2-tooltip" style={{ [cardPosition]: 0 }}>
        <div className="g2-tooltip-title">
          {x}: {activeTooltipTitle}
        </div>
        <div className="g2-tooltip-items">
          {tooltipItems.map((item, idx) => {
            return (
              <div
                key={item[legend] + idx}
                className={`g2-tooltip-item tooltip-${item[legend]} ${
                  activeSeriesList.includes(item[legend]) ? 'inactive' : ''
                }`}
                onClick={() => changeActiveSeries(item[legend])}
              >
                <div className="g2-tooltip-item-marker" style={{ background: colors10[idx] }} />
                <div className="g2-tooltip-item-label">{item[legend]}</div>
                <div className="g2-tooltip-item-value">{_.isNil(item[y]) ? '-' : item[y]}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <section className={classnames(styles.wrapper, styles['trend-wrapper'])}>
      <CustomTooltip />
      <G2Plot
        className={styles['chart-wrapper']}
        ref={chartRef}
        option={config}
        style={{ height: 'calc(100% - 88px)' }}
      />
    </section>
  );
};
