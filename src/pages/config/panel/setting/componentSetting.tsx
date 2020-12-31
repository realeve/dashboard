import styles from './index.less';
import React, { useEffect, useState } from 'react';
import type { IChartConfig } from '@/component/chartItem/interface';
import * as R from 'ramda';
import type { IPanelConfig } from '@/models/common';
import { FormItem } from './FormItem';

export { FormItem } from './FormItem';

/**
 * 获取初始状态
 * @param configs 组件对外导出的配置项
 * @param componentConfig 组件默认存储的设置信息
 */
export const getDefaultState = (configs: IChartConfig[] = [], componentConfig: Object) => {
  const res = {};
  configs.forEach((item) => {
    res[item.key] = typeof item.defaultValue === 'undefined' ? '' : item.defaultValue;
  });
  // 组件编辑后存储的状态优秀级更高，当为空时采用组件配置项中给出的默认值；
  return { ...res, ...componentConfig };
};

export default ({
  onChange,
  panel: { key, componentConfig, id },
}: {
  onChange: (e: any, title?: string) => void;
  panel: IPanelConfig;
}) => {
  const [configs, setConfigs] = useState<IChartConfig[]>(null);
  const [state, setState] = useState({});

  // 当key变更时，重新载入默认值
  useEffect(() => {
    init();
  }, [id]);

  const init = async () => {
    const { default: res } = await import(`../../../../component/chartItem/charts/${key}`);
    if (!res) {
      setConfigs(null);
      return;
    }
    setConfigs(res.config);
    setState(getDefaultState(res.config, componentConfig));
  };

  if (!configs) {
    return <p>组件配置信息异常，请联系管理员。</p>;
  }

  if (R.type(configs) != 'Array' || configs.length === 0) {
    return <p>该组件未设置参数</p>;
  }

  return (
    <div className={styles.pageconfig} style={{ height: '100%' }}>
      <div className={styles['datav-gui']}>
        {configs.map((config) => (
          <FormItem
            key={config.key || Math.random().toString(16).slice(2, 8)}
            value={state[config.key]}
            onChange={(res) => {
              // 数据一致时不更新
              if (R.equals(res, state[config.key])) {
                return;
              }

              const next = {
                ...state,
                [config.key]: res,
              };

              setState(next);

              const val = String(res).length < 10 ? ` 调整( ${state[config.key]} → ${res} )` : '';
              onChange(next, (typeof config.title === 'string' ? config.title : config.key) + val);
            }}
            config={config}
          />
        ))}
      </div>
    </div>
  );
};
