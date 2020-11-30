import styles from './index.less';
import React, { useEffect } from 'react';
import * as chartLib from '@/component/chartItem/option';
import Field from '@/component/field';
import { IChartConfig } from '@/component/chartItem/interface';
import * as R from 'ramda';
import { useSetState } from 'react-use';
import { IPanelConfig } from '@/models/common';
import ColorPicker, { PureColor } from '@/component/field/ColorPicker';
import Radio, { Select } from '@/component/field/Radio';
import AntSelect from '@/component/field/Select';
import InputRange from '@/component/field/InputRange';
import { ImgSelector } from '@/component/field';
import { Switch } from 'antd';

import { Divider } from 'antd';

export const FormItem = ({
  value,
  onChange,
  config: { defaultValue, valueType = 'number', type, key, title, ...config },
  style,
}: {
  config: IChartConfig;
  value: string | number | boolean;
  onChange: (e: string | number | boolean) => void;
  style?: React.CSSProperties;
  type?: string;
  [key: string]: any;
}) => {
  if (type === 'divider') {
    return <Divider plain>{title}</Divider>;
  } else if (type === 'label') {
    return (
      <Field style={style}>
        <label style={{ color: '#6e7481' }}>{title}</label>
      </Field>
    );
  } else if (type === 'image') {
    return <ImgSelector onChange={onChange} value={value as string} title={title} {...config} />;
  }
  let Item: null | React.ReactNode = null;
  switch (type) {
    case 'input':
    default:
      Item = (
        <input
          type={valueType}
          onChange={(e) => {
            onChange(valueType === 'number' ? Number(e.target.value) : e.target.value);
          }}
          className="data_input"
          value={String(R.isNil(value) ? '' : value)}
          {...config}
        />
      );
      break;
    case 'radio':
      let { option, ...props } = config;
      Item = <Radio onChange={onChange} value={value} config={option} {...props} />;
      break;
    case 'select':
      Item = <Select onChange={onChange} value={value} config={config.option} />;
      break;
    case 'antselect':
      Item = <AntSelect onChange={onChange} value={value} config={config.option} />;
      break;
    case 'switch':
      Item = <Switch checked={value as boolean} onChange={onChange} {...config} />;
      break;
    case 'range':
      Item = <InputRange value={Number(value)} onChange={onChange} {...config} />;
      break;
    case 'color':
      Item = <ColorPicker value={value} onChange={onChange} {...config} />;
      break;
    case 'purecolor':
      Item = <PureColor value={value} onChange={onChange} {...config} />;
      break;
    case 'slider':
      Item = (
        <div className="alignRow">
          <input
            type="number"
            className="data_input"
            value={value[0] || 0}
            onChange={(e) => {
              let val = Number(e.target.value);
              onChange([val, value[1]]);
            }}
            {...config}
          />
          <span style={{ margin: '0 8px' }}> {config.split || '~'} </span>
          <input
            type="number"
            className="data_input"
            onChange={(e) => {
              let val = Number(e.target.value);
              onChange([value[0], val]);
            }}
            value={value[1] || 0}
            {...config}
          />
        </div>
      );
      break;
  }
  return (
    <Field title={title || key} style={style}>
      {Item}
    </Field>
  );
};

/**
 * 获取初始状态
 * @param configs 组件对外导出的配置项
 * @param componentConfig 组件默认存储的设置信息
 */
export const getDefaultState = (configs: IChartConfig[] = [], componentConfig: {}) => {
  let res = {};
  configs.forEach((item) => {
    res[item.key] = typeof item.defaultValue === 'undefined' ? '' : item.defaultValue;
  });
  // 组件编辑后存储的状态优秀级更高，当为空时采用组件配置项中给出的默认值；
  return { ...res, ...componentConfig };
};

export default ({
  onChange,
  panel: { key, componentConfig },
}: {
  onChange: (e: any) => void;
  panel: IPanelConfig;
}) => {
  let res = R.prop(key, chartLib);
  if (!res) {
    return <p>组件配置信息异常，请联系管理员。</p>;
  }

  let configs = res.config as IChartConfig[];

  if (R.type(configs) != 'Array' || configs.length === 0) {
    return <p>该组件未设置参数</p>;
  }

  const [state, setState] = useSetState(getDefaultState(configs, componentConfig));
  useEffect(() => {
    setState(getDefaultState(configs, componentConfig));
  }, [JSON.stringify(configs)]);

  return (
    <div className={styles.pageconfig} style={{ height: '100%' }}>
      <div className={styles['datav-gui']}>
        {configs.map((config) => (
          <FormItem
            key={config.key || Math.random().toString(16).slice(2, 8)}
            value={state[config.key]}
            onChange={(res) => {
              let next = {
                [config.key]: res,
              };
              setState(next);
              onChange({
                ...state,
                ...next,
              });
            }}
            config={config}
          />
        ))}
      </div>
    </div>
  );
};
