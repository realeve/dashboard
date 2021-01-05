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
  public state = {
    selected: 'MoveTool',
  };
  public menuRefs: React.RefObject<Icon>[] = [];
  public render() {
    return <div className={prefix('menu')}>{this.renderMenus()}</div>;
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.curTool !== this.state.selected) {
      this.setState({
        selected: nextProps.curTool,
      });
    }
  }
  public renderMenus() {
    const { selected } = this.state;
    const { menuRefs } = this;
    const { editor } = this.props;

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
          selected={selected === id}
          onSelect={this.select}
        />
      );
    });
  }
  public select = (id: string) => {
    this.setState({
      selected: id,
    });
    this.props?.onSelect?.(id);
  };
  public getSelected(): typeof Icon | undefined {
    const { selected } = this.state;
    return MENUS.filter((m) => m.id === selected)[0];
  }
}
