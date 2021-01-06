// 页面全屏，根据以下链接修改而来
// https://github.com/streamich/react-use/blob/master/src/useFullscreen.ts

import { useState } from 'react';
import screenfull from 'screenfull';
import { useIsomorphicLayoutEffect } from 'react-use';

const noop = () => {};

/**
 *
 * @param on 初始状态
 * @param onClose 关闭函数
 */
const useFullscreen = (on: boolean, onClose: (error?: Error) => void = noop): boolean => {
  const [isFullscreen, setIsFullscreen] = useState(on);

  useIsomorphicLayoutEffect(() => {
    if (!on) {
      return;
    }

    const onChange = () => {
      if (screenfull.isEnabled) {
        const isScreenfullFullscreen = screenfull.isFullscreen;
        setIsFullscreen(isScreenfullFullscreen);
        if (!isScreenfullFullscreen) {
          onClose();
        }
      }
    };

    if (screenfull.isEnabled) {
      try {
        screenfull.request();
        setIsFullscreen(true);
      } catch (error) {
        onClose(error);
        setIsFullscreen(false);
      }
      screenfull.on('change', onChange);
    } else {
      onClose();
      setIsFullscreen(false);
    }

    return () => {
      setIsFullscreen(false);
      if (screenfull.isEnabled) {
        try {
          screenfull.off('change', onChange);
          screenfull.exit();
        } catch {}
      }
    };
  }, [on]);

  return isFullscreen;
};

export default useFullscreen;
