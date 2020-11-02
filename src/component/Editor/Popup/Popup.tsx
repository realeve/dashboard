import * as React from 'react';
import { prefix } from '../utils/utils';
import './Popup.less';
import * as ReactDOM from 'react-dom';
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
          {this.props.children}
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

export default function ({ container = 'body', ...props }: IPopup) {
  return ReactDOM.createPortal(<Popup {...props} />, document.querySelector(container));
}
