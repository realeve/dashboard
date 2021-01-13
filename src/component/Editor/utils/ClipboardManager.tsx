import React from 'react';
import type { ClipboardItem, SavedScenaData as TSavedScenaData } from '../types';
import type Editor from '../Editor';
import { checkInput } from './utils';
import { TYPE_SCENA_LAYERS } from '../consts';

export default class ClipboardManager {
  constructor(private editor: Editor) {
    document.addEventListener('cut', this.onCut);
    document.addEventListener('copy', this.onCopy);
    document.addEventListener('paste', this.onPaste);
  }
  public destroy() {
    document.removeEventListener('cut', this.onCut);
    document.removeEventListener('copy', this.onCopy);
    document.removeEventListener('paste', this.onPaste);
  }
  public copy() {
    document.execCommand('copy');
  }
  public cut() {
    document.execCommand('cut');
  }
  public paste() {
    document.execCommand('paste');
  }
  private onCut = (e: any) => {
    const copied = this.onCopy(e);

    if (!copied) {
      return;
    }
    this.editor.console.log('cut scena data');
    this.editor.removeElements(this.editor.getSelectedTargets());
  };

  private onCopy = async (e: any) => {
    if (checkInput(e.target)) {
      return false;
    }
    e.preventDefault();

    const clipboardData = (e as any).clipboardData as DataTransfer;
    const { moveableData } = this.editor;
    const targets = moveableData.getSelectedTargets();
    const SavedScenaData = this.editor.saveTargets(targets);

    this.editor.console.log('copy scena data', SavedScenaData);
    clipboardData.setData(TYPE_SCENA_LAYERS, JSON.stringify(SavedScenaData));

    return true;
  };
  private onPaste = (e: any) => {
    if (checkInput(e.target)) {
      return;
    }

    this.read((e as any).clipboardData);
    e.preventDefault();
  };
  private readDataTransfter(data: DataTransfer) {
    const { types } = data;
    const hasScena = types.indexOf(TYPE_SCENA_LAYERS) > -1;

    if (hasScena) {
      const scenaDatas = JSON.parse(data.getData(TYPE_SCENA_LAYERS)) as TSavedScenaData[];

      this.editor.console.log('paste scena data', scenaDatas);

      this.editor.loadDatas(scenaDatas);
      return true;
    }
    return false;
  }
  private async read(data: DataTransfer) {
    if (this.readDataTransfter(data)) {
      return true;
    }
    const clipboardItems: ClipboardItem[] = await (navigator.clipboard as any).read();

    let hasText = false;
    const isPaste =
      clipboardItems.filter((item) => {
        const { types } = item;

        const hasImage = types.indexOf('image/png') > -1;
        hasText = hasText || types.indexOf('text/plain') > -1;

        if (hasImage) {
          item.getType('image/png').then((blob) => {
            this.editor.appendBlob(blob);
          });
          return true;
        }
        return false;
      }).length > 0;

    if (!isPaste && hasText) {
      const text = await navigator.clipboard.readText();

      this.editor.appendJSXs([
        {
          jsx: <div contentEditable="true"></div>,
          name: '(Text)',
          innerText: text,
        },
      ]);
    }
    return true;
  }
}
