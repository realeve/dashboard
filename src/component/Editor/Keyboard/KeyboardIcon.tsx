import * as React from 'react';
import Icon from './Icon';
import { prefix } from '../utils/utils';
import Popup from '../Popup/Popup';
import './keyboard.less';

export default class KeyboardIcon extends Icon {
  public static id = '快捷键';
  public keys = ['s'];
  public state = {
    renderPopup: false,
  };
  public renderIcon() {
    return (
      <div className={prefix('i')}>
        <div className={prefix('keyboard')}>
          <div className={prefix('key')} />
          <div className={prefix('key')} />
          <div className={prefix('key')} />
          <div className={prefix('key')} />
          <div className={prefix('key')} />
          <div className={prefix('key')} />
          <div className={prefix('key')} />
          <div className={prefix('space')} />
        </div>
        {this.state.renderPopup && (
          <Popup container=".scena-editor" onClose={this.onClose}>
            <h2>快捷键</h2>
            <ul className={prefix('key-list')}>
              {this.keyManager.keylist.map(([keys, description]) => {
                return (
                  <li key={keys.join('+')}>
                    <p className={prefix('key-description')}>
                      {description}
                      <strong>
                        {keys.map(key => (
                          <span key={key}>{key}</span>
                        ))}
                      </strong>
                    </p>
                  </li>
                );
              })}
            </ul>
          </Popup>
        )}
      </div>
    );
  }

  public onClick = () => {
    this.setState({
      renderPopup: true,
    });
  };
  public onClose = () => {
    this.setState({
      renderPopup: false,
    });
  };
}
