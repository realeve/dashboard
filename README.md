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
## 路由列表

[图表配置页面](http://localhost:8000/config):http://localhost:8000/config

[首页](http://localhost:8000/):http://localhost:8000/

http://localhost:8000/?id=/data/YiBiaoPan.json&autoresize=component

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
 
## 数据库层初始化

基于mysql,资源项目中对应的  ./public/tbl_business.sql
 
 