import React, { useState } from 'react';
// 此处导入你所需要的自定义组件
import { Button } from 'antd';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons';

// 此组件参考https://github.com/any86/be-full
type RFSMethodName =
  | 'webkitRequestFullScreen'
  | 'requestFullscreen'
  | 'msRequestFullscreen'
  | 'mozRequestFullScreen';
type EFSMethodName =
  | 'webkitExitFullscreen'
  | 'msExitFullscreen'
  | 'mozCancelFullScreen'
  | 'exitFullscreen';
type FSEPropName =
  | 'webkitFullscreenElement'
  | 'msFullscreenElement'
  | 'mozFullScreenElement'
  | 'fullscreenElement';
type ONFSCPropName =
  | 'onfullscreenchange'
  | 'onwebkitfullscreenchange'
  | 'onmozfullscreenchange'
  | 'MSFullscreenChange';

const fullscreen = ({ option: { data, x = 0 }, style }) => {
  const [enableflag, setenableflag] = useState<boolean>(false);
  const DOC_EL = document.documentElement;

  let RFC_METHOD_NAME: RFSMethodName = 'requestFullscreen';
  let EFS_METHOD_NAME: EFSMethodName = 'exitFullscreen';
  let FSE_PROP_NAME: FSEPropName = 'fullscreenElement';
  let ON_FSC_PROP_NAME: ONFSCPropName = 'onfullscreenchange';

  if (`mozRequestFullScreen` in DOC_EL) {
    RFC_METHOD_NAME = 'mozRequestFullScreen';
    EFS_METHOD_NAME = 'mozCancelFullScreen';
    FSE_PROP_NAME = 'mozFullScreenElement';
    ON_FSC_PROP_NAME = 'onmozfullscreenchange';
  } else if (`webkitRequestFullScreen` in DOC_EL) {
    RFC_METHOD_NAME = 'webkitRequestFullScreen';
    EFS_METHOD_NAME = 'webkitExitFullscreen';
    FSE_PROP_NAME = 'webkitFullscreenElement';
    ON_FSC_PROP_NAME = 'onwebkitfullscreenchange';
  } else if (`msRequestFullscreen` in DOC_EL) {
    RFC_METHOD_NAME = 'msRequestFullscreen';
    EFS_METHOD_NAME = 'msExitFullscreen';
    FSE_PROP_NAME = 'msFullscreenElement';
    ON_FSC_PROP_NAME = 'MSFullscreenChange';
  } else if (!(`requestFullscreen` in DOC_EL)) {
    throw `当前浏览器不支持Fullscreen API !`;
  }

  /**
   * 启用全屏
   * @param  {HTMLElement} 元素
   * @param  {FullscreenOptions} 选项
   * @returns {Promise}
   */
  const beFull = (el: HTMLElement = DOC_EL, options?: FullscreenOptions): Promise<void> => {
    return el[RFC_METHOD_NAME](options);
  };

  /**
   * 退出全屏
   */
  const exitFull = (): Promise<void> => {
    return document[EFS_METHOD_NAME]();
  };
  /**
   * 元素是否全屏
   * @param {HTMLElement}
   */
  const isFull = (el: HTMLElement | EventTarget): boolean => {
    return el === document[FSE_PROP_NAME];
  };

  /**
   * 切换全屏/关闭
   * @param  {HTMLElement} 目标元素
   * @returns {Promise}
   */
  const toggleFull = (el: HTMLElement = DOC_EL, options?: FullscreenOptions): Promise<void> => {
    if (isFull(el) && enableflag) {
      return exitFull();
    } else {
      return beFull(el, options);
    }
  };

  /**
   * 当全屏/退出时触发
   * @param  {HTMLElement} 元素
   * @param  {(isFull: boolean) => void} 返回"是否全屏"
   */
  const watchFull = (el: HTMLElement, callback: (isFull: boolean) => void) => {
    const cancel = () => {
      el.onfullscreenchange = null;
    };

    const handler = (event: Event) => {
      if (null !== event.target) {
        callback(isFull(event.target));
      }
    };

    // 这里addEventListener不好使
    el[ON_FSC_PROP_NAME] = handler;

    return {
      cancel,
    };
  };

  const onclick = () => {
    toggleFull();
    setenableflag(!enableflag);
  };

  return (
    <Button
      icon={enableflag ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
      style={{ ...style }}
      onClick={onclick}
    >
      全屏
    </Button>
  );
};

export default fullscreen;
