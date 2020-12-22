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
  // https://umijs.org/zh/plugin/umi-plugin-react.html#chunks
  // https://webpack.docschina.org/plugins/split-chunks-plugin/
  chainWebpack: function (config) {
    config.merge({
      optimization: {
        minimize: true,
        splitChunks: {
          chunks: 'all',
          minSize: 30000,
          minChunks: 3,
          automaticNameDelimiter: '.',
          cacheGroups: {
            moveable: {
              name: 'moveable',
              test: /[\\/]node_modules[\\/]([\S]+|)(moveable)/,
              enforce: true,
              priority: 10,
              minSize: 0,
              minChunks: 1,
            },
            antv_g2: {
              name: 'antv_g2',
              test({ resource }) {
                return (
                  /[\\/]node_modules[\\/]([\S]+|)(@antv_)[\w|\W]/.test(resource) &&
                  !resource.includes('@antv_util')
                );
              },
              enforce: true,
              priority: 10,
              minSize: 0,
              minChunks: 1,
            },
            echarts: {
              name: 'echarts',
              test: /[\\/]node_modules[\\/]([\S]+|)(echarts|zrender)/,
              enforce: true,
              priority: 10,
              minSize: 0,
              minChunks: 1,
            },
            html2canvas: {
              name: 'html2canvas',
              test: /[\\/]node_modules[\\/]([\S]+|)(html2canvas)/,
              enforce: true,
              priority: 10,
              minSize: 0,
              minChunks: 1,
            },
            vendors: {
              name: 'vendors',
              test({ resource }) {
                return /[\\/]node_modules[\\/]/.test(resource);
              },
              priority: 2,
            },
          },
        },
      },
    });
  },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        chunks: ['vendors', 'moveable', 'antv_g2', 'echarts', 'html2canvas', 'umi'],
        antd: true,
        dva: true,
        dynamicImport: { webpackChunkName: true },
        title: 'dashboard',
        // dll: true,
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
