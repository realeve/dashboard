import { useEffect, useState, forwardRef } from 'react';
import ReactEcharts from './echarts-for-react';
import { useInterval } from 'react-use';
import * as R from 'ramda';

export type tRender = 'canvas' | 'svg';
interface IProp {
  renderer?: tRender;
  option: any;
  /** 是否轮询切换显示项，用于动态饼图 */
  toggleItem?: boolean;

  /** 设置切换项 */
  setToggleIdx?: (e: number) => void;
  [key: string]: any;
}

/**
 * 将第idx个项目设为选中状态
 * @param option 配置项
 * @param idx 序号
 */
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

const EChart: React.ForwardRefExoticComponent<IProp> = forwardRef(
  ({ toggleItem = false, setToggleIdx, renderer, ...props }, ref) => {
    useEffect(() => {
      // console.log(ref);
      return () => {
        if (ref && ref.current && ref.current.dispose) {
          ref.current.dispose();
        }
      };
    }, []);

    const [idx, setIdx] = useState(0);
    useInterval(
      () => {
        if (!ref?.current) {
          return;
        }
        let chart = ref.current?.echartsInstance;
        setToggleIdx && setToggleIdx(idx);
        let { option, idx: id } = toggleSeriesItem(R.clone(props.option), idx);
        setIdx(id);
        chart.setOption(option, true);
      },
      toggleItem ? 3000 : null,
    );

    return (
      <ReactEcharts
        ref={ref}
        {...props}
        onEvents={{
          click: props.onClick,
        }}
        opts={{ renderer: renderer || 'canvas' }}
      />
    );
  },
);

export default EChart;
