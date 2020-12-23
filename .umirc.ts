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
          plugin: {
            install: {
              plugin: require('uglifyjs-webpack-plugin'),
              args: [
                {
                  sourceMap: false,
                  uglifyOptions: {
                    compress: {
                      // 删除所有的 `console` 语句
                      drop_console: true,
                    },
                    output: {
                      // 最紧凑的输出
                      beautify: false,
                      // 删除所有的注释
                      comments: false,
                    },
                  },
                },
              ],
            },
          },
          optimization: {
            minimize: true,
            splitChunks: {
              chunks: 'all',
              minSize: 30000, //生成块的最小大小（以字节为单位）1024字节=1KB。
              minChunks: 3, //拆分前必须共享模块的最小块数。
              automaticNameDelimiter: '.',
              cacheGroups: {
                antv_g2: {
                  name: 'antv_g2',
                  test({ resource }) {
                    return /[\\/]node_modules[\\/]([\S]+|)(@antv_)[\w|\W]/.test(resource); //&& !resource.includes('@antv_util')
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
              },
            },
          },
        });
      },
    };

let chunks = DEV
  ? {}
  : {
      chunks: ['antv_g2', 'echarts', 'umi'],
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
