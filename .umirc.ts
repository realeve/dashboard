// import { IConfig } from 'umi-types';

// https://umijs.org/config/
import { defineConfig } from 'umi';
import { chain, DEV } from './config/chunk';
import theme from './config/theme';
import { routes } from './config/routes';
// 注入自动日志;
let headScripts = []; // DEV ? [] : ['http://cdn.cdyc.cbpm/lib/cbpc_log.min.js'];

// ref: https://umijs.org/config/

export default defineConfig({
  hash: true,
  antd: {
    dark: true,
  },
  dva: {
    hmr: true,
  },
  mock: false,
  dynamicImport: {
    loading: '@/component/Loading',
  },
  title: 'dashboard',
  theme,
  // cssModulesTypescriptLoader: {
  //   // 对按照 css modules 方式引入的 css 或 less 等样式文件，自动生成 ts 类型定义文件。
  //   mode: 'emit',
  // },
  terserOptions: {
    compress: {
      drop_console: !DEV,
      drop_debugger: !DEV,
    },
  },
  esbuild: DEV ? {} : false,
  devtool: DEV ? 'eval' : false,
  // mpa: {
  //   splitChunks: {
  //     cacheGroups: {
  //       vendors: {
  //         chunks: 'all',
  //         minChunks: 2,
  //         name: 'vendors',
  //         test: /[\\/]node_modules[\\/]/,
  //       },
  //     },
  //   },
  //   html: {
  //     chunks: ['vendors', '<%= page %>'],
  //   },
  // },
  nodeModulesTransform: {
    type: 'none', //DEV ? 'none' : 'all',
  },
  exportStatic: { htmlSuffix: false },
  routes,
  ...chain,
  headScripts,
  targets: {
    chrome: 70,
    firefox: false,
    safari: false,
    edge: false,
    ios: false,
  },
});
