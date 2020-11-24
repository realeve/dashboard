import React, { useRef, useEffect } from 'react';
import * as _ from '@antv/util';
import { IChartMock } from '@/component/chartItem/interface';
import styles from './index.less';
import classnames from 'classnames';
import G2Plot from '@/component/g2plot';
import { useSetState } from 'react-use';

interface ITrendChartState {
  tooltipItems: any[];
  activeTooltipTitle: any;
  activeSeriesList: any[];
}
interface ITrendChartProps {
  data: IChartMock;
}

export default ({ data: { data } }: ITrendChartProps) => {
  const [state, setState] = useSetState<ITrendChartState>({
    tooltipItems: [],
    activeTooltipTitle: null,
    activeSeriesList: [],
  });

  const chartRef = useRef(null);

  useEffect(() => {
    let line = chartRef?.current?.getChart();
    if (!line) {
      return;
    }
    const lastData = _.last(data);
    const activeTooltipTitle = lastData.year;

    setState({
      tooltipItems: data.filter((d) => d.year === activeTooltipTitle),
      activeTooltipTitle,
    });
    line.on('plot:mouseleave', () => {
      line.chart.hideTooltip();
    });
    line.on('tooltip:change', (evt) => {
      const { title: activeTooltipTitle } = evt.data;
      const tooltipItems = data.filter((d) => d.year === activeTooltipTitle);
      // TODO 由官方示例 https://g2plot.antv.vision/zh/examples/case/statistical-scenario#trend 所得
      // 此处在渲染state的时候有性能问题，此处已修复
      setState({ tooltipItems, activeTooltipTitle });
    });
  }, []);

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
    let chart = chartRef?.current?.getChart();
    if (!chart || !activeSeries) {
      return;
    }
    console.log(chart);
    chart.filter('category', (series) => {
      return newList.includes(series) ? false : true;
    });
    chart.render(true);
    chart.geometries
      .find((geom) => geom.type === 'point')
      .elements.forEach((ele) => {
        const { year, category } = ele.getModel().data;
        if (year === activeTooltipTitle && category === activeSeries) {
          ele.setState('active', true);
        }
      });
  };

  const CustomTooltip = () => {
    // @ts-ignore
    let chart = chartRef?.current?.getChart();
    if (!chart) {
      return null;
    }
    const { tooltipItems, activeSeriesList, activeTooltipTitle } = state;
    const { colors10 } = chart.chart.themeObject;
    return (
      <div className="g2-tooltip">
        <div className="g2-tooltip-title">{activeTooltipTitle}</div>
        <div className="g2-tooltip-items">
          {tooltipItems.map((item: { category: string; value: number | string }, idx) => {
            return (
              <div
                key={item.category + idx}
                className={`g2-tooltip-item tooltip-${item.category} ${
                  activeSeriesList.includes(item.category) ? 'inactive' : ''
                }`}
                onClick={() => changeActiveSeries(item.category)}
              >
                <div className="g2-tooltip-item-marker" style={{ background: colors10[idx] }} />
                <div className="g2-tooltip-item-label">{item.category}</div>
                <div className="g2-tooltip-item-value">
                  {_.isNil(item.value) ? '-' : item.value}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const option = {
    chartType: 'line',
    renderer: 'canvas',
    xField: 'year',
    yField: 'value',
    seriesField: 'category',
    smooth: false,
    legend: false,
    isGroup: true,
    connectedArea: { trigger: 'hover' },
    lineStyle: { lineWidth: 2 },
    xAxis: {
      type: 'category',
      label: {
        autoRotate: false,
      },
    },
    yAxis: {
      grid: {
        line: {
          style: {
            lineWidth: 0.5,
          },
        },
      },
    },
    point: {
      size: 0,
    },
    theme: {
      geometries: {
        point: {
          circle: {
            active: {
              style: {
                r: 6,
                fillOpacity: 1,
                stroke: '#000',
                lineWidth: 2,
              },
            },
          },
        },
      },
    },
    areaStyle: { fillOpacity: 0.4 },
    data,
    tooltip: {
      showMarkers: false,
      follow: false,
      showContent: false,
      showTitle: false,
    },
    interactions: [{ type: 'marker-active' }], //, { type: 'brush' }, { type: 'element-highlight-by-color' }
  };

  return (
    <section className={classnames(styles.wrapper, styles['trend-wrapper'])}>
      <CustomTooltip />
      <G2Plot className={styles['chart-wrapper']} ref={chartRef} option={option} />
    </section>
  );
};
