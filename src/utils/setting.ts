export let themeName = 'dashboard';

export let DEV: boolean = process.env.NODE_ENV === 'test'; // || process.env.NODE_ENV === 'development';

// 前台资源部署域名，默认头像图片资源调用域名
export let config = {
  chengdu: {
    company: '成都印钞有限公司',
    api: 'http://10.8.1.25:100',
    footer: '成都印钞有限公司 印钞管理部',
    systemName: '质量信息管理平台',
    uploadHost: 'http://10.8.1.25:100/upload/',
    host: 'http://10.8.2.133:8000',
    org: 'CDYC',
    uap: {
      active: true && !DEV, // 使用代理身份认证登录
      rtx: 'http://10.8.1.25:100/rtx/rtx_CDYC.xml',
      // login: 'http://10.8.1.27:4040/api/login',
      // dept: 'http://localhost:3030/api/depts',
      // user: 'http://localhost:3030/api/users',
      // login: 'http://10.8.1.27:4040/api/login', // 登录URL
      login: '//10.8.1.25:100/675/25d3d1010c',
      // dept: 'http://10.8.1.27:4040/api/depts', // 部门列表
      dept: 'http://10.8.1.25:100/673/46efae99d7',
      // user: 'http://10.8.1.27:4040/api/users', //用户列表
      user: 'http://10.8.1.25:100/674/d2b665340b',
    },
  },
};

export const CUR_COMPANY = 'chengdu';

let defaultTitle = window.localStorage.getItem('_userMenuTitle');

export let systemName = defaultTitle || config[CUR_COMPANY].systemName;

export let AUTHOR = config[CUR_COMPANY].footer;

export let ORG = config[CUR_COMPANY].org;
export let uap = config[CUR_COMPANY].uap;
export let company = config[CUR_COMPANY].company;

let domain: string = config[CUR_COMPANY].api;
// 后台api部署域名
let host = domain;

if (DEV) {
  // 上传代码时取消此处的判断
  domain = '';
  host = 'http://localhost:90/api/';
}

export { domain, host };

export const api = {
  // 添加业务组件
  addDashboardBusiness: '/10/663d99e189.json',
  // 业务组件列表
  getDashboardBusiness: '/11/bd60f6312a.json',
};
