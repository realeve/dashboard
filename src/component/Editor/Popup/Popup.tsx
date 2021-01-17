import React from 'react';
import { prefix } from '../utils/utils';
import './Popup.less';
import * as ReactDOM from 'react-dom';
import { Spin, Button } from 'antd';

export interface IPopup {
  container?: string;
  onClose: () => any;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

class Popup extends React.PureComponent<IPopup> {
  public overlayElement = React.createRef<HTMLDivElement>();
  public render() {
    return (
      <div ref={this.overlayElement} className={prefix('overlay')} onClick={this.onClick}>
        <div className={prefix('popup')} style={this.props.style}>
          <div className={prefix('close')} onClick={this.props.onClose} />
          <div className={prefix('container')}>{this.props.children}</div>
        </div>
      </div>
    );
  }
  public onClick = (e: any) => {
    e.stopPropagation();
    if (e.target === this.overlayElement.current) {
      this.props.onClose();
    }
  };
}

export default ({ container = 'body', ...props }: IPopup) => {
  return ReactDOM.createPortal(<Popup {...props} />, document.querySelector(container));
};

export const PopupFooter = ({ children, ...props }) => (
  <div
    className="scena-footer"
    {...props}
    style={{
      justifyContent: { left: 'flex-start', center: 'center', right: 'flex-end' }[
        props.align || 'right'
      ],
    }}
  >
    <div className="scena-footer-line" />
    {children}
  </div>
);

export interface IConfirmProps {
  children: React.ReactNode;
  title: React.ReactNode;
  spinning?: boolean;
  showFooter?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
  okText?: string | React.ReactNode;
  cancelText?: string;
  style?: React.CSSProperties;
  container?: string;
}

export const ConfirmPanel = ({
  children,
  title = null,
  spinning = false,
  onOk = () => {},
  onCancel = () => {},
  okText = '确定',
  cancelText = '取消',
  showFooter = true,
  ...props
}: IConfirmProps) => {
  return (
    <Popup onClose={onCancel} {...props}>
      <h2>{title}</h2>
      {spinning ? <Spin spinning /> : <div style={{ flex: 1 }}>{children}</div>}
      {showFooter && (
        <PopupFooter>
          <Button type="ghost" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button type="primary" style={{ width: 120, marginLeft: 20 }} onClick={onOk}>
            {okText}
          </Button>
        </PopupFooter>
      )}
    </Popup>
  );
};

export const Confirm = ({ container = 'body', ...props }: IConfirmProps) => {
  return ReactDOM.createPortal(
    <ConfirmPanel container={container} {...props} />,
    document.querySelector(container),
  );
};
