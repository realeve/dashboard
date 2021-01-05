import React from 'react';
import { prefix } from '../utils/utils';
import MoveToolIcon from './MovetoolIcon';
import './menu.less';
import type Icon from './Icon';
import type Editor from '../Editor';
import type { TQuickTool } from '../types';

import KeyboardIcon from './KeyboardIcon';
import HandIcon from './HandIcon';
import CenterIcon from './CenterIcon';
import TextIcon from './TextIcon';

const MENUS: typeof Icon[] = [MoveToolIcon, HandIcon, CenterIcon, TextIcon, KeyboardIcon];
export default class Menu extends React.PureComponent<{
  editor: Editor;
  onSelect?: (id: string) => any;
  curTool?: TQuickTool;
}> {
  public menuRefs: React.RefObject<Icon>[] = [];
  public render() {
    return <div className={prefix('menu')}>{this.renderMenus()}</div>;
  }

  // https://zh-hans.reactjs.org/blog/2018/06/07/you-probably-dont-need-derived-state.html?

  // remove componentWillReceiveProps
  // static getDerivedStateFromProps(nextProps, state) {
  //   if (nextProps.curTool !== state.selected) {
  //     return {
  //       selected: nextProps.curTool,
  //     };
  //   }
  //   return null;
  // }

  public renderMenus() {
    const { menuRefs } = this;
    const { editor, onSelect, curTool } = this.props;

    return MENUS.map((MenuClass, i) => {
      const { id } = MenuClass;
      if (!menuRefs[i]) {
        menuRefs[i] = React.createRef();
      }
      return (
        <MenuClass
          ref={menuRefs[i]}
          key={id}
          editor={editor}
          selected={curTool === id}
          onSelect={onSelect}
        />
      );
    });
  }
  public getSelected(): typeof Icon | undefined {
    return MENUS.filter((m) => m.id === this.props.curTool)[0];
  }
}
