const DEV = process.env.NODE_ENV == 'development';

// 提取后会将提取的包注入到页面，如echarts,g2，无论是否引用都会被提取。此处暂时关闭
let chain =
  true || DEV
    ? {
        chainWebpack: function (config) {
          config.optimization.splitChunks({
            cacheGroups: {
              styles: {
                name: 'styles',
                test: /\.(css|less)$/,
                chunks: 'async',
                minChunks: 1,
                minSize: 0,
              },
            },
          });
        },
      }
    : {
        chunks: ['vendors', 'antv_g2', 'echarts', 'umi'],
        // https://umijs.org/zh/plugin/umi-plugin-react.html#chunks
        // https://webpack.docschina.org/plugins/split-chunks-plugin/
        chainWebpack: function (config) {
          config.optimization.splitChunks({
            cacheGroups: {
              styles: {
                name: 'styles',
                test: /\.(css|less)$/,
                chunks: 'async',
                minChunks: 1,
                minSize: 0,
              },
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
              vendors: {
                name: 'vendors',
                test: /[\\/]node_modules[\\/]/,
                priority: 5,
                minChunks: 3,
                minSize: 20000,
              },
            },
          });
        },
      };

export { chain, DEV };
