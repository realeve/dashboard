import React, { useRef, useEffect, useState } from 'react';
import ReactEcharts from './echarts-for-react';
import { useInterval } from 'react-use';
import * as R from 'ramda';

export type tRender = 'canvas' | 'svg';
interface IProp {
  renderer?: tRender;
  option: any;
  toggleItem?: boolean;
  [key: string]: any;
}

let toggleSeriesItem = (option, idx) => {
  let len = option.series[0].data.length;
  option.series[0].data = option.series[0].data.map((item, i) => {
    let flag = i === idx % len;
    item.selected = flag;
    // item.label = { show: flag };
    return item;
  });
  idx = (idx + 1) % len;
  return { option, idx };
};

export default ({ toggleItem = false, setToggleIdx, renderer, ...props }: IProp) => {
  const echarts_react = useRef(null);
  useEffect(() => {
    return () => {
      if (echarts_react && echarts_react.current && echarts_react.current.dispose) {
        echarts_react.current.dispose();
      }
    };
  }, []);

  const [idx, setIdx] = useState(0);
  useInterval(() => {
    if (!echarts_react || !toggleItem) {
      return;
    }
    let chart = echarts_react.current.getEchartsInstance();
    setToggleIdx && setToggleIdx(idx);
    let { option, idx: id } = toggleSeriesItem(R.clone(props.option), idx);
    setIdx(id);
    chart.setOption(option, true);
  }, 3000);

  return <ReactEcharts ref={echarts_react} {...props} opts={{ renderer: renderer || 'canvas' }} />;
};
