let assets = {
  borders: {},
  pics: {},
  backgrounds: {},
  headers: {},
  footers: {},
};
assets.borders = {
  无边框: {
    url: null,
    top: 10,
    right: 16,
    bottom: 15,
    left: 10,
  },
  边框: {
    url: require('./img-templet/tech/border1.svg'),
    top: 60,
    right: 20,
    bottom: 50,
    left: 20,
  },
  边框1: {
    url: require('./img-templet/border-1.png'),
    top: 10,
    right: 16,
    bottom: 15,
    left: 10,
  },
  边框2: {
    url: require('./img-templet/border-2.png'),
    top: 10,
    right: 16,
    bottom: 15,
    left: 10,
  },
  边框3: {
    url: require('./img-templet/border-2-647997910e4f2e40.png'),
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  },
  边框4: {
    url: require('./img-templet/border-2-1.png'),
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  },
  边框5: {
    url: require('./img-templet/border-4D8PhZnr7fHiBHD2.png'),
    top: 10,
    right: 10,
    bottom: 10,
    left: 10,
  },
  边框6: {
    url: require('./img-templet/border-9qqu7FvN3i3ejGjx.png'),
    top: 17,
    right: 4,
    bottom: 4,
    left: 36,
  },
  边框7: {
    url: require('./img-templet/border-75-326aa8b5a6b87b2f.png'),
    top: 48,
    right: 48,
    bottom: 48,
    left: 48,
  },
  边框8: {
    url: require('./img-templet/border-93-63f1aa8a1c6516ca.png'),
    top: 35,
    right: 35,
    bottom: 35,
    left: 35,
  },
  边框9: {
    url: require('./img-templet/border-236-7ab7e7d6ce1bc4b5.gif'),
    top: 35,
    right: 35,
    bottom: 35,
    left: 35,
  },
  边框10: {
    url: require('./img-templet/border-121-0f05f2ce15011b2a.png'),
    top: 14,
    right: 14,
    bottom: 14,
    left: 14,
  },
  边框11: {
    url: require('./img-templet/border-229-6a0fdf839ec2ef45.gif'),
    top: 43,
    right: 20,
    bottom: 24,
    left: 24,
  },
  边框12: {
    url: require('./img-templet/border-235-6841c1286c4094b6.gif'),
    top: 37,
    right: 37,
    bottom: 37,
    left: 37,
  },
  边框13: {
    url: require('./img-templet/border-120-88a3f27c6352fd96.png'),
    top: 122,
    right: 192,
    bottom: 63,
    left: 207,
  },
  边框14: {
    url: require('./img-templet/border-123-ddd7b5d4266a8aaa.png'),
    top: 60,
    right: 60,
    bottom: 60,
    left: 60,
  },
  边框15: {
    url: require('./img-templet/border-124-554d9d6ed0674ec2.png'),
    top: 40,
    right: 40,
    bottom: 40,
    left: 40,
  },
  边框16: {
    url: require('./img-templet/border-125-62ce2b374cfa1209.png'),
    top: 100,
    right: 100,
    bottom: 100,
    left: 100,
  },
  边框17: {
    url: require('./img-templet/border-7718acec67f35819.png'),
    top: 37,
    right: 120,
    bottom: 56,
    left: 37,
  },
  边框18: {
    url: require('./img-templet/border-234-21caaaed0d132596.gif'),
    top: 37,
    right: 120,
    bottom: 56,
    left: 37,
  },
  边框19: {
    url: require('./img-templet/border-FL9pZhDg36ZNEGi4.png'),
    top: 50,
    right: 50,
    bottom: 50,
    left: 50,
  },
  边框20: {
    url: require('./img-templet/border-vVMmzK86nT24eHzC.png'),
    top: 60,
    right: 75,
    bottom: 60,
    left: 75,
  },
  边框21: {
    url: require('./img-templet/border-21.png'),
    top: 8,
    right: 8,
    bottom: 8,
    left: 8,
  },
  边框22: {
    url: require('./img-templet/border_22.png'),
    top: 8,
    right: 8,
    bottom: 8,
    left: 8,
  },
  边框23: {
    url: require('./img-templet/border_23.png'),
    top: 8,
    right: 8,
    bottom: 8,
    left: 8,
  },
  边框24: {
    url: require('./img-templet/border_24.svg'),
    top: 8,
    right: 8,
    bottom: 8,
    left: 8,
  },
  边框25: {
    url: require('./img-templet/border_25.svg'),
    top: 8,
    right: 8,
    bottom: 8,
    left: 8,
  },
  边框26: {
    url: require('./img-templet/border_26.svg'),
    top: 8,
    right: 8,
    bottom: 8,
    left: 8,
  },
  边框27: {
    url: require('./img-templet/border_27.svg'),
    top: 8,
    right: 8,
    bottom: 8,
    left: 8,
  },
  边框28: {
    url: require('./img-templet/border_28.svg'),
    top: 8,
    right: 8,
    bottom: 8,
    left: 8,
  },
  边框29: {
    url: require('./img-templet/border_29.svg'),
    top: 8,
    right: 8,
    bottom: 8,
    left: 8,
  },
};
let picList = [
  {
    title: '百度sugar',
    data: {
      默认头图: {
        url: require('./img-templet/header_03.png'),
      },
      淡蓝色: {
        url: require('./img-templet/header_01.png'),
      },
      蓝色: {
        url: require('./img-templet/header_02.png'),
      },
      蓝色2: {
        url: require('./img-templet/header_04.png'),
      },
      蓝色底部: {
        url: require('./img-templet/footer_03.png'),
      },
      旋转gif: {
        url: require('./img-templet/02.gif'),
      },
      紫色圆形装饰动图gif: {
        url: require('./img-templet/pic-228-2cff2e714fff18e2.gif'),
      },
      蓝色频谱音频装饰动图gif: {
        url: require('./img-templet/pic-230-1abf980f5d966f30.gif'),
      },
      紫色圆形频谱音频装饰动图gif: {
        url: require('./img-templet/pic-232-f5b366790d3979f7.gif'),
      },
      蓝色橙色圆形3D效果科技装饰动图gif: {
        url: require('./img-templet/pic-233-e01e793cd1bdcdc9.gif'),
      },
      蓝色直线线条装饰动图gif: {
        url: require('./img-templet/pic-237-dc21156e2c9fe530.gif'),
      },
      蓝色橙色标尺装饰动图gif: {
        url: require('./img-templet/pic-238-0e821128f121a815.gif'),
      },
      蓝色直线科技装饰动图gif: {
        url: require('./img-templet/pic-239-ce970cb4d39a64db.gif'),
      },
      蓝色边框科技装饰动图gif: {
        url: require('./img-templet/pic-240-e9640eece337d0dc.gif'),
      },
      蓝色圆形3D立体透明科技图标: {
        url: require('./img-templet/pic-86BKa8kymLuDfLG7.png'),
      },
      蓝色透明圆形科技图形装饰: {
        url: require('./img-templet/pic-GhM7QJJFM28Z8jcP.svg'),
        animate: 'rotateZ',
      },
      绿色科技电路电子透明装饰图标矢量: {
        url: require('./img-templet/pic-3moMpFVj89T6bVMB.svg'),
      },
      白色绿色黄色透明圆形科技内容容器: {
        url: require('./img-templet/pic-84-21292bc485c89a08.svg'),
      },
      红色灰色透明圆形六边形科技内容容器: {
        url: require('./img-templet/pic-9-e2cbd920849c06fe.svg'),
        animate: 'rotateZ',
      },
      蓝色透明科技直线边框装饰图标图形1: {
        url: require('./img-templet/pic-27-07e1d5cca344220f.svg'),
      },
      粉色透明科技圆形内容容器: {
        url: require('./img-templet/pic-46-1d3103c5e4f4b2a2.svg'),
        animate: 'rotateZ',
      },
      蓝色黄色透明圆形科技多内容容器: {
        url: require('./img-templet/pic-51-0da4922447ec2bed.svg'),
      },
      红色黑色透明圆形柱状装饰内容容器: {
        url: require('./img-templet/pic-108-eab4f8f97693c58a.svg'),
      },
      蓝色透明矩形方形科技异形内容容器: {
        url: require('./img-templet/pic-200-641cc54ae2668ab9.svg'),
      },
      蓝色黄色异形透明科技异形内容容器: {
        url: require('./img-templet/pic-166-69870f0e73185f93.svg'),
      },
      蓝色黄色异形透明科技异形内容容器1: {
        url: require('./img-templet/pic-165-352db3cacfdd6168.svg'),
      },
      蓝色红色透明圆形科技多内容容器: {
        url: require('./img-templet/pic-215-01f168866dea4c73.svg'),
      },
      蓝色绿色黄色透明圆形科技3D图标: {
        url: require('./img-templet/pic-125-ac14305bc4902088.svg'),
      },
      蓝色透明圆形科技3D图标: {
        url: require('./img-templet/pic-4yvtgiMdd2c8fwn4.png'),
      },
      白色透明3D立体科技圆形图标: {
        url: require('./img-templet/pic-6scio8hXYU2qCTa8.png'),
      },
      白色透明科技装饰图标: {
        url: require('./img-templet/pic-e8bEx2j2Njx6YzMe.svg'),
      },
      彩色透明波浪点装饰图形图标装饰: {
        url: require('./img-templet/pic-UfrKGs9JGY979pRo.svg'),
      },
      蓝色抽象透明地图地球3D立体图标: {
        url: require('./img-templet/pic-157-8843d74dfcb5bb70.svg'),
      },
      彩色真实地图地球3D立体图标: {
        url: require('./img-templet/pic-139-091a0b3cae26a353.png'),
      },
      蓝色紫色点状抽象透明地图地球3D立体图标: {
        url: require('./img-templet/pic-142-8933834d7b2e57e4.png'),
      },
      白色点状抽象透明地图地球3D立体图标: {
        url: require('./img-templet/pic-143-1471b2dcc36fdc59.png'),
      },
      蓝色点状抽象透明地图地球3D立体图标: {
        url: require('./img-templet/pic-144-c93d4c577194bb71.svg'),
      },
      绿色网状抽象透明地图地球3D立体图标: {
        url: require('./img-templet/pic-96-337f96e36fe9903f.svg'),
      },
      绿色线条抽象线状透明地图地球3D立体图标: {
        url: require('./img-templet/pic-123-2fb2025bc0c60429.svg'),
      },
      绿色点状抽象透明地图地球3D立体图标: {
        url: require('./img-templet/pic-147-8940a6a3e6cdc2b0.png'),
      },
      白色网状抽象透明地图地球3D立体图标: {
        url: require('./img-templet/pic-148-efe393176a82c55d.svg'),
      },
      绿色真实地图地球3D立体图标: {
        url: require('./img-templet/pic-176-3fbdfb0f2a0d46b6.svg'),
      },
      蓝色真实地图地球3D立体图标: {
        url: require('./img-templet/pic-49-da7923b20ace00f4.svg'),
      },
      灰色网状抽象透明地图地球3D立体图标: {
        url: require('./img-templet/pic-126-a47a0fe24cba84c7.svg'),
      },
      蓝色地图地球3D立体飞线图标: {
        url: require('./img-templet/pic-77nxFJv3pkX4mpUQ.png'),
      },
      黑色地图地球3图标: {
        url: require('./img-templet/pic-124-04eec188e228195f.svg'),
      },
      绿色地图透明点圆形图标: {
        url: require('./img-templet/pic-aUM23LyRC6HZ9CCM.png'),
      },
      蓝色网状抽象透明地图地球3D立体图标: {
        url: require('./img-templet/pic-55-79b6a45e5d4c9ea0.svg'),
      },
      蓝色网状抽象透明地图地球3D立体图标1: {
        url: require('./img-templet/pic-191-7c407a8169229334.svg'),
      },
      蓝色透明科技直线边框装饰图标图形: {
        url: require('./img-templet/pic-9DHkf6Cgsb7Th2Gr.svg'),
      },
      蓝色透明科技直线边框装饰图标图形3: {
        url: require('./img-templet/pic-AWpRC9Qtdf8V6X4u.svg'),
      },
      蓝色透明科技直线边框装饰图标图形2: {
        url: require('./img-templet/pic-d9rrvQa9PFo3Q4cH.svg'),
      },
      蓝色科技透明线条直线边框装饰图标图形: {
        url: require('./img-templet/pic-NCEtF67c4xDDi4Bn.svg'),
      },
      蓝色透明科技直线线条边框图形装饰: {
        url: require('./img-templet/pic-sgtd6Z3Yrc3MbTh8.svg'),
      },
      蓝色透明科技直线线条边框边角图形装饰: {
        url: require('./img-templet/pic-vVX9D2Yc4F6gHDkk.svg'),
      },
      蓝色透明科技直线线条边框图形装饰2: {
        url: require('./img-templet/pic-zCrpu94N77HVVzEj.svg'),
      },
      蓝色透明科技直线线条边框边角图形装饰1: {
        url: require('./img-templet/pic-34-bb98078064cc875c.svg'),
      },
      蓝色透明科技直线线条边框边角图形装饰2: {
        url: require('./img-templet/pic-38-b73017590f4c5f11.svg'),
      },
      蓝色黄色透明科技直线线条边框图形装饰: {
        url: require('./img-templet/pic-50-31b8ee6aa9f8aadb.svg'),
      },
      蓝色透明科技圆弧线线条边框图形装饰: {
        url: require('./img-templet/pic-52-83a06a6eaf7d2312.svg'),
      },
      蓝色黄色橙色透明科技直线线条刻度边框图形装饰: {
        url: require('./img-templet/pic-221-b98b438e753c743b.svg'),
      },
      蓝色透明科技直线线条边框边角图形装饰3: {
        url: require('./img-templet/pic-226-9ffbfc7b35d1f0cf.svg'),
      },
      蓝色透明科技直线线条边框边角图形装饰4: {
        url: require('./img-templet/pic-1-0b9ab20a94567552.svg'),
      },
      蓝色透明科技折线线条边框图形装饰1: {
        url: require('./img-templet/pic-2-120aa7b2dca83a6d.svg'),
      },
      蓝色透明科技三角线条边框图形装饰2: {
        url: require('./img-templet/pic-6-eae8d0e0599cca62.svg'),
      },
      蓝色透明科技直线线条边框边角图形装饰5: {
        url: require('./img-templet/pic-29-ae0ebef41fe61300.svg'),
      },
      蓝色透明科技线条边框图形装饰3: {
        url: require('./img-templet/pic-45-b48fc090a2874d62.svg'),
      },
      白色透明电波频率脉动科技直线线条边框图形装饰: {
        url: require('./img-templet/pic-132-9b13886b9c0b3372.svg'),
      },
      白色透明电波频率脉动科技直线线条边框图形装饰1: {
        url: require('./img-templet/pic-137-2b4d97464e431f1b.svg'),
      },
      白色透明电波频率脉动科技直线线条边框图形装饰2: {
        url: require('./img-templet/pic-138-8458be45afb4e2f5.svg'),
      },
      白色透明电波频率脉动科技直线线条边框图形装饰3: {
        url: require('./img-templet/pic-140-6c1182b2c13aca2e.svg'),
      },
      白色透明电波频率脉动科技直线线条边框图形装饰4: {
        url: require('./img-templet/pic-141-facc41f0f0e51831.svg'),
      },
      蓝色透明科技折线线条边框图形装饰: {
        url: require('./img-templet/pic-179-508d36275fc64bd0.svg'),
      },
      蓝色透明科技折线线条边框图形装饰2: {
        url: require('./img-templet/pic-180-8dae03bcaa6173b9.svg'),
      },
      灰色透明科技折线线条边框图形装饰: {
        url: require('./img-templet/pic-186-f2da8e1f72ca9171.svg'),
      },
      灰色透明科技折线线条边框图形装饰1: {
        url: require('./img-templet/pic-187-005708738902b64e.svg'),
      },
      蓝色透明科技折线线条边框图形装饰3: {
        url: require('./img-templet/pic-199-9bad7c1391b74106.svg'),
      },
      蓝色透明科技折线线条边框图形装饰4: {
        url: require('./img-templet/pic-1.png'),
      },
      蓝色透明科技折线线条边框图形装饰5: {
        url: require('./img-templet/pic-2.png'),
      },
      蓝色渐变科技直线线条边框图形装饰: {
        url: require('./img-templet/pic-3.png'),
      },
      灰色透明科技直线线条边框图形装饰: {
        url: require('./img-templet/pic-9.png'),
      },
      黄色金色科技电路电子透明装饰图标矢量: {
        url: require('./img-templet/pic-169-b8f8c4be0a2d53c7.svg'),
      },
      黄色金色科技电路电子透明装饰图标矢量1: {
        url: require('./img-templet/pic-171-22b0419510763e61.svg'),
      },
      黄色金色科技电路电子透明装饰图标矢量2: {
        url: require('./img-templet/pic-172-0fff6abf2aebcc1a.svg'),
      },
      蓝色科技电路电子透明装饰图标矢量内容容器: {
        url: require('./img-templet/pic-173-cd67ff690490babc.svg'),
      },
      红色灰色透明圆形六边形科技内容容器1: {
        url: require('./img-templet/pic-7-66aff86096decdb0.svg'),
      },
      蓝色黄色透明扇形科技内容容器: {
        url: require('./img-templet/pic-53-0c47d12547b46a40.svg'),
      },
      蓝色透明圆形科技内容容器: {
        url: require('./img-templet/pic-164-fb6de73e59a64ae0.svg'),
      },
      蓝色透明圆形科技内容容器1: {
        url: require('./img-templet/pic-181-cea3796b23c3181d.svg'),
      },
      蓝色透明六边形科技内容容器: {
        url: require('./img-templet/pic-201-18441f579c8a45cc.svg'),
      },
      蓝色橙色透明六边形科技内容容器: {
        url: require('./img-templet/pic-210-b043b76f09e0c83e.svg'),
      },
      蓝色透明扇形科技内容容器: {
        url: require('./img-templet/pic-225-2d470cc98271b249.svg'),
      },
      蓝色透明异形科技标题容器: {
        url: require('./img-templet/pic-32-420aac906c0438fc.svg'),
      },
      蓝色透明异形科技标题容器1: {
        url: require('./img-templet/pic-56-03e54e1b4b1059d3.svg'),
      },
      蓝色透明条纹异形科技标题容器: {
        url: require('./img-templet/pic-43-398ce4ba45cc57b6.svg'),
      },
      蓝色透明异形圆形科技标题内容容器: {
        url: require('./img-templet/pic-66-1987583dd5e62e30.svg'),
      },
      白色透明异形科技标题容器: {
        url: require('./img-templet/pic-81-23e00367645be1d4.svg'),
      },
      绿色红色透明异形科技标题容器: {
        url: require('./img-templet/pic-104-41f699c3a46283da.svg'),
      },
      红色透明异形圆形科技标题内容容器: {
        url: require('./img-templet/pic-167-9fd826349545eaaa.svg'),
      },
      蓝色透明异形圆形科技标题内容容器1: {
        url: require('./img-templet/pic-168-b18678be60e67ed0.svg'),
      },
      蓝色橙色透明异形圆形科技标题内容容器: {
        url: require('./img-templet/pic-213-718b64f3032df04a.svg'),
      },
      蓝色透明异形科技标题容器2移动端: {
        url: require('./img-templet/pic-11.png'),
      },
      蓝色透明异形科技标题容器2: {
        url: require('./img-templet/pic-12.png'),
      },
      蓝色紫色透明条纹异形科技标题容器: {
        url: require('./img-templet/pic-13.png'),
      },
      蓝色紫色透明条纹异形科技标题容器移动端: {
        url: require('./img-templet/pic-14.png'),
      },
      粉色蓝色透明圆形科技图标内容容器: {
        url: require('./img-templet/pic-60-e784d97a934bedde.svg'),
      },
      黄色蓝色透明圆形科技图标内容容器: {
        url: require('./img-templet/pic-71-bcd98ae427e41ac4.svg'),
      },
      蓝色黄色透明圆形科技透明矢量: {
        url: require('./img-templet/pic-10.svg'),
      },
      蓝色科技透明装饰圆形图标矢量: {
        url: require('./img-templet/pic-2j9cxgF27LevmnVV.svg'),
      },
      蓝色透明圆形科技图标2: {
        url: require('./img-templet/pic-7nsRcmid2R4aQo8B.svg'),
      },
      蓝色透明科技圆形三角形图标: {
        url: require('./img-templet/pic-AkhJrUk69VyV77qY.svg'),
      },
      绿色透明圆形科技图标内容容器: {
        url: require('./img-templet/pic-85-fbd9abba27acae38.svg'),
      },
      绿色透明圆形科技图标内容容器1: {
        url: require('./img-templet/pic-86-1befd05f6e00cf33.svg'),
      },
      绿色透明圆形科技图标内容容器2: {
        url: require('./img-templet/pic-87-af6eb9aaf69d4cc6.svg'),
      },
      绿色透明圆形科技图标内容容器3: {
        url: require('./img-templet/pic-88-23a7177c804a80b7.svg'),
      },
      绿色透明圆形科技图标内容容器4: {
        url: require('./img-templet/pic-89-2eb255f22a6be373.svg'),
      },
      绿色透明圆形科技图标内容容器5: {
        url: require('./img-templet/pic-91-d3bc155064009f60.svg'),
      },
      绿色透明圆形科技图标内容容器6: {
        url: require('./img-templet/pic-92-1da470d0f3248d53.svg'),
      },
      绿色透明圆形科技图标内容容器7: {
        url: require('./img-templet/pic-93-c920a059a59a1101.svg'),
      },
      绿色透明圆形科技图标内容容器8: {
        url: require('./img-templet/pic-95-eeef92d8db642b8a.svg'),
      },
      绿色透明圆形科技图标内容容器9: {
        url: require('./img-templet/pic-97-f51ff4ed9582b183.svg'),
      },
      绿色透明圆形科技图标内容容器10: {
        url: require('./img-templet/pic-99-4abc4eb1452d29b9.svg'),
      },
      绿色透明圆形科技图标内容容器11: {
        url: require('./img-templet/pic-100-f3d8d1cf308e6045.svg'),
      },
      绿色透明圆形科技图标内容容器12: {
        url: require('./img-templet/pic-101-1d3303ca27160431.svg'),
      },
      绿色透明圆形科技图标内容容器13: {
        url: require('./img-templet/pic-102-650d1d49bbc3f90d.svg'),
      },
      绿色透明圆形科技图标内容容器14: {
        url: require('./img-templet/pic-105-0b98f8b1c5eff91d.svg'),
      },
      蓝色透明圆形科技图标内容容器: {
        url: require('./img-templet/pic-107-1cefca1222366880.svg'),
      },
      蓝色透明圆形科技图标内容容器1: {
        url: require('./img-templet/pic-110-774c2e277572d7a7.svg'),
      },
      蓝色透明圆形科技图标内容容器2: {
        url: require('./img-templet/pic-111-a2b8172296df62b8.svg'),
      },
      蓝色透明圆形科技图标内容容器3: {
        url: require('./img-templet/pic-113-ed114f084a0dcc32.svg'),
      },
      蓝色透明圆形科技图标内容容器4: {
        url: require('./img-templet/pic-114-3cb7037726e05de6.svg'),
      },
      蓝色透明圆形科技图标内容容器5: {
        url: require('./img-templet/pic-116-1af468c2d3b26604.svg'),
      },
      蓝色透明圆形科技图标内容容器6: {
        url: require('./img-templet/pic-117-9aaca96c31b673f2.svg'),
      },
      蓝色透明圆形科技图标内容容器7: {
        url: require('./img-templet/pic-120-397a7ebdee216724.svg'),
      },
      蓝色透明圆形科技图标内容容器14: {
        url: require('./img-templet/pic-Rx6skE3VN4Cg7sbv.svg'),
      },
      蓝色灰色透明圆形科技图标内容容器: {
        url: require('./img-templet/pic-134-963e5094b0dba95b.png'),
      },
      透明圆形科技图标内容容器: {
        url: require('./img-templet/pic-135-a0fa9e03938661a5.svg'),
      },
      灰色透明圆形科技图标内容容器: {
        url: require('./img-templet/pic-136-ad9201b14eb6c652.png'),
      },
      彩色透明圆形科技图标内容容器: {
        url: require('./img-templet/pic-145-21e245aedee0de09.png'),
      },
      黑色透明圆形科技图标内容容器: {
        url: require('./img-templet/pic-146-8920af838646a629.png'),
      },
      蓝色透明圆形科技图标内容容器8: {
        url: require('./img-templet/pic-149-b32beb8fd134fc54.svg'),
      },
      蓝色白色透明圆形科技图标内容容器15: {
        url: require('./img-templet/pic-156-062a14b6e991e615.svg'),
      },
      绿色色透明圆形科技图标内容容器9: {
        url: require('./img-templet/pic-159-fb51c15fde89ef4e.svg'),
      },
      蓝色透明圆形科技图标内容容器10: {
        url: require('./img-templet/pic-161-0fa07c12b35c24bc.svg'),
      },
      蓝色透明圆形科技图标内容容器11: {
        url: require('./img-templet/pic-162-bbb5036fa6d70cb8.svg'),
      },
      蓝色透明圆形科技图标内容容器12: {
        url: require('./img-templet/pic-163-c6d2a5a97de8afdd.svg'),
      },
      黑色透明圆形科技图标内容容器1: {
        url: require('./img-templet/pic-188-cf68ce857c5d2132.svg'),
      },
      蓝色橙色透明圆形科技图标内容容器: {
        url: require('./img-templet/pic-212-ad675474e3a7d09e.svg'),
      },
      蓝色橙色透明圆形科技图标内容容器1: {
        url: require('./img-templet/pic-216-50f3f5a9591c7434.svg'),
      },
      蓝色橙色透明圆形科技图标内容容器2: {
        url: require('./img-templet/pic-218-5ecac56bde35e339.svg'),
      },
      蓝色透明圆形科技图标内容容器13: {
        url: require('./img-templet/pic-220-086976b26747709b.svg'),
      },
      蓝色橙色透明圆形科技图标内容容器3: {
        url: require('./img-templet/pic-222-45417b8ce51e5cd3.svg'),
      },
      蓝色橙色透明圆形科技图标内容容器4: {
        url: require('./img-templet/pic-223-0b778807c1bb67c7.svg'),
      },
      白色透明圆形科技图标内容容器1: {
        url: require('./img-templet/pic-158-372f8fd07356909e.svg'),
      },
      白色透明圆形科技图标内容容器2: {
        url: require('./img-templet/pic-151-e2738068673585a6.svg'),
      },
      白色透明圆形科技图标内容容器3: {
        url: require('./img-templet/pic-82-876dc97d669e605b.svg'),
      },
      白色透明圆形科技图标内容容器4: {
        url: require('./img-templet/pic-10-0c8389df530a1f47.svg'),
      },
      白色透明圆形科技图标内容容器5: {
        url: require('./img-templet/pic-11-a7b79f03819b1ddc.svg'),
      },
      白色透明圆形科技图标内容容器6: {
        url: require('./img-templet/pic-12-18bee672b5372661.svg'),
      },
      白色透明圆形科技图标内容容器7: {
        url: require('./img-templet/pic-15-e7bd6f9039099707.svg'),
      },
      白色透明圆形科技图标内容容器8: {
        url: require('./img-templet/pic-16-cf89d109de8c597b.svg'),
      },
      白色透明圆形科技图标内容容器9: {
        url: require('./img-templet/pic-17-6ac25079cb528b83.svg'),
      },
      白色透明圆形科技图标内容容器10: {
        url: require('./img-templet/pic-18-c2a113c97bec03a1.svg'),
      },
      白色透明圆形科技图标内容容器11: {
        url: require('./img-templet/pic-19-4a63c742183b7ae4.svg'),
      },
      白色透明圆形科技图标内容容器12: {
        url: require('./img-templet/pic-20-313241f90bd9ec85.svg'),
      },
      白色透明圆形科技图标内容容器13: {
        url: require('./img-templet/pic-21-e0398326340ae91a.svg'),
      },
      白色透明圆形科技图标内容容器14: {
        url: require('./img-templet/pic-22-804854bdf2036602.svg'),
      },
      白色透明圆形科技图标内容容器15: {
        url: require('./img-templet/pic-23-eb914baa717970db.svg'),
      },
      白色透明圆形科技图标内容容器16: {
        url: require('./img-templet/pic-25-5dfbba4b28fd7ced.svg'),
      },
      蓝色黄色橙色透明圆形科技图标内容容器: {
        url: require('./img-templet/pic-24-6c972ffdc6eef04b.svg'),
      },
      蓝色黄色橙色透明圆形科技图标内容容器1: {
        url: require('./img-templet/pic-28-fb84e019b9bdb301.svg'),
      },
      蓝色黄色橙色透明圆形科技图标内容容器2: {
        url: require('./img-templet/pic-31-49e8f158592534a2.svg'),
      },
      蓝色黄色橙色透明圆形科技图标内容容器3: {
        url: require('./img-templet/pic-36-5521e112f6ac21cc.svg'),
      },
      蓝色黄色橙色透明圆形科技图标内容容器4: {
        url: require('./img-templet/pic-39-3365c60858bb3739.svg'),
      },
      蓝色黄色橙色透明圆形科技图标内容容器5: {
        url: require('./img-templet/pic-40-60c825b4f1220635.svg'),
      },
      蓝色黄色橙色透明圆形科技图标内容容器6: {
        url: require('./img-templet/pic-41-6c197a1f3fd39f66.svg'),
      },
      蓝色黄色橙色透明圆形科技图标内容容器7: {
        url: require('./img-templet/pic-42-2b7dabd8042669a7.svg'),
      },
      蓝色透明圆形科技图标装饰: {
        url: require('./img-templet/pic-6EuNuYY8tzmZTB38.png'),
      },
      蓝色圆形透明科技图标装饰: {
        url: require('./img-templet/pic-k4Ko7fAZvg7kK2wQ.svg'),
      },
      蓝色圆形透明科技装饰图标: {
        url: require('./img-templet/pic-s8HUxG6zkctQH64Z.svg'),
      },
      蓝色圆形透明科技装饰图标1: {
        url: require('./img-templet/pic-115-2c4fac34a2f197e2.svg'),
      },
      蓝色圆形透明科技装饰图标2: {
        url: require('./img-templet/pic-119-e1c730b10d3d61bb.svg'),
      },
      绿色橙色圆形透明科技装饰图标: {
        url: require('./img-templet/pic-128-bc885985a9ca5567.svg'),
      },
      绿色橙色圆形透明科技装饰图标1: {
        url: require('./img-templet/pic-129-2bfa8c3c2ab4abf1.svg'),
      },
      绿色橙色圆形透明科技装饰图标2: {
        url: require('./img-templet/pic-130-41c09df5eb0fb173.svg'),
      },
      蓝色黄色圆形透明科技装饰图标: {
        url: require('./img-templet/pic-174-0d5bd929901a81e0.svg'),
      },
      蓝色黄色圆形透明科技装饰图标1: {
        url: require('./img-templet/pic-185-85c3c49c140a02fc.svg'),
      },
      绿色橙色圆形透明科技装饰图标3: {
        url: require('./img-templet/pic-131-7381438346d9d5bd.svg'),
      },
      蓝色黄色圆形透明科技装饰图标2: {
        url: require('./img-templet/pic-0-e2c04ad2159a7e94.svg'),
      },
      蓝色黄色圆形透明科技装饰图标3: {
        url: require('./img-templet/pic-13-4336d40c1466ebb9.svg'),
      },
      蓝色黄色圆形透明科技装饰图标4: {
        url: require('./img-templet/pic-30-d49e73f6f987589e.svg'),
      },
      绿色圆形透明科技装饰图标: {
        url: require('./img-templet/pic-98-b9e8b5357eedec65.svg'),
      },
      绿色圆形透明科技装饰图标1: {
        url: require('./img-templet/pic-8-198f394afa2fc518.svg'),
      },
      白色圆形透明科技装饰图标: {
        url: require('./img-templet/pic-150-98b68ff152ccab34.svg'),
      },
      灰色圆形透明科技装饰图标: {
        url: require('./img-templet/pic-170-7175d5b35cf6b39d.svg'),
      },
      灰色圆形透明科技装饰图标1: {
        url: require('./img-templet/pic-177-a0cc458b90626397.svg'),
      },
      灰色圆形透明科技装饰图标2: {
        url: require('./img-templet/pic-178-c35393468316dbbb.svg'),
      },
      蓝色圆形透明科技装饰图标3: {
        url: require('./img-templet/pic-192-bdf02653c9ba19a9.svg'),
      },
      蓝色圆形透明科技装饰图标4: {
        url: require('./img-templet/pic-194-22f90432f2fa547a.svg'),
      },
      蓝色圆形透明科技装饰图标5: {
        url: require('./img-templet/pic-195-1e76330e19d0c984.svg'),
      },
      蓝色黄色圆形透明科技装饰图标5: {
        url: require('./img-templet/pic-196-c38940ab17a3601b.svg'),
      },
      蓝色圆形透明科技装饰图标6: {
        url: require('./img-templet/pic-197-722b800c19dae04f.svg'),
      },
      蓝色圆形透明科技装饰图标7: {
        url: require('./img-templet/pic-198-65992fd8f5243196.svg'),
      },
      蓝色黄色透明科技3D立体圆形图标: {
        url: require('./img-templet/pic-ak77ojdPz6y6xLgM.svg'),
      },
      红色蓝色绿色透明3D立体椭圆形科技图标图形: {
        url: require('./img-templet/pic-PMx4yFtQ9Bwk24Ye.png'),
      },
      绿色橙色透明科技3D立体圆形图标: {
        url: require('./img-templet/pic-127-a88e3546cdc09d2f.svg'),
      },
      绿色橙色透明科技3D立体圆形图标1: {
        url: require('./img-templet/pic-133-e53efaa2142a941c.svg'),
      },
      绿色橙色透明科技3D立体圆形图标2: {
        url: require('./img-templet/pic-76-11a3481aa07a64cd.svg'),
      },
      绿色透明科技3D立体圆形图标: {
        url: require('./img-templet/pic-78-b9d8ee071b7ebd10.svg'),
      },
      绿色橙色透明科技3D立体圆形图标3: {
        url: require('./img-templet/pic-79-e3f84b3639741ab0.svg'),
      },
      白色透明科技3D立体圆形图标: {
        url: require('./img-templet/pic-122-73aa4f39f6e796bd.svg'),
      },
      绿色橙色透明科技3D立体圆形图标4: {
        url: require('./img-templet/pic-80-001ba9a191f37c19.svg'),
      },
      绿色橙色透明科技3D立体圆形图标5: {
        url: require('./img-templet/pic-26-cda6b50c1329139b.svg'),
      },
      蓝色透明科技图形线条装饰: {
        url: require('./img-templet/pic-g2N6DyaQF6LPAs4B.png'),
      },
      蓝色黄色灰色科技圆形透明装饰: {
        url: require('./img-templet/pic-112-a8c845277ebef04c.svg'),
      },
      蓝色透明六边形背景: {
        url: require('./img-templet/pic-207-69a192eba784e360.svg'),
      },
      蓝色点状科技装饰: {
        url: require('./img-templet/pic-37-633bb82ebc9b25e6.svg'),
      },
      橙色透明圆形科技装饰: {
        url: require('./img-templet/pic-48-c1a5eef07b5d5425.svg'),
      },
      绿色透明圆形科技装饰: {
        url: require('./img-templet/pic-90-68cde83e64dea400.svg'),
      },
      白色透明圆形科技装饰: {
        url: require('./img-templet/pic-94-3c2bbf3b334c30d7.svg'),
      },
      蓝色透明圆形科技装饰: {
        url: require('./img-templet/pic-103-ca39c088b6670cb7.svg'),
      },
      蓝色透明圆形科技装饰1: {
        url: require('./img-templet/pic-106-cc56afa714949530.svg'),
      },
      绿色橙色透明圆形科技装饰: {
        url: require('./img-templet/pic-121-c025ba5fee8e49dc.svg'),
      },
      蓝色白色透明圆形矩形科技装饰内容容器: {
        url: require('./img-templet/pic-153-4b325ac603d45e98.svg'),
      },
      绿色白色透明圆形矩形科技装饰内容容器: {
        url: require('./img-templet/pic-154-16c68d2f29f5807f.svg'),
      },
      蓝色白色透明圆形科技装饰内容容器: {
        url: require('./img-templet/pic-155-0dfc47db174d5178.svg'),
      },
      蓝色粉色白色透明科技装饰: {
        url: require('./img-templet/pic-175-35866228a0107071.svg'),
      },
      蓝色灰色透明圆形科技装饰内容容器: {
        url: require('./img-templet/pic-203-5b445857587df025.svg'),
      },
      蓝色橙色透明波科技装饰: {
        url: require('./img-templet/pic-211-447213f9bd0e126a.svg'),
      },
      白色透明科技装饰: {
        url: require('./img-templet/pic-118-d604686a4668f382.svg'),
      },
      蓝色橙色透明正弦波科技装饰1: {
        url: require('./img-templet/pic-44-f97d63699092a7e7.svg'),
      },
      灰色透明六边形背景: {
        url: require('./img-templet/pic-77-0f404419b514713d.svg'),
      },
      蓝色红色透明圆形科技装饰内容容器: {
        url: require('./img-templet/pic-204-514533d70da418f5.svg'),
      },
      蓝色红色透明网状科技装饰: {
        url: require('./img-templet/pic-219-4cb48f0a3b6abef6.svg'),
      },
      金色透明底部装饰城市楼图形: {
        url: require('./img-templet/pic-rx8P7K2RLhNKMqY8.png'),
      },
      金色黑色透明圆形科技装饰内容容器: {
        url: require('./img-templet/pic-202-348bab7afad0c590.svg'),
      },
      蓝色橙色六边形透明科技装饰: {
        url: require('./img-templet/pic-205-9858b2081c5f1179.svg'),
      },
      蓝色橙色透明科技装饰: {
        url: require('./img-templet/pic-208-42a0647d05bd7889.svg'),
      },
      蓝色橙色透明科技装饰1: {
        url: require('./img-templet/pic-209-577587344e2f831e.svg'),
      },
      蓝色橙色透明科技装饰2: {
        url: require('./img-templet/pic-214-26c11c2bbee87864.svg'),
      },
      蓝色透明科技装饰: {
        url: require('./img-templet/pic-4-5074ded2524b8653.svg'),
      },
      蓝色透明科技装饰1: {
        url: require('./img-templet/pic-5-37346ef73b29ddab.svg'),
      },
      蓝色矩形圆形透明科技装饰: {
        url: require('./img-templet/pic-33-cb0b9d6e886347d1.svg'),
      },
      蓝色透明科技装饰2: {
        url: require('./img-templet/pic-35-57b10f7af50c0760.svg'),
      },
      蓝色动物图标装饰: {
        url: require('./img-templet/pic-54-9bf61eccdb1f08a9.svg'),
      },
      蓝色盾牌图标装饰: {
        url: require('./img-templet/pic-57-cda46342106d6872.svg'),
      },
      蓝色警告图标装饰: {
        url: require('./img-templet/pic-58-de1e31cd28b911ae.svg'),
      },
      蓝色面包图标装饰: {
        url: require('./img-templet/pic-59-55c75b5996a78bf9.svg'),
      },
      蓝色钩子图标装饰: {
        url: require('./img-templet/pic-61-8f520b384e4681f6.svg'),
      },
      蓝色放射图标装饰: {
        url: require('./img-templet/pic-62-cdd1897181c725df.svg'),
      },
      蓝色禁止图标装饰: {
        url: require('./img-templet/pic-63-5b5a09ecc00f9a22.svg'),
      },
      蓝色齿轮图标装饰: {
        url: require('./img-templet/pic-64-08e131d1f602e788.svg'),
      },
      蓝色闪电图标装饰: {
        url: require('./img-templet/pic-65-de27a00aa86ae8bb.svg'),
      },
      蓝色标志图标装饰: {
        url: require('./img-templet/pic-67-6ed08002e9cadc17.svg'),
      },
      蓝色柱状图标装饰: {
        url: require('./img-templet/pic-68-6c80fe43f37eec71.svg'),
      },
      蓝色机器人飞船图标装饰: {
        url: require('./img-templet/pic-69-327e43d697e1454c.svg'),
      },
      蓝色王冠图标装饰: {
        url: require('./img-templet/pic-70-434cac11d12141f4.svg'),
      },
      蓝色靶子图标装饰: {
        url: require('./img-templet/pic-72-dab4640c78a9ca3c.svg'),
      },
      蓝色火焰图标装饰: {
        url: require('./img-templet/pic-73-6e06c13b7bd5f9b1.svg'),
      },
      蓝色堆叠图标装饰: {
        url: require('./img-templet/pic-74-78b941bb0fb55756.svg'),
      },
      蓝色试剂图标装饰: {
        url: require('./img-templet/pic-75-9cc68e54f44122dd.svg'),
      },
      灰色图标装饰: {
        url: require('./img-templet/pic-182-2cf86f77883f9ad9.svg'),
      },
      蓝色万花筒透明图标装饰: {
        url: require('./img-templet/pic-190-12096598809eca43.svg'),
      },
      蓝色地球透明图标装饰: {
        url: require('./img-templet/pic-193-c6fe2f0bc2f7150b.svg'),
      },
      紫色图标文件文档透明: {
        url: require('./img-templet/pic-4.png'),
      },
      橙色透明灯泡图标: {
        url: require('./img-templet/pic-5.png'),
      },
      红色闪电图标透明: {
        url: require('./img-templet/pic-6.png'),
      },
      绿色闪电图标透明: {
        url: require('./img-templet/pic-7.png'),
      },
    },
  },
  {
    title: '科技感',
    data: {
      科技1: {
        url: require('./img-templet/tech/circle1.svg'),
      },
      科技2: {
        url: require('./img-templet/tech/circle2.svg'),
      },
      科技3: {
        url: require('./img-templet/tech/circle3.svg'),
      },
      科技4: {
        url: require('./img-templet/tech/circle4.svg'),
      },
      科技5: {
        url: require('./img-templet/tech/circle5.svg'),
      },
      科技6: {
        url: require('./img-templet/tech/circle6.svg'),
      },
      科技7: {
        url: require('./img-templet/tech/circle7.svg'),
      },
      科技8: {
        url: require('./img-templet/tech/circle8.svg'),
      },
      科技9: {
        url: require('./img-templet/tech/circle9.svg'),
      },
      科技10: {
        url: require('./img-templet/tech/circle10.svg'),
      },
      科技11: {
        url: require('./img-templet/tech/circle11.svg'),
      },
      科技12: {
        url: require('./img-templet/tech/circle12.svg'),
      },
    },
  },
];
picList.forEach((item) => {
  assets.pics = {
    ...assets.pics,
    ...item.data,
  };
});
assets.backgrounds = {
  默认: {
    url: require('./img-templet/bg_03.png'),
  },
  蓝色网格: {
    url: require('./img-templet/background-17.png'),
  },
  深色蓝色网格: {
    url: require('./img-templet/background-3.png'),
  },
  深色蓝色标题: {
    url: require('./img-templet/bg_01.png'),
  },
  深色蓝色渐变: {
    url: require('./img-templet/bg_02.png'),
  },
  深色蓝色简约: {
    url: require('./img-templet/background-1.png'),
  },
  深色蓝色网格标题: {
    url: require('./img-templet/background-2.png'),
  },
  深色蓝色星空: {
    url: require('./img-templet/background-zKvVf3rb7brY6rK8.jpg'),
  },
  深色黑色星空星球地球: {
    url: require('./img-templet/background-g4Q9Ar2kRDRpr8yK.jpg'),
  },
  深色紫色蓝色地球地图: {
    url: require('./img-templet/background-88VwuczRK2Rx8iRx.jpg'),
  },
  深色渐变星空: {
    url: require('./img-templet/background-49uxqXBm2G2jQqod.jpg'),
  },
  深色黑色金色标题: {
    url: require('./img-templet/background-44cWxfnyxe4Vj3XF.jpg'),
  },
  透明: {
    url: require('./img-templet/background-4.png'),
  },
  深色蓝色地球科技: {
    url: require('./img-templet/background-1-41949a72a05e60d0.jpg'),
  },
  深色蓝色地球科技1: {
    url: require('./img-templet/background-2-6dfcf39aa56ca711.jpg'),
  },
  深色金色蓝色线条: {
    url: require('./img-templet/background-3-647572d6c5cce669.jpg'),
  },
  深色蓝色金色地球地图: {
    url: require('./img-templet/background-6-aa4b2b1f271ad50a.jpg'),
  },
  深色蓝色白色线条宽屏: {
    url: require('./img-templet/background-4-3a9445e651481957.jpg'),
  },
  深色红色科技线条宽屏: {
    url: require('./img-templet/background-5-f6e7276179ee0caf.jpg'),
  },
  深色蓝色白色科技地球星空移动端: {
    url: require('./img-templet/background-5.png'),
  },
  深色蓝色白色科技地球星空: {
    url: require('./img-templet/background-6.png'),
  },
  深色蓝色红色圆形光点光线网格移动端: {
    url: require('./img-templet/background-7.png'),
  },
  深色蓝色红色圆形光点光线网格: {
    url: require('./img-templet/background-8.png'),
  },
  深色蓝色方形光点网格移动端: {
    url: require('./img-templet/background-9.png'),
  },
  深色蓝色方形光点网格: {
    url: require('./img-templet/background-10.png'),
  },
  深色蓝色星空科技标题容器: {
    url: require('./img-templet/background-11.png'),
  },
  深色蓝色星空科技标题容器移动端: {
    url: require('./img-templet/background-12.png'),
  },
  深色蓝色中国地图科技标题容器: {
    url: require('./img-templet/background-13.png'),
  },
  深色蓝色中国地图科技标题容器移动端: {
    url: require('./img-templet/background-14.png'),
  },
  深色蓝色地球图表容器科技: {
    url: require('./img-templet/background-15.png'),
  },
  深色蓝色光点水滴唯美柔光网格标题容器科技: {
    url: require('./img-templet/background-16.png'),
  },
};
assets.headers = {
  默认头图: {
    url: require('./img-templet/header_03.png'),
  },
  淡蓝色: {
    url: require('./img-templet/header_01.png'),
  },
  蓝色: {
    url: require('./img-templet/header_02.png'),
  },
  蓝色2: {
    url: require('./img-templet/header_04.png'),
  },
};
assets.footers = {
  默认: {
    url: null,
  },
  蓝色底部: {
    url: require('./img-templet/footer_03.png'),
  },
};

export default { picList, ...assets };
