import { axios, mock } from '@/utils/axios';
import * as R from 'ramda';
export interface IComponentItem {
  title: string;
  icon: string;
  num?: number;
  list: {
    title: string;
    image: string;
    type: string;
  }[];
}
export interface IComponent {
  title: string;
  icon: string;
  list: IComponentItem[];
}

const componentList: IComponent[] = [
  {
    title: '常规图表',
    icon: 'icon-com-regular',
    list: [
      {
        title: '柱形图',
        icon: 'com-font datav-com-icon icon-com-default icon-com-regular_bar icon-com-regular',
        list: [
          {
            type: 'regular_bar',
            title: '水平正负柱状图',
            image:
              '//resource.datav.aliyun.com/cube/com/@ChJ.limit_free/horizontal-positive-negative-bar-chart/0.2.2/icons/316x238icon.png?time=1541142278860',
          },
          {
            type: 'regular_bar',
            title: '折线柱图',
            image:
              '//resource.datav.aliyun.com/cube/com/@ChJ.limit_free/line-bar-chart/0.2.0/icons/316x238icon.png?time=1513585888239',
          },
          {
            type: 'regular_line',
            title: '基础区域图',
            image: 'https://img.alicdn.com/tfs/TB19wvDoeL2gK0jSZPhXXahvXXa-370-208.png',
          },
          {
            type: 'regular_line',
            title: '堆叠区域图',
            image: 'https://img.alicdn.com/tfs/TB1CKfIobj1gK0jSZFOXXc7GpXa-370-208.png',
          },
          {
            type: 'regular_bar',
            title: '圆弧柱形图',
            image: 'https://img.alicdn.com/tfs/TB1S8YIoeH2gK0jSZJnXXaT1FXa-370-208.png',
          },
          {
            type: 'regular_bar',
            title: '基础柱形图',
            image: 'https://img.alicdn.com/tfs/TB1rObDooH1gK0jSZSyXXXtlpXa-370-208.png',
          },
          {
            type: 'regular_bar',
            title: '基础条形图',
            image: 'https://img.alicdn.com/tfs/TB12_vHobY1gK0jSZTEXXXDQVXa-370-210.png',
          },
          {
            type: 'regular_bar',
            title: '区间柱形图',
            image: 'https://img.alicdn.com/tfs/TB1igzDoeL2gK0jSZPhXXahvXXa-370-208.png',
          },
          {
            type: 'regular_bar',
            title: '堆叠柱形图',
            image: 'https://img.alicdn.com/tfs/TB1EHjAoaL7gK0jSZFBXXXZZpXa-370-210.png',
          },
          {
            type: 'regular_scatterplot',
            title: '气泡图',
            image: 'https://img.alicdn.com/tfs/TB1EInFokL0gK0jSZFAXXcA9pXa-185-104.png',
          },
          {
            type: 'regular_radar',
            title: '雷达图',
            image: 'https://img.alicdn.com/tfs/TB10OzEobr1gK0jSZFDXXb9yVXa-370-208.png',
          },
          {
            type: 'regular_rose',
            title: '玫瑰图',
            image: 'https://img.alicdn.com/tfs/TB1wz_FoeH2gK0jSZFEXXcqMpXa-370-208.png',
          },

          {
            type: 'regular_bar',
            title: '双11轮播列表柱状图',
            image: '//img.alicdn.com/tfs/TB14EbmlRv0gK0jSZKbXXbK2FXa-368-208.png',
          },
          {
            type: 'regular_bar',
            title: '堆叠条形图',
            image: '//img.alicdn.com/tfs/TB18aDnlUT1gK0jSZFrXXcNCXXa-368-208.png',
          },
          {
            type: 'regular_bar',
            title: '正负条形图',
            image: '//img.alicdn.com/tfs/TB14Q6nlSf2gK0jSZFPXXXsopXa-368-208.png',
          },
          {
            type: 'regular_bar',
            title: '极坐标堆叠柱图',
            image: '//img.alicdn.com/tfs/TB1XVetmebviK0jSZFNXXaApXXa-368-208.png',
          },
          {
            type: 'regular_scatterplot',
            title: '单轴气泡图',
            image: '//img.alicdn.com/tfs/TB1I4zqlND1gK0jSZFKXXcJrVXa-368-208.png',
          },

          {
            type: 'regular_bar',
            title: '柱状图',
            image: '//img.alicdn.com/tfs/TB1e5jmlND1gK0jSZFsXXbldVXa-368-208.png',
          },
          {
            type: 'regular_bar',
            title: '堆叠柱状图',
            image: '//img.alicdn.com/tfs/TB1zhLrlRr0gK0jSZFnXXbRRXXa-368-208.png',
          },
          {
            type: 'regular_bar',
            title: '阶梯瀑布图',
            image: '//img.alicdn.com/tfs/TB1w4Z1mUT1gK0jSZFhXXaAtVXa-368-208.png',
          },
          {
            type: 'regular_bar',
            title: '标注气泡柱状图',
            image: '//img.alicdn.com/tfs/TB1JP_olKH2gK0jSZFEXXcqMpXa-368-208.png',
          },

          {
            type: 'regular_pictorialBar',
            title: '象形柱图',
            image: '//img.alicdn.com/tfs/TB11HnnlQP2gK0jSZPxXXacQpXa-368-208.png',
          },
          {
            type: 'regular_bar',
            title: '条形面积图',
            image:
              '//resource.datav.aliyun.com/cube/com/@shumenggongchang-free/bar-area/2.0.6/icons/316x238icon.png',
          },
          {
            type: 'regular_bar',
            title: '双向条形图',
            image:
              '//resource.datav.aliyun.com/cube/com/@shumenggongchang-free/bidirectional-bar-graph/2.0.9/icons/316x238icon.png',
          },

          {
            type: 'regular_bar',
            title: '双柱状图',
            image:
              '//resource.datav.aliyun.com/cube/com/@xhzy-anime/double-barchart/0.0.2/icons/cover.png',
          },
          {
            type: 'regular_bar',
            title: '对比柱状图',
            image:
              '//resource.datav.aliyun.com/cube/com/@xhzy-anime/double-barchart-verticle/0.0.1/icons/cover.png',
          },
          {
            type: 'regular_bar',
            title: '双y轴柱状图',
            image:
              '//resource.datav.aliyun.com/cube/com/@xhzy-anime/double-barchart_2axis/0.0.1/icons/cover.png',
          },

          {
            type: 'regular_bar',
            title: '双轴折线柱状图',
            image:
              '//resource.datav.aliyun.com/cube/com/@xhzy-anime/line_barchart/0.0.2/icons/cover.png',
          },
          {
            type: 'regular_bar',
            title: '多柱状图',
            image:
              '//resource.datav.aliyun.com/cube/com/@xhzy-anime/multiple-barchart/0.0.1/icons/cover.png',
          },
          {
            type: 'regular_bar',
            title: '多堆叠图',
            image:
              '//resource.datav.aliyun.com/cube/com/@xhzy-anime/multiple-barchart-stack/0.0.1/icons/cover.png',
          },

          {
            type: 'regular_bar',
            title: '双y轴折线图柱状图',
            image:
              '//resource.datav.aliyun.com/cube/com/@xhzy-anime/point-barchart/0.0.1/icons/cover.png',
          },
          {
            type: 'regular_bar',
            title: '单柱状图',
            image:
              '//resource.datav.aliyun.com/cube/com/@xhzy-anime/single-barchart/0.0.2/icons/cover.png',
          },
          {
            type: 'regular_bar',
            title: '弧形柱图',
            image: '//img.alicdn.com/tfs/TB1Wk6rlKH2gK0jSZJnXXaT1FXa-368-208.png',
          },

          {
            type: 'regular_area',
            title: '翻牌器区域图',
            image:
              'https://datav.oss-cn-hangzhou.aliyuncs.com/uploads/images/7c3e31a75ee4aff92f50677483de28d5.png',
          },
          {
            type: 'regular_bar',
            title: '基本柱状图',
            image: '//img.alicdn.com/tfs/TB1aUw0mRv0gK0jSZKbXXbK2FXa-368-208.png',
          },
          {
            type: 'regular_bar',
            title: '垂直胶囊柱状图',
            image: '//img.alicdn.com/tfs/TB1rVytmebviK0jSZFNXXaApXXa-368-208.png',
          },
          {
            type: 'regular_bar',
            title: '胶囊款横向柱状图',
            image:
              'https://datav.oss-cn-hangzhou.aliyuncs.com/uploads/images/15a2ee7228d89224a285908d2f37e83f.png',
          },
          {
            type: 'regular_bar',
            title: '梯形柱状图',
            image:
              'https://datav.oss-cn-hangzhou.aliyuncs.com/uploads/images/de03b8c190a88078cd25c8f9e9319bd4.png',
          },
          {
            type: 'regular_bar',
            title: '折线柱状图',
            image:
              'https://datav.oss-cn-hangzhou.aliyuncs.com/uploads/images/bf02c665dd1c62118c6f5ecc2e4a8323.png',
          },

          {
            type: 'regular_line',
            title: '区域翻牌器',
            image: '//img.alicdn.com/tfs/TB1M.g0mRv0gK0jSZKbXXbK2FXa-368-208.png',
          },
          {
            type: 'regular_bar',
            title: '垂直堆叠柱状图',
            image: '//img.alicdn.com/tfs/TB1f67omF67gK0jSZPfXXahhFXa-368-208.png',
          },
          {
            type: 'regular_bar',
            title: '垂直分组柱状图',
            image: '//img.alicdn.com/tfs/TB1yYUObGNj0u4jSZFyXXXgMVXa-368-208.png',
          },
          {
            type: 'regular_bar',
            title: '水平基本柱状图',
            image: '//img.alicdn.com/tfs/TB15HU3mKL2gK0jSZPhXXahvXXa-368-208.png',
          },
          {
            type: 'regular_column',
            title: '水平胶囊柱状图',
            image: '//img.alicdn.com/tfs/TB1m7Z1mSf2gK0jSZFPXXXsopXa-368-208.png',
          },
          {
            type: 'regular_bar',
            title: '分组柱状图',
            image: '//img.alicdn.com/tfs/TB1oXE1mUD1gK0jSZFGXXbd3FXa-368-208.png',
          },
          {
            type: 'regular_bar',
            title: '区间范围柱状图',
            image: '//img.alicdn.com/tfs/TB1zg4WxQL0gK0jSZFxXXXWHVXa-368-208.png',
          },
          {
            type: 'regular_bar',
            title: '梯形柱状图',
            image: '//img.alicdn.com/tfs/TB1CEM4mHY1gK0jSZTEXXXDQVXa-368-208.png',
          },
          {
            type: 'regular_bar',
            title: '瀑布图',
            image: '//img.alicdn.com/tfs/TB1vp0ZxHY1gK0jSZTEXXXDQVXa-368-208.png',
          },
          {
            type: 'regular_bar',
            title: '折线柱状图',
            image: '//img.alicdn.com/tfs/TB1kcYqlQT2gK0jSZPcXXcKkpXa-368-208.png',
          },
          {
            type: 'regular_bar',
            title: '斑马柱状图',
            image: '//img.alicdn.com/tfs/TB1pxI1mUT1gK0jSZFhXXaAtVXa-368-208.png',
          },
          {
            type: 'regular_scatterplot',
            title: '气泡图',
            image: '//img.alicdn.com/tfs/TB1V5kZmFT7gK0jSZFpXXaTkpXa-368-208.png',
          },
          {
            type: 'regular_bar',
            title: '百分比占比条形图',
            image: '//img.alicdn.com/tfs/TB1QctVxQL0gK0jSZFAXXcA9pXa-368-208.png',
          },
        ],
      },
      {
        title: '折线图',
        icon: 'com-font datav-com-icon icon-com-default icon-com-regular_line icon-com-regular',
        list: [
          {
            type: 'regular_line',
            title: '24时折线图',
            image: '//img.alicdn.com/tfs/TB1AhAZmFT7gK0jSZFpXXaTkpXa-368-208.png',
          },
          {
            type: 'regular_line',
            title: '基础折线图',
            image: 'https://img.alicdn.com/tfs/TB1VKfIobj1gK0jSZFOXXc7GpXa-370-208.png',
          },
          {
            type: 'regular_line',
            title: '基本折线图',
            image: '//img.alicdn.com/tfs/TB15kLllKT2gK0jSZFvXXXnFXXa-368-208.png',
          },
          {
            type: 'regular_line',
            title: '连续折线图',
            image: '//img.alicdn.com/tfs/TB1mKjrlHj1gK0jSZFOXXc7GpXa-368-208.png',
          },
          {
            type: 'regular_line',
            title: '瀑布图',
            image: '//img.alicdn.com/tfs/TB15_LqlHY1gK0jSZTEXXXDQVXa-368-208.png',
          },
          {
            type: 'regular_line',
            title: '堆叠折线图',
            image: '//img.alicdn.com/tfs/TB1e2jnlHr1gK0jSZFDXXb9yVXa-368-208.png',
          },
          {
            type: 'regular_line',
            title: '阶梯折线图',
            image: '//img.alicdn.com/tfs/TB1Y3rnlHr1gK0jSZFDXXb9yVXa-368-208.png',
          },
          {
            type: 'regular_line',
            title: '颜色分段折线图',
            image: '//img.alicdn.com/tfs/TB1KrnrlHj1gK0jSZFuXXcrHpXa-368-208.png',
          },
          {
            type: 'regular_line',
            title: '双折线图(移动轴)',
            image:
              '//resource.datav.aliyun.com/cube/com/@xhzy-anime/axis-linechart/0.0.1/icons/cover.png',
          },
          {
            type: 'regular_line',
            title: '双折线图',
            image:
              '//resource.datav.aliyun.com/cube/com/@xhzy-anime/double-linechart/0.0.1/icons/cover.png',
          },
          {
            type: 'regular_line',
            title: '多折线图',
            image:
              '//resource.datav.aliyun.com/cube/com/@xhzy-anime/multiple-linechart/0.0.1/icons/cover.png',
          },
          {
            type: 'regular_line',
            title: '手绘多折线图',
            image:
              '//resource.datav.aliyun.com/cube/com/@xhzy-anime/multiple-linechart-handpaint/0.0.1/icons/cover.png',
          },
          {
            type: 'regular_line',
            title: '单折线图',
            image:
              '//resource.datav.aliyun.com/cube/com/@xhzy-anime/single-linechart/0.0.2/icons/cover.png',
          },
          {
            type: 'regular_area',
            title: '双轴折线图',
            image:
              'https://datav.oss-cn-hangzhou.aliyuncs.com/uploads/images/4e9a983aecc592e79071aec639d07540.png',
          },
          {
            type: 'regular_area',
            title: '折线区域图',
            image:
              'https://datav.oss-cn-hangzhou.aliyuncs.com/uploads/images/323cc0ca7942c8faf66231456821d4b6.png',
          },
          {
            type: 'regular_line',
            title: '折线拐点图',
            image:
              'https://datav.oss-cn-hangzhou.aliyuncs.com/uploads/images/273142ab3b989e1662c1fc91fab5df49.png',
          },
          {
            type: 'regular_area',
            title: '区域图',
            image: '//img.alicdn.com/tfs/TB1HM75mQT2gK0jSZFkXXcIQFXa-368-208.png',
          },
          {
            type: 'regular_line',
            title: '基本折线图',
            image: '//img.alicdn.com/tfs/TB19MQ1mHr1gK0jSZFDXXb9yVXa-368-208.png',
          },
          {
            type: 'regular_line',
            title: '双轴区域折线图',
            image: '//img.alicdn.com/tfs/TB1mQw1mSf2gK0jSZFPXXXsopXa-368-208.png',
          },
        ],
      },
      {
        title: '饼图',
        icon: 'com-font datav-com-icon icon-com-default icon-com-regular_pie icon-com-regular',
        list: [
          {
            type: 'regular_pie',
            title: '基础饼图',
            image: 'https://img.alicdn.com/tfs/TB1jj_FoeH2gK0jSZFEXXcqMpXa-185-104.png',
          },
          {
            type: 'regular_pie',
            title: '双11百分比饼图',
            image: '//img.alicdn.com/tfs/TB1YN6qlND1gK0jSZFKXXcJrVXa-368-208.png',
          },
          {
            type: 'regular_pie',
            title: '时间轴对比饼图',
            image:
              '//resource.datav.aliyun.com/cube/com/@xhzy-anime/compare-piechart/0.0.1/icons/cover.png',
          },
          {
            type: 'regular_pie',
            title: '基本饼图',
            image:
              '//resource.datav.aliyun.com/cube/com/@xhzy-anime/single-piechart/0.0.2/icons/cover.png',
          },
          {
            type: 'regular_pie',
            title: '基本饼图2',
            image: '//img.alicdn.com/tfs/TB1sBmQDQL0gK0jSZFtXXXQCXXa-368-208.png',
          },
          {
            type: 'regular_pie',
            title: '标注对比饼图',
            image: '//img.alicdn.com/tfs/TB1Taw1mQP2gK0jSZPxXXacQpXa-368-208.png',
          },
          {
            type: 'regular_pie',
            title: '带图饼图',
            image: '//img.alicdn.com/tfs/TB1sKA0mKL2gK0jSZPhXXahvXXa-368-208.png',
          },
          {
            type: 'regular_pie',
            title: '多维度饼图',
            image: '//img.alicdn.com/tfs/TB1BRZ0mNz1gK0jSZSgXXavwpXa-368-208.png',
          },
          {
            type: 'regular_pie',
            title: '指标占比饼图',
            image: '//img.alicdn.com/tfs/TB1les1mNn1gK0jSZKPXXXvUXXa-368-208.png',
          },
          {
            type: 'regular_pie',
            title: '玫瑰图',
            image: '//img.alicdn.com/tfs/TB1tVMSk1bviK0jSZFNXXaApXXa-368-208.png',
          },
          {
            type: 'regular_pie',
            title: '分类玫瑰图',
            image: '//img.alicdn.com/tfs/TB1tVMSk1bviK0jSZFNXXaApXXa-368-208.png',
          },
          {
            type: 'regular_pie',
            title: '环图',
            image: '//img.alicdn.com/tfs/TB1XbsWmGL7gK0jSZFBXXXZZpXa-368-208.png',
          },
          {
            type: 'regular_pie',
            title: '中心图片的对比饼图',
            image:
              'https://datav.oss-cn-hangzhou.aliyuncs.com/uploads/images/61449612a7511a6e05ee5e3e14640896.png',
          },
          {
            type: 'regular_pie',
            title: '目标占比饼图',
            image: '//img.alicdn.com/tfs/TB1VdzmlKL2gK0jSZPhXXahvXXa-368-208.png',
          },
          {
            type: 'regular_pie',
            title: '指标对比饼图',
            image: '//img.alicdn.com/tfs/TB1VWc1mUT1gK0jSZFrXXcNCXXa-368-208.png',
          },
          {
            type: 'regular_pie',
            title: '单值百分比饼图',
            image: '//img.alicdn.com/tfs/TB1Rh2llFT7gK0jSZFpXXaTkpXa-368-208.png',
          },
          {
            type: 'regular_pie',
            title: '轮播饼图',
            image: '//img.alicdn.com/tfs/TB1_aI1mQP2gK0jSZPxXXacQpXa-368-208.png',
          },
        ],
      },
      {
        title: '散点图',
        icon:
          'com-font datav-com-icon icon-com-default icon-com-regular_scatterplot icon-com-regular',
        list: [
          {
            type: 'regular_scatterplot',
            title: '基础散点图',
            image: 'https://img.alicdn.com/tfs/TB1XovFokL0gK0jSZFxXXXWHVXa-368-208.png',
          },
          {
            type: 'regular_scatterplot',
            title: '大规模散点图',
            image: '//img.alicdn.com/tfs/TB1YAWNlF67gK0jSZPfXXahhFXa-368-208.png',
          },
          {
            type: 'regular_scatterplot',
            title: '散点图',
            image:
              '//resource.datav.aliyun.com/cube/com/@xhzy-anime/scatter_basic/0.0.2/icons/cover.png',
          },

          {
            type: 'regular_scatterplot',
            title: '基本散点图',
            image: '//img.alicdn.com/tfs/TB1M4M2mQY2gK0jSZFgXXc5OFXa-368-208.png',
          },

          {
            type: 'regular_scatterplot',
            title: '气泡散点图',
            image:
              'https://datav.oss-cn-hangzhou.aliyuncs.com/uploads/images/ca60a2ea62c04c4157d31d3629bb4054.png',
          },
        ],
      },
      {
        title: '其他',
        icon: 'com-font datav-com-icon icon-com-default icon-com-more',
        list: [
          {
            type: 'regular_liquidfill',
            title: '基本水位图',
            image: '//img.alicdn.com/tfs/TB105vsXaagSKJjy0FbXXa.mVXa-280-210.png',
          },
          {
            type: 'regular_scatter',
            title: '可变轴线映射',
            image:
              '//resource.datav.aliyun.com/cube/com/@dkbike.trial/scatter-nutrients/0.0.16/icons/316x238icon.gif',
          },
          {
            type: 'regular_number',
            title: '双11图标占比图',
            image: '//img.alicdn.com/tfs/TB1RdrmlQL0gK0jSZFtXXXQCXXa-368-208.png',
          },
          {
            type: 'regular_radar',
            title: '双11雷达图',
            image: '//img.alicdn.com/tfs/TB1LQHrlKH2gK0jSZJnXXaT1FXa-368-208.png',
          },
          {
            type: 'regular_bubble',
            title: '双11气泡图',
            image: '//img.alicdn.com/tfs/TB1WD_mlRv0gK0jSZKbXXbK2FXa-368-208.png',
          },

          {
            type: 'regular_radar',
            title: '基本雷达图',
            image: '//img.alicdn.com/tfs/TB19W73mO_1gK0jSZFqXXcpaXXa-368-208.png',
          },
          {
            type: 'regular_radar',
            title: '雷达图',
            image: '//img.alicdn.com/tfs/TB1QL2rlQT2gK0jSZFkXXcIQFXa-368-208.png',
          },
          {
            type: 'regular_sankey',
            title: '桑基图',
            image: '//img.alicdn.com/tfs/TB16Y6qlQT2gK0jSZPcXXcKkpXa-368-208.png',
          },
          {
            type: 'regular_effectscatter',
            title: '日历图',
            image: '//img.alicdn.com/tfs/TB1HwHolQY2gK0jSZFgXXc5OFXa-368-208.png',
          },
          {
            type: 'regular_line',
            title: 'K线图',
            image: '//img.alicdn.com/tfs/TB1N_3ZmKT2gK0jSZFvXXXnFXXa-368-208.png',
          },
          {
            type: 'regular_funnel',
            title: '漏斗图',
            image: '//img.alicdn.com/tfs/TB1htrjlGL7gK0jSZFBXXXZZpXa-368-208.png',
          },
          {
            type: 'regular_gauge',
            title: '仪表盘',
            image: '//img.alicdn.com/tfs/TB1rAfqlHH1gK0jSZFwXXc7aXXa-368-208.png',
          },
          {
            type: 'regular_heatmap',
            title: '热力图',
            image: '//img.alicdn.com/tfs/TB1zQjolKH2gK0jSZFEXXcqMpXa-368-208.png',
          },
          {
            type: 'regular',
            title: '指标面积图',
            image:
              'https://datav.oss-cn-hangzhou.aliyuncs.com/uploads/images/fdd963dda8105de0caea3efa3b5b5bb5.png',
          },
          {
            type: 'regular',
            title: '专题中国地图（饼图）',
            image:
              'https://datav.oss-cn-hangzhou.aliyuncs.com/uploads/images/35ef0d1da890a23e24ce06300eb0531f.png',
          },
          {
            type: 'regular',
            title: '省份排名分面图',
            image:
              'https://datav.oss-cn-hangzhou.aliyuncs.com/uploads/images/f84d2a6da34e50d227c6405fa2e9f3fc.png',
          },
          {
            type: 'regular',
            title: '双数据对比河流图',
            image:
              'https://datav.oss-cn-hangzhou.aliyuncs.com/uploads/images/7f6ff3e6f9539bf71e3413073c5a6a99.png',
          },
          {
            type: 'regular',
            title: 'Tab列表',
            image: '//img.alicdn.com/tfs/TB1b4jnlHr1gK0jSZR0XXbP8XXa-368-208.png',
          },
        ],
      },
    ],
  },
  {
    title: '地图',
    icon: 'icon-com-map',
    list: [],
  },
  {
    title: '媒体',
    icon: 'icon-com-media',
    list: [
      {
        title: '图片',
        icon: 'com-font icon-com-media_image',
        list: [
          {
            title: '单张图片',
            image: '/img/config/img_single.png',
            type: 'image.single',
          },
          {
            title: '轮播图',
            image: '/img/config/img_multi.png',
            type: 'image.multi',
          },
        ],
      },
      {
        title: '视频',
        icon: 'com-font con-com-media_video icon-com-media',
        list: [
          {
            title: 'RTMP视频播放器',
            image: '/img/config/video_rtmp.png',
            type: 'video.rtmp',
          },
          {
            title: '视频',
            image: '/img/config/video.png',
            type: 'video.video',
          },
          {
            title: '萤石云播放器',
            image: '/img/config/video_stone.png',
            type: 'video.stone',
          },
        ],
      },
    ],
  },
  {
    title: '文字',
    icon: 'icon-com-text',
    list: [],
  },
  {
    title: '关系网格',
    icon: 'icon-com-network',
    list: [],
  },
  {
    title: '素材',
    icon: 'icon-com-material',
    list: [],
  },
  {
    title: '交互',
    icon: 'icon-com-interact',
    list: [],
  },
  {
    title: '其他',
    icon: 'icon-com-decorate',
    list: [],
  },
  {
    title: '收藏',
    icon: 'icon-com-favorite',
    list: [],
  },
];

export const getComponentList = () =>
  mock(componentList).then(res =>
    res.map(item => {
      item.list = handleList(item.list);
      return item;
    }),
  );

const handleList = (list: IComponentItem[]) => {
  let all = {
    title: '全部',
    icon: 'com-font icon-com-all',
    num: 0,
    list: [],
  };
  let res = R.clone(list).map(item => {
    item.num = item.list.length;
    all.list = [...all.list, ...item.list];
    return item;
  });
  all.num = all.list.length;
  return [all, ...res];
};
