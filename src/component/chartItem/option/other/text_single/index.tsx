import React, { useRef, useEffect } from 'react';
// 此处导入你所需要的自定义组件
import { IChartMock, IApiConfig, IChartConfig } from '@/component/chartItem/interface';
import * as lib from '@/component/chartItem/option/lib';
import styles from './index.less';

import { connect } from 'dva';

import ContentEditable from 'react-contenteditable';
import { ICommon } from '@/models/common';

export let mock: IChartMock = {
  data: [[45.7]],
  title: '进度条_MOCK数据',
  header: ['指标值'],
  rows: 1,
  hash: 'mockdata',
};

export const config: IChartConfig[] = [
  {
    key: 'opacity',
    type: 'range',
    defaultValue: 1,
    title: '透明度',
    min: 0.1,
    max: 1,
    step: 0.05,
  },
  {
    key: 'content',
    valueType: 'text',
    defaultValue: '在这里输入文字',
    title: '文本内容',
  },
  ...lib.getFontConfig(25, '#27e2e6'),
  {
    key: 'textShadowBlur',
    type: 'range',
    defaultValue: 0,
    title: '文字阴影',
    min: 0,
    max: 100,
    step: 1,
  },
  {
    key: 'textShadowColor',
    defaultValue: 'rgba(39 ,228, 247 , 0.85)',
    title: '阴影颜色',
    type: 'purecolor',
  },
  {
    key: 'textShadowOffsetX',
    defaultValue: 0,
    title: '阴影偏移X',
    type: 'range',
    min: -30,
    max: 30,
    step: 1,
  },
  {
    key: 'textShadowOffsetY',
    defaultValue: 0,
    title: '阴影偏移Y',
    type: 'range',
    min: -30,
    max: 30,
    step: 1,
  },
];

export const apiConfig: IApiConfig = {};

const Index = ({ option: { data, ...componentConfig }, chartid, dispatch, pathname }) => {
  let {
    fontSize = 25,
    fontColor = '#27e2e6',
    letterSpacing = 0,
    fontWeight = 'normal',
    opacity = 1,
    textShadowBlur = 0,
    textShadowColor = 'rgba(39 ,228, 247 , 0.85)',
    textShadowOffsetX = 0,
    textShadowOffsetY = 0,
    content = '这里输入文字',
  } = componentConfig;

  // 此处像正常的react组件处理，返回对应的信息即可
  let textShadow =
    textShadowBlur == 0
      ? {}
      : {
          textShadow: `${textShadowOffsetX}px ${textShadowOffsetY}px ${textShadowBlur}px ${textShadowColor}`,
        };

  const updateContent = (content = '') => {
    dispatch({
      type: 'common/updatePanelAttrib',
      payload: {
        idx: chartid,
        attrib: { componentConfig: { ...componentConfig, content } },
      },
    });
  };

  const text = useRef(content);

  const handleChange = (e) => {
    text.current = e.target.value;
  };
  const handleBlur = () => {
    updateContent(text.current);
    // 文本编辑结束 ，重新回到选择工具
    dispatch({
      type: 'common/setStore',
      payload: {
        curTool: 'MoveTool',
      },
    });
  };

  useEffect(() => {
    if (text.current !== content) {
      text.current = content;
    }
  }, [content]);

  return (
    <ContentEditable
      className={styles.text}
      style={{
        fontSize,
        fontWeight,
        color: fontColor,
        opacity,
        letterSpacing,
        ...textShadow,
      }}
      html={text.current}
      onBlur={handleBlur}
      onChange={handleChange}
      suppressContentEditableWarning={true}
      disabled={pathname == '/'}
    />
  );
};
export default connect(({ common: { pathname } }: { common: ICommon }) => ({
  pathname,
}))(Index);
