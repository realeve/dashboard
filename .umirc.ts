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
            // three: {
            //   name: 'three',
            //   test: /[\\/]node_modules[\\/][\w|\W](three)[\w|\W]/,
            //   enforce: true,
            //   priority: 10,
            //   minSize: 0,
            //   minChunks: 1,
            // },
            antv_g2: {
              name: 'antv_g2',
              test: /[\\/]node_modules[\\/]([\S]|)(@antv_g2)[\w|\W]/,
              enforce: true,
              priority: 10,
              minSize: 0,
              minChunks: 1,
            },
            echarts: {
              name: 'echarts',
              test: /[\\/]node_modules[\\/]([\S]|)(echarts|zrender)/,
              enforce: true,
              priority: 10,
              minSize: 0,
              minChunks: 1,
            },
            html2canvas: {
              name: 'html2canvas',
              test: /[\\/]node_modules[\\/]([\S]|)(html2canvas)/,
              enforce: true,
              priority: 10,
              minSize: 0,
              minChunks: 1,
            },
            vendor: {
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

  // chainWebpack(config, { webpack }) {
  //   config.optimization.splitChunks({
  //     cacheGroups: {
  //       three: {
  //         chunks: 'all',
  //         name: 'three',
  //         test: /(three)/,
  //         enforce: true,
  //         priority: 10,
  //         minSize: 0,
  //         minChunks: 1,
  //       },
  //       vendor: {
  //         chunks: 'all',
  //         name: 'vendor',
  //         priority: 1,
  //         minSize: 0,
  //         minChunks: 1,
  //       },
  //     },
  //   });
  // },
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        chunks: ['vendors', 'umi'],
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
