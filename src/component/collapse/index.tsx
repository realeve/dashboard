import { useContext } from 'react';
import RcCollapse from 'rc-collapse';
import classNames from 'classnames';

import CollapsePanel from './CollapsePanel';
import { ConfigContext } from 'antd/lib/config-provider';
import animation from './openAnimation';
import { cloneElement } from 'antd/lib/_util/reactNode';
// 自定义样式
import 'antd/es/collapse/style';
import './style.less';

export type ExpandIconPosition = 'left' | 'right' | undefined;

export type CollapseProps = {
  activeKey?: (string | number)[] | string | number;
  defaultActiveKey?: (string | number)[] | string | number;
  /** 手风琴效果 */
  accordion?: boolean;
  destroyInactivePanel?: boolean;
  onChange?: (key: string | string[]) => void;
  style?: React.CSSProperties;
  className?: string;
  bordered?: boolean;
  prefixCls?: string;
  expandIcon?: (panelProps: PanelProps) => React.ReactNode;
  expandIconPosition?: ExpandIconPosition;
  ghost?: boolean;
}

type PanelProps = {
  isActive?: boolean;
  header?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  showArrow?: boolean;
  forceRender?: boolean;
  disabled?: boolean;
  extra?: React.ReactNode;
}

type CollapseInterface = {
  Panel: typeof CollapsePanel;
} & React.FC<CollapseProps>

const Collapse: CollapseInterface = (props) => {
  const { getPrefixCls, direction } = useContext(ConfigContext);
  const { prefixCls: customizePrefixCls, className = '', bordered, ghost } = props;
  const prefixCls = getPrefixCls('collapse', customizePrefixCls);

  const getIconPosition = () => {
    const { expandIconPosition } = props;
    if (expandIconPosition !== undefined) {
      return expandIconPosition;
    }
    return direction === 'rtl' ? 'right' : 'left';
  };

  const renderExpandIcon = (panelProps: PanelProps = {}) => {
    const { expandIcon } = props;
    const icon = (expandIcon ? (
      expandIcon(panelProps)
    ) : (
      <i
        className={classNames('datav-icon datav-font icon-right arrow', {
          arrowActive: panelProps.isActive,
        })}
      />
    )) as React.ReactNode;
    //   <RightOutlined rotate={panelProps.isActive ? 90 : undefined} />

    return cloneElement(icon, () => ({
      className: classNames((icon as any).props.className, `${prefixCls}-arrow`),
    }));
  };

  const iconPosition = getIconPosition();
  const collapseClassName = classNames(
    {
      [`${prefixCls}-borderless`]: !bordered,
      [`${prefixCls}-icon-position-${iconPosition}`]: true,
      [`${prefixCls}-rtl`]: direction === 'rtl',
      [`${prefixCls}-ghost`]: !!ghost,
    },
    className,
  );
  const openAnimation = { ...animation, appear() {} };

  return (
    <RcCollapse
      openAnimation={openAnimation}
      {...props}
      expandIcon={(panelProps: PanelProps) => renderExpandIcon(panelProps)}
      prefixCls={prefixCls}
      className={collapseClassName}
    />
  );
};

Collapse.Panel = CollapsePanel;

Collapse.defaultProps = {
  bordered: true,
};

export default Collapse;
