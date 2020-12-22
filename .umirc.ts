import { IConfig } from 'umi-types';
import theme from './config/theme';
const DEV = process.env.NODE_ENV == 'development';
console.log({ DEV });
let chain = DEV
  ? {}
  : {
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
    };

let chunks = DEV
  ? {}
  : {
      chunks: ['vendors', 'antv_g2', 'echarts', 'umi'],
    };

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
  ...chain,
  plugins: [
    // ref: https://umijs.org/plugin/umi-plugin-react.html
    [
      'umi-plugin-react',
      {
        ...chunks,
        antd: true,
        dva: true,
        dynamicImport: { webpackChunkName: true },
        title: 'dashboard',
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
