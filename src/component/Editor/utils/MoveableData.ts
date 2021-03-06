import MoveableHelper from 'moveable-helper';
import type Memory from './Memory';
import { getId } from './utils';

export default class MoveableData extends MoveableHelper {
  public selectedTargets: (HTMLElement | SVGElement)[] = [];
  private memory: Memory;
  constructor() {
    super({
      createAuto: true,
    });
  }
  public setSelectedTargets(targets: (HTMLElement | SVGElement)[]) {
    this.selectedTargets = targets;
  }
  public getSelectedTargets() {
    return this.selectedTargets;
  }
  public getSelectedFrames() {
    return this.getSelectedTargets().map((target) => this.getFrame(target));
  }
  public renderFrames() {
    this.getSelectedTargets().forEach((target: any) => {
      this.render(target);
    });
  }
  public setProperty(names: string[], value: any) {
    const targets = this.getSelectedTargets();

    const infos = targets.map((target) => {
      const frame = this.getFrame(target);
      const prev = frame.get();
      frame.set(...names, value);
      const next = frame.get();

      return { id: getId(target), prev, next };
    });
    this.renderFrames();

    return infos;
  }
  public removeProperties(...names: string[]) {
    return this.getSelectedTargets().map((target) => {
      const frame = this.getFrame(target);
      const prev = frame.get();

      names.forEach((name) => {
        frame.remove(name);
        target.style.removeProperty(name);
      });
      const next = frame.get();

      return { id: getId(target), prev, next };
    });
  }
  public getProperties(properties: string[][], defaultValues: any[]) {
    const frames = this.getSelectedFrames();
    const { memory } = this;

    if (!frames.length) {
      return properties.map((property, i) => memory.get(property.join('///')) || defaultValues[i]);
    }

    return properties.map((property, i) => {
      const frameValues = frames.map((frame) => frame.get(...property));

      return frameValues.filter((color) => color)[0] || defaultValues[i];
    });
  }
}
