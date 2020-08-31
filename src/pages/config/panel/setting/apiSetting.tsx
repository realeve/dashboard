import React, { useEffect } from 'react';
import * as chartLib from '@/component/chartItem/option';
import { IApiConfig, IChartConfig } from '@/component/chartItem/interface';
import * as R from 'ramda';
import { useSetState } from 'react-use';
import { IPanelConfig } from '@/models/common';
import { FormItem, getDefaultState } from './componentSetting';
import styles from './index.less';

const initState = (configs: IApiConfig, api: any) => {
  // 配置项中的信息
  let setting = getDefaultState(configs.config, api);
  return { ...setting, ...api };
};

const appendConfig: IChartConfig[] = [
  {
    title: '发起请求',
    key: 'show',
    type: 'switch',
    checkedChildren: '显示',
    unCheckedChildren: '隐藏',
  },
  {
    title: '类型',
    key: 'api_type',
    type: 'radio',
    defaultValue: 'url',
    option: [
      {
        title: '实时数据',
        value: 'url',
      },
      {
        title: '模拟数据',
        value: 'mock',
      },
    ],
  },
  {
    key: 'url',
  },
];

const JsonViewer = ({ json }) => {
  return (
    <div className={styles.jsonwrapper}>
      <div className={styles.title}>(在下方粘贴模拟数据)</div>
      <div className={styles.json}>{JSON.stringify(json)}</div>
    </div>
  );
};

export default ({
  onChange,
  panel: { key, api },
}: {
  onChange: (e: any) => void;
  panel: IPanelConfig;
}) => {
  let res = R.prop(key, chartLib);
  if (!res) {
    return <p>组件配置信息异常，请联系管理员。</p>;
  }

  let configs = res.apiConfig as IApiConfig;

  if (R.type(configs) != 'Object' || !configs.show) {
    return <p>该组件无数据请求，无需配置接口信息</p>;
  }

  const [state, setState] = useSetState(initState(configs, api));
  useEffect(() => {
    setState(initState(configs, api));
  }, [JSON.stringify(configs)]);

  console.log(state);

  const handleStateChange = (res, config) => {
    let next = {
      [config.key]: res,
    };
    setState(next);
    onChange({
      ...state,
      ...next,
    });
  };

  return (
    <div className={styles.pageconfig} style={{ height: '100%' }}>
      <div className={styles['datav-gui']}>
        <FormItem
          value={state[appendConfig[0].key]}
          onChange={res => {
            handleStateChange(res, appendConfig[0]);
          }}
          config={appendConfig[0]}
        />
        {state.show && (
          <FormItem
            value={state[appendConfig[1].key]}
            onChange={res => {
              handleStateChange(res, appendConfig[1]);
            }}
            config={appendConfig[1]}
          />
        )}
        {state.api_type === 'url' ? (
          <FormItem
            value={state[appendConfig[2].key]}
            onChange={res => {
              handleStateChange(res, appendConfig[2]);
            }}
            config={appendConfig[2]}
          />
        ) : (
          <JsonViewer json={res.defaultValue || {}} />
        )}

        {state.show &&
          configs.config.map((config, idx) => (
            <FormItem
              style={{ paddingTop: idx == 0 ? 10 : 0 }}
              key={config.key}
              value={state[config.key]}
              onChange={res => {
                handleStateChange(res, config);
              }}
              config={config}
            />
          ))}
      </div>
    </div>
  );
};
