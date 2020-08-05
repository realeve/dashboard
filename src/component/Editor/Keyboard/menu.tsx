import * as React from 'react';
import { prefix } from '../utils/utils';
import MoveToolIcon from './MoveToolIcon';
import './Menu.less';
import Icon from './Icon';
import Editor from '../Editor';
import KeyboardIcon from './KeyboardIcon';
import HandIcon from './HandIcon';

const MENUS: Array<typeof Icon> = [MoveToolIcon, HandIcon, KeyboardIcon];
export default class Menu extends React.PureComponent<{
  editor: Editor;
  onSelect?: (id: string) => any;
}> {
  public state = {
    selected: 'MoveTool',
  };
  public menuRefs: Array<React.RefObject<Icon>> = [];
  public render() {
    return <div className={prefix('menu')}>{this.renderMenus()}</div>;
  }
  public renderMenus() {
    const selected = this.state.selected;
    const menuRefs = this.menuRefs;
    const editor = this.props.editor;

    return MENUS.map((MenuClass, i) => {
      const id = MenuClass.id;
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
    const selected = this.state.selected;
    return MENUS.filter(m => m.id === selected)[0];
  }
}
