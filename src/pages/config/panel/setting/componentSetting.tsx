import styles from './index.less';
import React, { useEffect } from 'react';
import * as chartLib from '@/component/chartItem/option';
import { Switch } from 'antd';
import Field from '@/component/field';
import { IChartConfig } from '@/component/chartItem/interface';
import * as R from 'ramda';
import { useSetState } from 'react-use';
import Radio from '@/component/field/Radio';

const FormItem = ({
  value,
  onChange,
  config: { defaultValue, type, key, title, ...config },
}: {
  config: IChartConfig;
  value: string | number;
  onChange: (e: string | number) => void;
}) => {
  switch (type) {
    case 'input':
    default:
      return (
        <input
          type="number"
          onChange={e => {
            onChange(Number(e.target.value));
          }}
          value={String(value)}
          {...config}
        />
      );
    case 'radio':
      let { option, ...props } = config;
      return <Radio onChange={onChange} value={value} config={option} {...props} />;
  }
};

/**
 * 获取初始状态
 * @param configs 组件对外导出的配置项
 */
const getDefaultState = (configs: IChartConfig[]) => {
  let res = {};
  configs.forEach(item => {
    res[item.key] = typeof item.defaultValue === 'undefined' ? '' : item.defaultValue;
  });
  return res;
};

export default ({ onChange, chartkey }: { onChange: (e: any) => void; chartkey: string }) => {
  let res = R.prop(chartkey, chartLib);
  if (!res) {
    return <p>组件配置信息异常，请联系管理员。</p>;
  }

  let configs = res.config as IChartConfig[];

  if (R.type(configs) != 'Array' || configs.length === 0) {
    return <p>该组件未设置参数</p>;
  }

  const [state, setState] = useSetState(getDefaultState(configs));
  useEffect(() => {
    setState(getDefaultState(configs));
  }, [JSON.stringify(configs)]);

  return (
    <div className={styles.pageconfig} style={{ height: '100%' }}>
      <div className={styles['datav-gui']}>
        {configs.map(config => (
          <Field title={config.title || config.key}>
            <FormItem
              value={state[config.key]}
              onChange={res => {
                setState({
                  [config.key]: res,
                });
              }}
              config={config}
            />
          </Field>
        ))}
      </div>
    </div>
  );
};
