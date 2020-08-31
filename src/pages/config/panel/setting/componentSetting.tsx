import styles from './index.less';
import React, { useEffect } from 'react';
import * as chartLib from '@/component/chartItem/option';
import { Switch } from 'antd';
import Field from '@/component/field';
import { IChartConfig } from '@/component/chartItem/interface';
import * as R from 'ramda';
import { useSetState } from 'react-use';
import Radio from '@/component/field/Radio';
import { IPanelConfig } from '@/models/common';

export const FormItem = ({
  value,
  onChange,
  config: { defaultValue, type, key, title, ...config },
}: {
  config: IChartConfig;
  value: string | number | boolean;
  onChange: (e: string | number | boolean) => void;
}) => {
  let Item: null | React.ReactNode = null;
  switch (type) {
    case 'input':
    default:
      Item = (
        <input
          type="number"
          onChange={e => {
            onChange(Number(e.target.value));
          }}
          value={String(value)}
          {...config}
        />
      );
      break;
    case 'radio':
      let { option, ...props } = config;
      Item = <Radio onChange={onChange} value={value} config={option} {...props} />;
      break;
    case 'switch':
      Item = <Switch checked={value as boolean} onChange={onChange} {...config} />;
      break;
  }
  return <Field title={title || key}>{Item}</Field>;
};

/**
 * 获取初始状态
 * @param configs 组件对外导出的配置项
 * @param componentConfig 组件默认存储的设置信息
 */
export const getDefaultState = (configs: IChartConfig[], componentConfig: {}) => {
  let res = {};
  configs.forEach(item => {
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
        {configs.map(config => (
          <FormItem
            key={config.key}
            value={state[config.key]}
            onChange={res => {
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
