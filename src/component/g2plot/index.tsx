import React, { useEffect, useImperativeHandle, forwardRef } from 'react';
import * as lib from '@antv/g2plot';
import useChart, { ContainerProps, Base, Options } from './hooks/useChart';
import { getChart, utils } from './util';
import { ChartRefOptions, TChartType } from './interface';
import { ErrorBoundary } from './base';
import ChartLoading from './util/createLoading';
import './theme';
export interface ChartConfig extends Options {
  /** 图表类型 area | bar | box | bullet | column | funnel | histogram | line | liquid | heatmap | pie | progress | radar | ringprogress | rose | scatter | tinyarea | tinycolumn | tinyline | waterfall | wordcloud | sunburst | dualaxes | stock | radialbar | gauge */
  readonly chartType: TChartType;
}

export interface G2PlotChartProps extends ContainerProps {
  chartRef?: ChartRefOptions;
  /** 图表配置项 */
  option: ChartConfig;
  /** 使用 canvas 或 svg 渲染 */
  readonly renderer?: 'canvas' | 'svg';
}

const G2PlotChart = forwardRef((props: G2PlotChartProps, ref) => {
  const {
    chartRef,
    style = {
      height: '100%',
    },
    className,
    loading,
    loadingTemplate,
    errorTemplate,
    option: { chartType = 'Area', ...option },
    renderer = 'canvas',
  } = props;
  const chartInstance = lib[utils.camelCase(chartType)];
  if (!chartInstance) {
    return <h5>图表类型无效</h5>;
  }

  const { chart, container } = useChart<Base, Options>(chartInstance, {
    renderer,
    theme: 'cbpc',
    ...option,
  });

  useEffect(() => {
    getChart(chartRef, chart.current);
  }, [chart.current]);
  useImperativeHandle(ref, () => ({
    getChart: () => chart.current,
  }));

  useEffect(() => {
    let instance = chart.current;
    if (!instance) {
      return;
    }
    instance.update(option);
  }, [JSON.stringify(option)]);

  return (
    <ErrorBoundary errorTemplate={errorTemplate}>
      {loading && <ChartLoading loadingTemplate={loadingTemplate} />}
      <div className={className} style={style} ref={container} />
    </ErrorBoundary>
  );
});

export default G2PlotChart;

export const palette = [
  {
    title: '/img/palette/palette0.png',
    desc: '分类色板1',
    value: 0,
    theme: {
      colors10: [
        '#5B8FF9',
        '#61DDAA',
        '#65789B',
        '#F6BD16',
        '#6F5EF9',
        '#78D3F8',
        '#9661BC',
        '#F6903D',
        '#008685',
        '#F08BB4',
      ],
      colors20: [
        '#5B8FF9',
        '#CDDDFD',
        '#61DDAA',
        '#CDF3E4',
        '#65789B',
        '#CED4DE',
        '#F6BD16',
        '#FCEBB9',
        '#6F5EF9',
        '#D3CEFD',
        '#78D3F8',
        '#D3EEF9',
        '#9661BC',
        '#DECFEA',
        '#F6903D',
        '#FFE0C7',
        '#008685',
        '#BBDEDE',
        '#F08BB4',
        '#FFE0ED',
      ],
    },
  },
  {
    title: '/img/palette/palette1.png',
    desc: '分类色板2',
    value: 1,
    theme: {
      colors10: [
        '#FF6B3B',
        '#626681',
        '#FFC100',
        '#9FB40F',
        '#76523B',
        '#DAD5B5',
        '#0E8E89',
        '#E19348',
        '#F383A2',
        '#247FEA',
      ],
      colors20: [
        '#FF6B3B',
        '#626681',
        '#FFC100',
        '#9FB40F',
        '#76523B',
        '#DAD5B5',
        '#0E8E89',
        '#E19348',
        '#F383A2',
        '#247FEA',
        '#2BCB95',
        '#B1ABF4',
        '#1D42C2',
        '#1D9ED1',
        '#D64BC0',
        '#255634',
        '#8C8C47',
        '#8CDAE5',
        '#8E283B',
        '#791DC9',
      ],
    },
  },
  {
    title: '/img/palette/palette2.png',
    desc: '分类色板3',
    value: 2,
    theme: {
      colors10: [
        '#025DF4',
        '#DB6BCF',
        '#2498D1',
        '#BBBDE6',
        '#4045B2',
        '#21A97A',
        '#FF745A',
        '#007E99',
        '#FFA8A8',
        '#2391FF',
      ],
      colors20: [
        '#025DF4',
        '#DB6BCF',
        '#2498D1',
        '#BBBDE6',
        '#4045B2',
        '#21A97A',
        '#FF745A',
        '#007E99',
        '#FFA8A8',
        '#2391FF',
        '#FFC328',
        '#A0DC2C',
        '#946DFF',
        '#626681',
        '#EB4185',
        '#CD8150',
        '#36BCCB',
        '#327039',
        '#803488',
        '#83BC99',
      ],
    },
  },
  {
    title: '/img/palette/palette3.png',
    desc: '分类色板4',
    value: 3,
    theme: {
      colors10: [
        '#FF4500',
        '#1AAF8B',
        '#406C85',
        '#F6BD16',
        '#B40F0F',
        '#2FB8FC',
        '#4435FF',
        '#FF5CA2',
        '#BBE800',
        '#FE8A26',
      ],
      colors20: [
        '#FF4500',
        '#1AAF8B',
        '#406C85',
        '#F6BD16',
        '#B40F0F',
        '#2FB8FC',
        '#4435FF',
        '#FF5CA2',
        '#BBE800',
        '#FE8A26',
        '#946DFF',
        '#6C3E00',
        '#6193FF',
        '#FF988E',
        '#36BCCB',
        '#004988',
        '#FFCF9D',
        '#CCDC8A',
        '#8D00A1',
        '#1CC25E',
      ],
    },
  },

  {
    title: '/img/palette/palette4.png',
    desc: '顺序色板1',
    value: 4,
    theme: {
      colors10: [
        '#B8E1FF',
        '#9AC5FF',
        '#7DAAFF',
        '#5B8FF9',
        '#3D76DD',
        '#085EC0',
        '#0047A5',
        '#00318A',
        '#001D70',
      ],
      colors20: [
        '#B8E1FF',
        '#9AC5FF',
        '#7DAAFF',
        '#5B8FF9',
        '#3D76DD',
        '#085EC0',
        '#0047A5',
        '#00318A',
        '#001D70',
      ],
    },
  },
  {
    title: '/img/palette/palette5.png',
    desc: '顺序色板2',
    value: 5,
    theme: {
      colors10: [
        '#9DF5CA',
        '#61DDAA',
        '#42C090',
        '#19A576',
        '#008A5D',
        '#006F45',
        '#00562F',
        '#003E19',
        '#002800',
      ],
      colors20: [
        '#9DF5CA',
        '#61DDAA',
        '#42C090',
        '#19A576',
        '#008A5D',
        '#006F45',
        '#00562F',
        '#003E19',
        '#002800',
      ],
    },
  },

  {
    title: '/img/palette/palette6.png',
    desc: '发散色板1',
    value: 6,
    theme: {
      colors10: [
        '#215B77',
        '#1B9CD0',
        '#61C9FF',
        '#ABDFFF',
        '#EFF3DE',
        '#FFDE94',
        '#FFC741',
        '#D09C10',
        '#795B16',
      ],
      colors20: [
        '#215B77',
        '#227BA2',
        '#1B9CD0',
        '#22BAED',
        '#61C9FF',
        '#8AD4FF',
        '#ABDFFF',
        '#C9E9FF',
        '#EFF3DE',
        '#FFE9B8',
        '#FFDE94',
        '#FFD470',
        '#FFC741',
        '#EDB40A',
        '#D09C10',
        '#A37B16',
        '#795B16',
      ],
    },
  },
  {
    title: '/img/palette/palette7.png',
    desc: '发散色板2',
    value: 7,
    theme: {
      colors10: [
        '#014c63',
        '#168575',
        '#0bc286',
        '#96dcb0',
        '#F2EAEA',
        '#FFA884',
        '#FF6836',
        '#D13808',
        '#7A270E',
      ],
      colors20: [
        '#014c63',
        '#10686c',
        '#168575',
        '#16a37e',
        '#0bc286',
        '#65cf9b',
        '#96dcb0',
        '#c1e8c5',
        '#F2EAEA',
        '#FFC5AC',
        '#FFA884',
        '#FF895D',
        '#FF6836',
        '#F3470D',
        '#D13808',
        '#A4300C',
        '#7A270E',
      ],
    },
  },
  { title: '默认', value: 8, theme: 'cbpc' },
];
