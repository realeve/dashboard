# dashboard
[![Coverage Status](https://coveralls.io/repos/github/realeve/dashboard/badge.svg?branch=master)](https://coveralls.io/github/realeve/dashboard?branch=master)
[![Build Status](https://api.travis-ci.com/realeve/dashboard.svg?branch=master&status=passed)](https://travis-ci.com/realeve/dashboard)
![](https://img.shields.io/github/last-commit/realeve/dashboard/master.svg)

## 资源文件所在的配套项目

资源文件请参考项目：https://github.com/realeve/dashboard_assets

## 开发模式
> npm start

## 编译
> npm run build

## 编译+部署
> npm run deploy

## 路由列表

[图表配置页面](http://localhost:8000/config):http://localhost:8000/config

[首页](http://localhost:8000/):http://localhost:8000/

http://localhost:8000/?id=/data/YiBiaoPan.json&autoresize=movie

[大屏列表](http://localhost:8000/list):http://localhost:8000/list
  
----
## 开发时，添加组件

> npm run add your_chart_name echarts

> npm run add your_chart_name g2

> npm run add your_chart_name other

## 分析包大小
> npm run anany

## 测试
> npm test

## 开发期间单元测试

1. 安装 jestrunner 插件
2. 打开配置，将配置项【jestrunner.jestCommand】设为【umi test 】
3. 在单个测试的上方将显示  run/debug,点击即可

## 代码规范分析

> npm run lint:js

> npm run lint:style
 
## 代码提交 

提交时会进行校验，如果校验失败需要强制提交时：

> git commit --no-verify -m "移除控制台所有warning信息"
## 数据库层初始化

基于mysql,资源项目中对应的  ./public/tbl_business.sql
 
 
## 部署后的性能优化

1. IIS配置缓存/增加GZIP压缩

2. 载入第三方字体时，启用 font-display 特性

https://web.dev/font-display/?utm_source=lighthouse&utm_medium=devtools

https://web.dev/preload-optional-fonts/

3. 缩短调用链：暂时移除 log.js文件

4. 图片增加默认宽高，减少页面抖动

https://web.dev/optimize-cls/?utm_source=lighthouse&utm_medium=devtools#images-without-dimensions

```html
<style>
    img {
        aspect-ratio: attr(width) / attr(height);
    }
</style>

<!-- set a 640:360 i.e a 16:9 - aspect ratio -->
<img src="puppy.jpg" width="640" height="360" alt="Puppy with balloons">
```

5. 增加缓存时长为365天

```httpd.conf
<IfModule expires_module>

    #打开缓存
    #文件缓存 A31536000/3600/24=365天

    ExpiresActive on 

    ExpiresByType text/css A31536000 
    ExpiresByType application/x-javascript A31536000 
    ExpiresByType application/javascript A31536000 
    # ExpiresByType text/html A31536000 
    ExpiresByType image/jpeg A31536000 
    ExpiresByType image/gif A31536000 
    ExpiresByType image/png A31536000 
    ExpiresByType image/x-icon A31536000 
	ExpiresByType application/x-font-ttf A31536000  
	ExpiresByType image/svg+xml A31536000
	ExpiresByType image/webp A31536000 
</IfModule>
```

6. preload

```html
    <link rel="preload" href="/fonts/Unica-One.ttf"/>
```

7. 拆分包大小，按需引用 (尽量减少文件的交叉引用)

```ts

// BAD
// g2plot.ts
export {palette} from './palette'
export * from './index'

// index.ts
import palette from '@/component/g2plot'

//  ---

// GOOD
import { palette } from '@/component/g2plot/palette';
```