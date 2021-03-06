import useFullscreen from './useFullscreen';
import { useToggle, useLocation } from 'react-use';
import Icon from './Icon';
import { Tooltip } from 'antd';
import type { IChartConfig } from '@/component/chartItem/interface';
import { connect } from 'react-redux';
import type { ICommon } from '@/models/common';

export const config: IChartConfig[] = [
  {
    key: 'fill',
    defaultValue: '#e6e6e6',
    title: '图标颜色',
    type: 'purecolor',
    position: 'bottom',
  },
];

const FullScreen = ({ option: { fill = '#e6e6e6' }, curTool }) => {
  const { pathname } = useLocation();
  const [show, toggle] = useToggle(false);
  const isFullscreen = useFullscreen(show, () => toggle(false));

  return (
    <Tooltip title="全屏">
      <div
        onClick={() => {
          // 当前配置界面，且可拖动组件时，不允许切换全屏状态（屏蔽该功能）
          if (pathname === '/config' && curTool === 'MoveTool') {
            return;
          }
          toggle();
        }}
      >
        <Icon fill={fill} isFullscreen={isFullscreen} />
      </div>
    </Tooltip>
  );
};

export default connect(({ common: { curTool } }: { common: ICommon }) => ({
  curTool,
}))(FullScreen);
