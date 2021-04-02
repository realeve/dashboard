import { axios, DEV } from '@/utils/axios';
import { clone } from 'ramda';

export const sendRTXMessage = (params: {
  /** 发送消息内容 */
  msg: string;
  /** 接收者 */
  receiver: string;
}) => {
  const nextParam = clone(params);
  // TODO 未发布前只推送开发者
  if (DEV || window.location.hostname === 'localhost') {
    console.log(`原计划推送人员：${params.receiver}`);
    nextParam.receiver = '10654';
  }

  return axios({
    url: DEV
      ? {
          data: { msg: '消息推送成功', status: 200 },
        }
      : '/319/b804147c6e.json', //  DEV ? pushSuccess :
    params: {
      title: '生产指挥中心自动报警',
      delaytime: 0,
      ...nextParam,
    },
  });
};
