import { useContext } from 'react';
import RcCollapse from 'rc-collapse';
import classNames from 'classnames';
import { ConfigContext } from 'antd/lib/config-provider';

export type CollapsePanelProps = {
  key: string | number;
  header: React.ReactNode;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  showArrow?: boolean;
  prefixCls?: string;
  forceRender?: boolean;
  id?: string;
  extra?: React.ReactNode;
}

const CollapsePanel: React.FC<CollapsePanelProps> = (props) => {
  const { getPrefixCls } = useContext(ConfigContext);
  const { prefixCls: customizePrefixCls, className = '', showArrow = true } = props;
  const prefixCls = getPrefixCls('collapse', customizePrefixCls);
  const collapsePanelClassName = classNames(
    {
      [`${prefixCls}-no-arrow`]: !showArrow,
    },
    className,
  );
  return <RcCollapse.Panel {...props} prefixCls={prefixCls} className={collapsePanelClassName} />;
};

export default CollapsePanel;
