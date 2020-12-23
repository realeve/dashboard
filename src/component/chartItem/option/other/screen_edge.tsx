import { IChartConfig } from '@/component/chartItem/interface';
import ScreenEdge, { IScreenEdgeProps } from '@/component/Editor/ScreenEdge';

export const config: IChartConfig[] = [
  {
    key: 'showEdge',
    title: '显示拼接线',
    type: 'switch',
    defaultValue: true,
  },
  {
    key: 'screen_x',
    title: '横向屏幕数量',
    type: 'range',
    step: 1,
    min: 1,
    max: 10,
    defaultValue: 4,
  },
  {
    key: 'screen_y',
    title: '纵向屏幕数量',
    type: 'range',
    step: 1,
    min: 1,
    max: 10,
    defaultValue: 4,
  },
  {
    key: 'screen_edge_width',
    title: '拼接边距',
    type: 'range',
    step: 1,
    min: 0,
    max: 30,
    defaultValue: 6,
  },
  {
    key: 'screen_edge_background',
    title: '拼接线颜色',
    type: 'purecolor',
    position: 'top',
    noAnimation: true,
    defaultValue: 'rgba(0,0,0,0.5)',
  },
  {
    key: 'showEdgeTag',
    title: '拼接线标签',
    type: 'switch',
    defaultValue: true,
  },
];

export default ({ option: { ...props } }: { option: IScreenEdgeProps }) =>
  props.showEdge && <ScreenEdge page={props} />;
