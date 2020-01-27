import { useState, useCallback, useEffect, useRef } from 'react';

/**
 * @description                       将函数转成防抖动函数
 * @param  {Function}                 需要转成防抖动函数的函数
 * @param  {number}                   延迟时间（毫秒数）
 * @param  {boolean}                  是否执行第一次
 * @return {undefined}                无返回值
 */
export function debounce(fn, delay = 600, runFirstFn = true) {
  let timer = null;

  return function(...rest) {
    // 清除定时器
    clearTimeout(timer);
    if (runFirstFn) {
      fn.apply(this, rest);
      runFirstFn = false;
      return;
    }

    // 设置定时器
    timer = setTimeout(fn.bind(this, ...rest), delay);
  };
}

export function observerDomResize(dom, callback) {
  const MutationObserver =
    window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

  const observer = new MutationObserver(callback);

  observer.observe(dom, {
    attributes: true,
    attributeFilter: ['style'],
    attributeOldValue: true,
  });

  return observer;
}

export function co(gen) {
  let destroyed = false;

  if (typeof gen === 'function') gen = gen();

  if (!gen || typeof gen.next !== 'function') return () => ({});

  Promise.resolve().then(() => {
    destroyed || next(gen.next());
  });

  return () => {
    destroyed = true;

    Promise.resolve().then(() => {
      gen.return();

      gen = null;
    });
  };

  function next(ret) {
    if (ret.done) return ret.value;

    return Promise.resolve(ret.value).then(() => {
      destroyed || next(gen.next());
    });
  }
}

export function useAutoResize() {
  const [state, setState] = useState({ width: 0, height: 0 });

  const domRef = useRef(null);
  const domObserverRef = useRef(null);
  const debounceSetWHFunRef = useRef(null);

  const setWH = useCallback(() => {
    const { clientWidth, clientHeight } = domRef.current;

    setState({ width: clientWidth, height: clientHeight });
  }, []);

  const bindDomResizeCallback = useCallback(() => {
    domObserverRef.current = observerDomResize(domRef.current, debounceSetWHFunRef.current);

    window.addEventListener('resize', debounceSetWHFunRef.current);
  }, []);

  const unbindDomResizeCallback = useCallback(() => {
    const { current: domObserver } = domObserverRef;

    domObserver.disconnect();
    domObserver.takeRecords();
    domObserverRef.current = null;

    window.removeEventListener('resize', debounceSetWHFunRef.current);
  }, []);

  useEffect(() => {
    debounceSetWHFunRef.current = debounce(setWH, 100);

    debounceSetWHFunRef.current();

    bindDomResizeCallback();

    // 组件销毁时，清除事件
    return unbindDomResizeCallback;
  }, []);

  return { ...state, domRef };
}
