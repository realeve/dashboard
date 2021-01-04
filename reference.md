
## 参考文档

需要了解的一些前置知识：

阿里 g2 plot:[https://g2plot.antv.vision/zh/examples/gallery](https://g2plot.antv.vision/zh/examples/gallery)


echarts: [https://www.echartsjs.com/examples/zh/index.html](https://www.echartsjs.com/examples/zh/index.html)


chartcube:[https://chartcube.alipay.com/](https://chartcube.alipay.com/) 


阿里 ava：[https://github.com/antvis/ava](https://github.com/antvis/ava)


[react-use 文档](https://github.com/zenghongtu/react-use-chinese/blob/master/docs/useFullscreen.md)


[弃用方案简单演示](https://gridstackjs.com/)


# 单元测试资料
[jest](https://jestjs.io/) 


[react-testing-library](https://github.com/testing-library/react-testing-library)


[test-renderer](https://zh-hans.reactjs.org/docs/test-renderer.html)

---

[IIS Url Rewrite](https://www.iis.net/downloads/microsoft/url-rewrite)


# dashboard示例

可供参考的一些线上dashboard:

## dataV

[https://datav.aliyuncs.com/share/f3e3cdc01dda91ebe90a81e4e475a4a6](https://datav.aliyuncs.com/share/f3e3cdc01dda91ebe90a81e4e475a4a6)

[https://datav.aliyuncs.com/share/939eeac006c02ee5525469e2877fda04](https://datav.aliyuncs.com/share/939eeac006c02ee5525469e2877fda04)

[https://datav.aliyuncs.com/share/782bf1b94d6b56e0f3c671f21e2528de](https://datav.aliyuncs.com/share/782bf1b94d6b56e0f3c671f21e2528de)


## 百度sugar
[https://sugar.aipage.com/dashboard/5f81db321ff3e080e9f09168c923854f](https://sugar.aipage.com/dashboard/5f81db321ff3e080e9f09168c923854f)

[https://sugar.aipage.com/dashboard/5e81f0ec04f74164a1d0bae94cd386dc](https://sugar.aipage.com/dashboard/5e81f0ec04f74164a1d0bae94cd386dc)

[https://xiaoma.qq.com/#/screen/view/147278/22926](https://xiaoma.qq.com/#/screen/view/147278/22926)

值得参考的开源库：
[http://datav-react.jiaminghi.com/guide/](http://datav-react.jiaminghi.com/guide/)

基于datav-react的一上demo:
[http://datav-react.jiaminghi.com/demo/](http://datav-react.jiaminghi.com/demo/)

[http://datav-react.jiaminghi.com/demo/manage-desk/index.html](http://datav-react.jiaminghi.com/demo/manage-desk/index.html)

[http://datav-react.jiaminghi.com/demo/construction-data/index.html](http://datav-react.jiaminghi.com/demo/construction-data/index.html)

[http://datav-react.jiaminghi.com/demo/electronic-file/index.html](http://datav-react.jiaminghi.com/demo/electronic-file/index.html)


## 其它demo

https://web.raykite.com/square/play/2708cbb4b1d04b248537850459b80e9a/true

https://web.raykite.com/square


--- 

## 添加图表步骤：
1.当前ChartItem的边框、标题样式，边框可为空，如果为空直接确定插入。
 
2.在chartCube里面选择图表类型。这个可参考ava给的占位符，结合chartcube，类似这样的产品形态(每种图给一个简洁易懂的缩略图)：

曲线图
A B C D E 

柱状图
B C D E F

饼图
C D E F G

3.选择数据：
1）Mock数据（系统根据图表类型提供mock数据）

2）数据接口，我们现有的数据接口配置

4.图表配置（就是现在chartcube的第2步）

由开发方针对不同图表封装好关键的配置，仅开放少量配置出来，确保整体的一致性。

在配置变更的时候，实时预览。

5.完成，插入到面板中，此时关键配置参数注入到react的状态中，随保存写到json文件。

## 图表项复用与数据钻取

在上面流程之上的再次封装

1.刚才配置好的图表A，我们可以考虑把它整体保存入库变成业务，数据库结果比如：

chart_id,业务名称，业务配置
1，作废率曲线，{type:'line',x:'month_name'....}

2.在前面的流程支持直接选择一个chart的最小单元，就是上述 chart_id = 1 的内容，这样方便不同人员之间的业务复用，不需要一个个配置。

3.增加数据钻取的功能：
图表A为父，图表B为子，图表C为孙
A——B——C

这部分技术方案是点击A的某项，监听它的事情，取到名字NameA作为参数。在上述配置项流程中增加B的入参，值为NameA,键为配置中的内容。图表C同理。

在此处又分出来了对图表复用的方案：
1.存数据库，此时业务要跟数据库耦合。
2.从json文件中提取。chartItem在config面板中显示它的配置，提供一个按钮一键复制它的配置，这样与数据库无关，只需要管理好一个个dashboard就行了。

---

