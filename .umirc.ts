import { IConfig } from 'umi-types';
import theme from './config/theme';
// ref: https://umijs.org/config/
const config: IConfig = {
  treeShaking: true,
  theme,
  hash: true,
  exportStatic: { htmlSuffix: false },
  routes: [
    {
      path: '/',
      component: '../layouts/index',
      routes: [
        { path: '/', component: '../pages/index' },
        { path: '/config', component: '../pages/config' },
        { path: '/list', component: '../pages/list' },
      ],
    },
  ],
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        antd: true,
        dva: true,
        dynamicImport: { webpackChunkName: true },
        title: 'dashboard',
        dll: true,
        routes: {
          exclude: [
            /models\//,
            /services\//,
            /model\.(t|j)sx?$/,
            /service\.(t|j)sx?$/,
            /components\//,
          ],
        },
      },
    ],
  ],
};

export default config;
