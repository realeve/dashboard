import { IChartMock, IApiConfig, IChartConfig } from '@/component/chartItem/interface';
import { axios } from '@/utils/axios';
import useFetch from '@/component/hooks/useFetch';
import styles from './index.less';
import classnames from 'classnames';
import * as lib from '@/component/chartItem/option/lib';
import { sendRTXMessage } from '@/utils/db';
/**
 *   @database: { 全局接口 }
 *   @desc:     { 数据库心跳状态 }
 */
export const isAlive = (key: string) =>
  axios<{ rec_time: string }>({
    url: `/alive/${key}`,
  }).then(({ data }) => data[0]?.rec_time);

export const mock: IChartMock = {
  data: [[45.7]],
  title: '进度条_MOCK数据',
  header: ['指标值'],
  rows: 1,
  hash: 'mockdata',
};

export const config: IChartConfig[] = [
  {
    key: 'db_name',
    title: '数据库名称',
    defaultValue: '接口管理平台',
    valueType: 'text',
  },
  {
    key: 'db_key',
    title: '数据库键值',
    defaultValue: 'db1',
    valueType: 'text',
  },
  {
    type: 'label',
    title: (
      <a
        href="http://10.8.2.133:8000/table#id=3/e4e497e849&datetype=none&hidemenu=1"
        target="_blank"
        style={{ marginLeft: 100 }}
      >
        点击此处查看键值列表
      </a>
    ),
  },
  {
    type: 'switch',
    key: 'push_message',
    defaultValue: true,
    title: '推送腾讯通消息',
  },
  {
    key: 'rtx_users',
    title: '人员名单',
    defaultValue: '10080,10654,10093',
    valueType: 'text',
  },
  {
    type: 'label',
    title: (
      <a
        href="http://10.8.1.27:4040/api/rtx?username=%E6%9D%8E%E5%AE%BE"
        target="_blank"
        style={{ marginLeft: 100 }}
      >
        点击查询人员信息
      </a>
    ),
  },
  ...lib.getFontConfig(22, '#fff'),
];

export const apiConfig: IApiConfig = {
  show: true,
  type: 'url',
  url: '/mock/0_db_alive.json',
  interval: 1,
  cache: 0,
  config: [],
};

export default ({
  option: {
    push_message,
    fontSize = 22,
    textAlign,
    fontWeight = 'normal',
    fontColor = '#fff',
    letterSpacing,
    db_name,
    db_key,
    rtx_users,
    /** 定时刷新：单位 秒 */
    interval,
  },
  style = {},
}) => {
  const { data, loading, error } = useFetch({
    param: {
      url: `/alive/${db_key}`,
    },
    valid: () => db_key?.trim?.()?.length > 0,
    callback({ data: res }) {
      return res?.[0]?.rec_time;
    },
    interval: interval * 60,
    onError() {
      if (!push_message || rtx_users?.trim?.()?.length === 0) {
        return;
      }
      sendRTXMessage({
        msg: `数据库 【 ${db_name} 】连接出现异常，[(请点击此处确认)|http://10.8.1.25:100/alive/${db_key}]`,
        receiver: rtx_users,
      });
    },
  });

  return (
    <div className={styles.alive} style={style}>
      <div
        className={styles.main}
        style={{ fontSize, textAlign, fontWeight, letterSpacing, color: fontColor }}
      >
        {db_name}
      </div>
      <div className={styles.center}>
        <a
          className={classnames(styles.status, {
            [styles.success]: data,
            [styles.error]: error,
            [styles.loading]: loading,
          })}
          href={`http://10.8.1.25:100/alive/${db_key}`}
          target="_blank"
          title="点击查看状态"
        />
      </div>
      {!error && !loading && (
        <div className={styles.center} style={{ fontSize: 16 }}>
          <span>数据库时间：</span>
          <span>{data}</span>
        </div>
      )}
      {loading && (
        <div className={styles.center} style={{ fontSize: 16 }}>
          数据库状态获取中
        </div>
      )}
    </div>
  );
};
