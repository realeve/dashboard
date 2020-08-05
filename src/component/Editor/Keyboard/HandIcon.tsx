import * as React from 'react';
import Icon from './Icon';

export default class MoveToolIcon extends Icon {
  public static id = 'hand';
  public static title = '移动工具：移动屏幕位置';
  public keys = ['h'];
  public renderIcon() {
    return (
      <svg
        viewBox="64 64 896 896"
        focusable="false"
        width="1em"
        height="1em"
        fill="#fff"
        style={{ width: 20, height: 20 }}
      >
        <path d="M909.3 506.3L781.7 405.6a7.23 7.23 0 00-11.7 5.7V476H548V254h64.8c6 0 9.4-7 5.7-11.7L517.7 114.7a7.14 7.14 0 00-11.3 0L405.6 242.3a7.23 7.23 0 005.7 11.7H476v222H254v-64.8c0-6-7-9.4-11.7-5.7L114.7 506.3a7.14 7.14 0 000 11.3l127.5 100.8c4.7 3.7 11.7.4 11.7-5.7V548h222v222h-64.8c-6 0-9.4 7-5.7 11.7l100.8 127.5c2.9 3.7 8.5 3.7 11.3 0l100.8-127.5c3.7-4.7.4-11.7-5.7-11.7H548V548h222v64.8c0 6 7 9.4 11.7 5.7l127.5-100.8a7.3 7.3 0 00.1-11.4z" />
      </svg>
    );
  }
}
