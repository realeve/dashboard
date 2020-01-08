/**
 * 随机生成一个唯一ID
 */
export function uuid() {
  return `${'xxxx-xxxx-xxxx'.replace(/x/g, () => ((Math.random() * 16) | (0 & 0x3)).toString(16))}`;
}

export function getElementDispay(item: HTMLElement) {
  return getComputedStyle(item, null).display;
}

export function getPosition(target: HTMLElement): { top: number; left: number } {
  const { top, left } = target.getBoundingClientRect();
  return {
    top: top + window.scrollY,
    left: left + window.scrollX,
  };
}

export function translate(term: string): string {
  // map to G2Ploterm names
  if (term === 'GroupedBar') return 'GroupBar';
  if (term === 'StackedBar') return 'StackBar';
  if (term === 'PercentageStackedBar') return 'PercentageStackBar';
  if (term === 'GroupedColumn') return 'GroupColumn';
  if (term === 'StackedColumn') return 'StackColumn';
  if (term === 'PercentageStackedColumn') return 'PercentageStackColumn';
  if (term === 'Donut') return 'Ring';
  if (term === 'StackedArea') return 'StackArea';
  if (term === 'PercentageStackedArea') return 'PercentageStackArea';
  return term;
}
