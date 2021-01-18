import React, { useEffect, useState } from 'react';

import type { IApiConfig, IChartConfig } from '@/component/chartItem/interface';
import * as R from 'ramda';
import { useSetState } from 'react-use';
import type { IPanelConfig } from '@/models/common';
import { FormItem, getDefaultState } from './componentSetting';
import styles from './index.less';
import JsonViewer from './JsonViewer';
import { rangeConfig } from '@/utils/range';
import { Spin } from 'antd';
import { chartList } from '@/component/chartItem/option';

import { getDataType } from '@/utils/lib';

const initState = (configs: IApiConfig, api: any, dataType: 'array' | 'json' = 'array') => {
  const { config, type, ...props } = configs;
  // 配置项中的信息
  const setting = getDefaultState(config, api);

  return { dataType, ...props, api_type: type, ...setting, ...api };
};
const cacheConfig: IChartConfig = { defaultValue: 2, min: 0, step: 0.5, max: 10, type: 'range' };
const appendConfig: IChartConfig[] = [
  {
    title: '发起请求',
    key: 'show',
    type: 'switch',
    checkedChildren: 'ajax',
    unCheckedChildren: '否',
    defaultValue: 'ajax',
  },
  {
    title: '定时刷新(分钟)',
    key: 'interval',
    placeholder: '单位:分钟',
    ...cacheConfig,
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
    title: '数据类型',
    key: 'dataType',
    type: 'radio',
    defaultValue: 'array',
    option: [
      {
        title: '数组',
        value: 'array',
      },
      {
        title: 'JSON',
        value: 'json',
      },
    ],
  },
  {
    key: 'url',
    title: '接口URL',
    subTitle: '默认为json，建议指定数据类型',
    valueType: 'text',
    placeholder: '接口地址',
  },
  {
    title: '附加参数',
    subTitle: '自动附加到接口中，可不填',
    key: 'appendParam',
    type: 'input',
    valueType: 'text',
    defaultValue: '',
    placeholder: 'prefix=9607T&suffix=2&b=3',
  },
  rangeConfig,
  {
    key: 'cache',
    title: '缓存(分钟)',
    defaultValue: 2,
    min: 0,
    step: 0.5,
    max: 10,
    type: 'range',
  },
  {
    key: 'carouselKey',
    subTitle: '启用循环滚动后，以哪个字段作为分组',
    title: '滚动分组字段',
    defaultValue: 0,
    valueType: 'number',
  },
  {
    key: 'carouselTime',
    subTitle: '间隔多少秒滚动一次',
    title: '停留时长',
    defaultValue: 10,
    min: 2,
    step: 2,
    max: 60,
    type: 'range',
  },
  {
    key: 'isCarousel',
    title: '开启循环滚动',
    defaultValue: false,
    type: 'switch',
  },
  {
    key: 'showReport',
    subTitle: '显示该组件所引用的源数据',
    title: '显示报表',
    defaultValue: true,
    type: 'switch',
  },
  {
    key: 'reportParam',
    subTitle: '报表组件参数',
    title: '报表组件参数',
    defaultValue: '',
    type: 'input',
    valueType: 'text',
    placeholder: 'mergev=0&merge=0-2&mergetext=3',
  },
];

const ApiSetting = ({
  onChange,
  panel: { api },
  isBusiness = false,
  chartLib,
}: {
  onChange: (e: any, title?: string) => void;
  panel: IPanelConfig;
  isBusiness?: boolean;
  chartLib: any;
}) => {
  const configs = chartLib.apiConfig as IApiConfig;

  const [state, setState] = useSetState(initState(configs, api, getDataType(chartLib.mock)));
  useEffect(() => {
    setState(initState(configs, api));
  }, [JSON.stringify(configs)]);

  // 是否需要立即刷新
  const handleStateChange = (res, config, update = true) => {
    const next = {
      [config.key]: res,
    };

    // 数据一致时不更新
    if (R.equals(res, state[config.key])) {
      return;
    }

    setState(next);
    update &&
      onChange({
        ...state,
        ...next,
      });
  };

  const arrSettings = state.isCarousel
    ? [0, 1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    : [0, 1, 2, 4, 5, 6, 7, 8, 10, 11, 12];

  return (
    <div className={styles.pageconfig} style={{ height: '100%' }}>
      <div className={styles['datav-gui']}>
        {arrSettings.map(
          (i) =>
            (i < 2 || state.show) && (
              <FormItem
                key={appendConfig[i].key}
                value={state[appendConfig[i].key]}
                onChange={(res) => {
                  handleStateChange(res, appendConfig[i]);
                }}
                config={appendConfig[i]}
                disabled={[0, 2].includes(i) && isBusiness}
              />
            ),
        )}
        {state.show &&
          (state.api_type === 'url' ? (
            <FormItem
              value={state[appendConfig[3].key]}
              onChange={(res) => {
                handleStateChange(res, appendConfig[3]);
              }}
              config={appendConfig[3]}
              disabled={isBusiness}
            />
          ) : (
            <JsonViewer
              value={state.mock || JSON.stringify(chartLib.mock || '')}
              onChange={(res) => {
                handleStateChange(res, { key: 'mock' });
              }}
            />
          ))}

        {state.show &&
          configs.config.map((config, idx) => (
            <FormItem
              style={{ paddingTop: idx === 0 ? 10 : 0 }}
              key={config.key || Math.random().toString(16).slice(2, 8)}
              value={state[config.key]}
              onChange={(res) => {
                handleStateChange(res, config, false);
              }}
              config={config}
              disabled={isBusiness}
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

export default (props) => {
  if (!chartList.includes(props.panel.key)) {
    return <p>组件配置信息异常，请联系管理员。</p>;
  }

  const [chartLib, setChartLib] = useState(null);
  useEffect(() => {
    import(`../../../../component/chartItem/charts/${props.panel.key}`).then((res) => {
      setChartLib({ ...res.default });
    });
  }, [props.panel.key]);

  if (!chartLib) {
    return <Spin spinning />;
  }
  // TODO 此处注释后可能会存在BUG，待观察
  // if (R.type(props.configs) !== 'Object') {
  //   return null;
  // }

  return <ApiSetting {...props} chartLib={chartLib} />;
};
