export function isDocumentVisible(): boolean {
  if (typeof document !== 'undefined' && typeof document.visibilityState !== 'undefined') {
    return document.visibilityState !== 'hidden';
  }
  return true;
}

export function isOnline(): boolean {
  if (typeof navigator.onLine !== 'undefined') {
    return navigator.onLine;
  }
  return true;
}

export function limit(fn: any, timespan: number = 2000) {
  let pending = false;
  return (...args: any[]) => {
    if (pending) return;
    pending = true;
    fn(...args);
    setTimeout(() => {
      pending = false;
    }, timespan);
  };
}
