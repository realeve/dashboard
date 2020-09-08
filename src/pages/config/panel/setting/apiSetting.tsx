import React, { useEffect } from 'react';
import * as chartLib from '@/component/chartItem/option';
import { IApiConfig, IChartConfig } from '@/component/chartItem/interface';
import * as R from 'ramda';
import { useSetState } from 'react-use';
import { IPanelConfig } from '@/models/common';
import { FormItem, getDefaultState } from './componentSetting';
import styles from './index.less';
import JsonViewer from './JsonViewer';

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
    checkedChildren: 'ajax',
    unCheckedChildren: '否',
  },
  {
    title: '定时刷新(秒)',
    key: 'interval',
    defaultValue: '',
    placeholder: '单位:秒',
    min: 0,
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
    valueType: 'text',
    placeholder: '在此填入接口地址',
  },
];

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

  if (R.type(configs) != 'Object') {
    return <p>该组件无数据请求，无需配置接口信息</p>;
  }

  const [state, setState] = useSetState(initState(configs, api));
  useEffect(() => {
    setState(initState(configs, api));
  }, [JSON.stringify(configs)]);

  // 是否需要立即刷新
  const handleStateChange = (res, config, update = true) => {
    let next = {
      [config.key]: res,
    };
    setState(next);
    update &&
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
              if (res === 'mock') {
                handleStateChange('', appendConfig[2]);
              }
              handleStateChange(res, appendConfig[1]);
            }}
            config={appendConfig[1]}
          />
        )}
        {state.show &&
          (state.api_type === 'url' ? (
            <FormItem
              value={state[appendConfig[2].key]}
              onChange={res => {
                handleStateChange(res, appendConfig[2]);
              }}
              config={appendConfig[2]}
            />
          ) : (
            <JsonViewer
              value={state.mock || JSON.stringify(res.mock || '')}
              onChange={res => {
                handleStateChange(res, { key: 'mock' });
              }}
            />
          ))}

        {state.show &&
          configs.config.map((config, idx) => (
            <FormItem
              style={{ paddingTop: idx == 0 ? 10 : 0 }}
              key={config.key}
              value={state[config.key]}
              onChange={res => {
                handleStateChange(res, config, false);
              }}
              config={config}
            />
          ))}

        <div
          className={styles.btn}
          onClick={() => {
            onChange(state);
          }}
        >
          应用设置
        </div>
      </div>
    </div>
  );
};
