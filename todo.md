## todo:

- [ ] 1.日志埋点

本地状态获取参考：https://github.com/faisalman/ua-parser-js

https://cdn-service.datav.aliyun.com/datav-static/2.36.8_6/libs/browser_check.js


- [x] 2.echarts ———— datav 样式

https://resource.datav.aliyun.com/cube/com/@ChJ.limit_free/horizontal-positive-negative-bar-chart/0.2.2

https://resource.datav.aliyun.com/cube/com/@ChJ.limit_free/line-bar-chart/0.2.0

---

- [x] 增加组件锁定
- [x] 增加操作历史记录，X次可设置。点击之后重新渲染dashboard；每一步记录具体的操作；
- [x] 业务组件管理

-----

# 2020-11-03讨论

---
~~1.新增业务路由（原有增加） business，用于业务组件配置成dashboard~~
~~差异在于：~~
~~接口不允许 设置~~
- [x] 组件列表用业务列表代替，可首字母检索
~~基于config路由的代码来渲染~~

2.config增加
~~(1)入库保存业务组件的功能；~~
~~开发时考虑到mock数据；~~

~~表1：（id/名称/业务分类,二级 /业务json配置文件([object,object]）/创建人/创建时间/使用次数/更新时间~~

- [x] 表2：使用dashboard/业务id

- [x] (2)画布配置：大小（目前是1920*1080）；增加一组n*m分屏黑线;边距线（整个dashboard，美观使用）；

 
~~(3)多个组件编组保存~~

~~(4)增加预览功能~~

~~（５）调试错误处理~~

~~3.dashboard存储问题~~
 ~~json静态文件，上传到服务器；可独立导入json文件~~

－－－

~~4.渲染（index路由）~~
~~（1）有参数时加载json，加载完毕json文件后，列出有多少业务id~~

~~（2）自适应 left/top/宽/高 相对于1920*1080来讲;例如把style缩放至3840*2160;~~

~~（3）预览功能；无参数时预览，读取本机localstorage  / panel 数据~~

- [ ] (4)多个大屏切换
 a.单个大屏，直接渲染
 b.数组: Tab/轮询
  c.json = [{
	title:'印钞',
	url:'a.json'
 },{
	title:'成本',
	url:'b.json'
 }]

5.组件
- [x] (1)增加当前 时间／全屏功能按钮；
~- [ ] (2)tab组件~
 
- [x] （3）公告；滚动文字

- [x] 6.dashboard 管理列表

~~7.预警功能：(在后台业务实现，前台不处理预警)~~
~~（1）业务组件，定义需要观测某列指标，阈值。超阈值向指定的用户发送预警信息（预警能力：短信、腾讯通推送、当前页面警告）~~
---

~~- [ ] （2）后台进程：node轮询；~~

function xxx(data,config){
  // 预警处理逻辑
  return null
}

ajax().then(data=>{
	xxx(data,config);
	return data;
})

---

任务id,任务名称，api,参数，观测指标，阈值，发送信息方式，人员；定时刷新时长；有效时段；

id/最近发送时间，时长； 
---

~~左右横屏，上下留边;~~

---

- [x] 已知bug，分组内容移动时，只有第一项内容的位置变更，其它内容不变动，导致相对位置异常。

 
- [x] 业务组件允许调整ajax数据请求的缓存，刷新时长等信息；


## TODO 12月计划
1. carousel切换
~~2. 优化资源部署，将静态资源拆分~~
3. 优化json数据上传的方案

---

## todo:

- [x] 全局 
- [x] 背景设置
- [x] header设置
- [x] footer设置

--- 

- [x] 图表项
- [x] step条
- [x] 边框
- [x] 标题样式/主题
- [x] 图表类型
- [x] 数据源：Mock/接口/参数
- [x] 数据刷新时长
- [x] 主要参数配置
- [x] 实时预览
- [x] 存储图表项内容

--- 

- [x] dashboard
- [x] 图表项配置/初始化参考AVA做实现
- [x] 支持复制图表项配置
- [x] 支持粘贴图表项配置，实时生效

---  

- [x] widgets
- [x] 翻牌器
- [x] 表单滚动
- [x] g2 plot中 柱状图/曲线图
- [x] echarts中借鉴借鉴的图表适配
- [x] 主题配色提取


---

- [x] 单元测试



## todo 2
- [x] 视频背景
- [ ] 作废率报表解析上传
- [x] 不同尺寸屏幕的缩放
- [x] 缩略图显示
- [x] 文字、图片组件；图片动画

