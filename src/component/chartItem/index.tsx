import React, { useState } from 'react';
// AVA 图表
import G2Plot from '@/component/chart/chart';

import { AChart } from '@/component/chart/g2plot';

import { CloseOutlined } from '@ant-design/icons';

import 'react-resizable/css/styles.css';
import 'react-grid-layout/css/styles.css';
import {
  BorderItem,
  FlipBoard,
  Percent,
  DigitalScroll,
  Decotation,
  Blank,
} from '@/component/widget';
import Echarts from '@/component/echarts';
import G2 from '@/component/g2';
import * as lib from './option';
import * as g2PlotLib from './option/g2plot';
export default ({ config, initState, onChange, onMockChange, onRemoveItem, idx, ...props }) => {
  const itemType = (config.type || '').toLowerCase();

  switch (itemType) {
    case 'decotation':
      return (
        <Decotation name="粉色蓝色透明圆形科技图标内容容器" {...props}>
          <span>65%</span>
        </Decotation>
      );
  }

  const Detail = () => {
    switch (itemType) {
      case '_blank':
        return <Blank config={initState} onChange={onChange} />;
      case 'percent':
        return <Percent option={{ value: 45.3, title: '某指标', half: Math.random() > 0.5 }} />;
      case 'flipboard':
        return <FlipBoard title="某指标" value={1336.647} decimals={2} suffix="元" />;
      case 'digitalscroll':
        return <DigitalScroll title="活动参与人数" value={138248} theme="theme1" suffix="人" />;
 
      case 'radialbar':
        return (
          <Echarts
            option={lib.radialBarChart({
              data: [
                ['周一', 15],
                ['周张2二', 6],
                ['周三', 17],
                ['周四', 8],
                ['周一2', 9],
                ['周张2二2', 9],
                ['周三2', 23],
                ['周四2', 7],
              ],
            })}
            renderer="svg"
          />
        );
      case 'pictorial':
        let theme: 'rect' | 'round' = Math.random() > 0.5 ? 'rect' : 'round';
        return (
          <Echarts
            option={lib.pictorialBar({
              data: [
                ['通信', 2691],
                ['网络', 4300],
                ['能源', 3416],
                ['建筑', 4666],
              ],
              size: 32,
              yAxis: Math.random() > 0.5,
              theme,
            })}
            renderer={theme === 'rect' ? 'svg' : 'canvas'}
          />
        );
      case 'gardientline':
        return (
          <Echarts
            option={lib.gardientLine({
              data: {
                x: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                y: [
                  {
                    name: 'name1',
                    value: [320, 232, 101, 334, 244, 235, 332],
                  },
                  {
                    name: 'name2',
                    value: [148, 232, 254, 231, 176, 121, 232],
                  },
                  {
                    name: 'name3',
                    value: [148, 132, 154, 131, 176, 121, 132],
                  },
                ],
              },
              yAxis: false,
              smooth: false,
            })}
            renderer="svg"
          />
        );
      case 'waffle':
        return (
          <G2
            option={{
              data: [
                ['type 1', 32],
                ['type 2', 65],
                ['type 3', 30],
                ['type 4', 42],
              ],
              ...lib.waffle,
              height: 160,
            }}
            renderer="svg"
          />
        );
      case 'g2radialbar':
        return (
          <G2
            option={{
              data: [
                ['Zombieland', 9],
                ['Wieners', 8],
                ['Toy Story', 8],
                ['trashkannon', 7],
                ['the GROWLERS', 6],
                ['mudweiser', 6],
                ['ThunderCats', 4],
                ['The Taqwacores - Motion Picture', 4],
                ['The Shawshank Redemption', 2],
                ['The Olivia Experiment', 1],
              ],
              innerPercent: 20,
              color: Math.random() > 0.3 ? '0' : Math.random() > 0.3 ? '1' : '#8543e0',
              header: ['指标', '值'],
              title: '这是一组标题',
              padding: 5,
              onMount: lib.g2RadialBarChart,
            }}
            renderer="svg"
          />
        );
      case 'wind':
        var direction: 'horizontal' | 'vertical' = Math.random() > 0.5 ? 'horizontal' : 'vertical';
        return (
          <G2
            option={{
              data: [
                ['2016 年', '乌拉圭', 1.3],
                ['2017 年', '乌拉圭', 1.8],
                ['2016 年', '巴拉圭', 3.6],
                ['2017 年', '巴拉圭', 5.5],
                ['2016 年', '南非', 3.7],
                ['2017 年', '南非', 12.1],
                ['2016 年', '巴基斯坦', 2.9],
                ['2017 年', '巴基斯坦', 22],
                ['2016 年', '阿根廷', 23.8],
                ['2017 年', '阿根廷', 38.6],
                ['2016 年', '加拿大', 11.6],
                ['2017 年', '加拿大', 46.9],
                ['2016 年', '巴西', 49.1],
                ['2017 年', '巴西', 73.2],
                ['2016 年', '中国', 2.8],
                ['2017 年', '中国', 108.4],
                ['2016 年', '美国', 72.9],
                ['2017 年', '美国', 165.2],
                ['2016 年', '印度', 49.1],
                ['2017 年', '印度', 175.4],
              ],
              header: ['类型', '国家', '数值'],
              showLegend: true,
              direction,
              legend: 0,
              x: 1,
              y: 2,
              padding: direction === 'horizontal' ? [20, 0, 10, 30] : [20, 0, 10, 0],
              onMount: lib.g2Wind,
            }}
            renderer="svg"
          />
        );
      case 'facet3':
        let seed = Math.random();
        let type: 'line' | 'bar' | 'column' | 'point' =
          seed > 0.75 ? 'point' : seed > 0.5 ? 'line' : seed > 0.25 ? 'column' : 'bar';
        let padding = {
          line: [20, 20, 30, 0],
          bar: [20, 20, 30, 0],
          point: [20, 20, 30, 0],
          column: [20, 0, 0, 10],
        };
        return (
          <G2
            option={{
              data: [
                ['转基因作物种植面积', '印度', 10.8],
                ['转基因作物种植面积', '美国', 72.9],
                ['转基因作物种植面积', '中国', 2.8],
                ['转基因作物种植面积', '巴西', 49.1],
                ['转基因作物种植面积', '加拿大', 11.6],
                ['转基因作物种植面积', '阿根廷', 23.8],
                ['转基因作物种植面积', '巴基斯坦', 2.9],
                ['转基因作物种植面积', '南非', 2.7],
                ['转基因作物种植面积', '巴拉圭', 3.6],
                ['转基因作物种植面积', '乌拉圭', 1.3],
                ['耕地总面积', '印度', 175.4],
                ['耕地总面积', '美国', 165.2],
                ['耕地总面积', '中国', 108.4],
                ['耕地总面积', '巴西', 73.2],
                ['耕地总面积', '加拿大', 46.9],
                ['耕地总面积', '阿根廷', 38.6],
                ['耕地总面积', '巴基斯坦', 22],
                ['耕地总面积', '南非', 12.1],
                ['耕地总面积', '巴拉圭', 5.5],
                ['耕地总面积', '乌拉圭', 1.8],
                ['转基因作物种植占比（%）', '印度', 6.2],
                ['转基因作物种植占比（%）', '美国', 44.1],
                ['转基因作物种植占比（%）', '中国', 2.6],
                ['转基因作物种植占比（%）', '巴西', 67],
                ['转基因作物种植占比（%）', '加拿大', 24.7],
                ['转基因作物种植占比（%）', '阿根廷', 61.6],
                ['转基因作物种植占比（%）', '巴基斯坦', 13.2],
                ['转基因作物种植占比（%）', '南非', 22.4],
                ['转基因作物种植占比（%）', '巴拉圭', 65.7],
                ['转基因作物种植占比（%）', '乌拉圭', 73],
              ],
              header: ['类型', '国家', '数值'],
              showLegend: false,
              legend: 0,
              x: 1,
              y: 2,
              padding: padding[type],
              onMount: lib.g2Facet3,
              type,
            }}
            renderer="svg"
          />
        );
      case 'facet2':
        seed = Math.random();
        type = seed > 0.75 ? 'point' : seed > 0.5 ? 'line' : seed > 0.25 ? 'column' : 'bar';
        padding = {
          line: [10, 20, 20, 0],
          point: [20, 20, 20, 0],
          bar: [10, 20, 20, 0],
          column: [20, 90, 40, 80],
        };
        return (
          <G2
            option={{
              data: [
                ['办公用品', '收纳', 340],
                ['办公用品', '笔', 20760],
                ['办公用品', '纸张', 28750],
                ['技术', '配件', 4090],
                ['技术', '电话', 9880],
                ['技术', '复印机', 40988],
                ['家具', '桌子', 14870],
                ['家具', '椅子', 37098],
                ['家具', '书架', 49099],
              ],
              header: ['类型', '国家', '数值'],
              showLegend: true,
              legend: 0,
              x: 1,
              y: 2,
              padding: padding[type],
              onMount: lib.g2Facet2,
              type,
            }}
            renderer="svg"
          />
        );
      case 'g2rose':
        return (
          <G2
            option={{
              data: [
                ['2001', 41.8],
                ['2002', 38],
                ['2003', 33.7],
                ['2004', 30.7],
                ['2005', 25.8],
                ['2006', 31.7],
                ['2007', 33],
                ['2008', 46],
                ['2009', 38.3],
              ],
              header: ['年份', '指标'],
              innerPercent: Math.random() > 0.5 ? 15 : 0,
              color:
                Math.random() > 0.3
                  ? '#40a9ff-#0050b3'
                  : Math.random() > 0.3
                  ? '#1890FF'
                  : 'rainbow',
              startAngle: Math.random() > 0.5 ? 180 : 0,
              endAngle: 360,
              legend: true,
              padding: [0, 0, 40, 0],
              onMount: lib.g2Rose,
            }}
            renderer="canvas"
          />
        );
      case 'g2pielist':
        return (
          <G2
            option={{
              data: [
                ['2A', 92.4],
                ['3A', 88.6],
                ['6T', 77.6],
                ['7T', 78.6],
              ],
              header: ['品种', '好品率'],
              innerPercent: 75,
              padding: [0, 0, 0, 0],
              onMount: lib.g2PieList,
            }}
            renderer="svg"
          />
        );
      case 'g2pieother':
        return (
          <G2
            option={{
              data: [
                ['微博', 13.33],
                ['微博1', 5.33],
                ['微博2', 3.33],
                ['微博3', 12.33],
                ['微博4', 13.33],
                ['微博5', 14.33],
                ['微博6', 15.33],
                ['论坛', 1.77],
                ['网站', 1.44],
                ['微信', 1.12],
                ['客户端', 1.05],
                ['新闻', 0.81],
                ['视频', 0.39],
                ['博客', 0.37],
                ['报刊', 0.17],
              ],
              header: ['类型', '数值'],
              innerPercent: 10,
              pieItem: 7,
              otherChart: 'bar',
              padding: [0, 30, 0, 0],
              ...lib.g2PieOther,
            }}
            renderer="svg"
          />
        );
      case 'g2piespider':
        return (
          <G2
            option={{
              data: [
                ['居住', 7140],
                ['食品烟酒', 3875],
                ['交通通信', 2267],
                ['教育、文化、娱乐', 1853],
                ['医疗保健', 1685],
                ['衣着', 1179],
                ['生活用品及服务', 1088],
                ['其他用品及服务', 583],
              ],
              header: ['类型', '数值'],
              innerPercent: 50,
              color: null,
              padding: [20, 0, 0, 0],
              onMount: lib.g2PieSpider,
            }}
            // renderer="svg"
          />
        );
      case 'bar':
        let stack = Math.random() > 0.5;
        let group = !stack;
        let option = g2PlotLib.line({
          header: ['类型', '日期', '数值'],
          data: [
            ['download', '2018/8/1', 4623],
            ['register', '2018/8/1', 2208],
            ['bill', '2018/8/1', 182],
            ['download', '2018/8/2', 6145],
            ['register', '2018/8/2', 2016],
            ['bill', '2018/8/2', 257],
            ['download', '2018/8/3', 508],
            ['register', '2018/8/3', 2916],
            ['bill', '2018/8/3', 289],
            ['download', '2018/8/4', 6268],
            ['register', '2018/8/4', 4512],
            ['bill', '2018/8/4', 428],
            ['download', '2018/8/5', 6411],
            ['register', '2018/8/5', 8281],
            ['bill', '2018/8/5', 619],
          ],
          showLegend: true,
          type: 'bar',
          stack,
          group,
        });
        return <AChart option={option} />;
      case 'line':
        option = g2PlotLib.line({
          header: ['类型', '日期', '数值'],
          data: [
            ['download', '2018/8/1', 4623],
            ['register', '2018/8/1', 2208],
            ['bill', '2018/8/1', 182],
            ['download', '2018/8/2', 6145],
            ['register', '2018/8/2', 2016],
            ['bill', '2018/8/2', 257],
            ['download', '2018/8/3', 508],
            ['register', '2018/8/3', 2916],
            ['bill', '2018/8/3', 289],
            ['download', '2018/8/4', 6268],
            ['register', '2018/8/4', 4512],
            ['bill', '2018/8/4', 428],
            ['download', '2018/8/5', 6411],
            ['register', '2018/8/5', 8281],
            ['bill', '2018/8/5', 619],
          ],
          legend: 0,
          x: 1,
          y: 2,
          type: 'line',
          // step: 'hv',
          percent: true,
          area: true,
          // stack: true,
          // group: true,
          showLegend: false,
          point: false,
          smooth: false,
          thumbnail: false,
        });

        return <AChart option={option} />;

      case 'radar':
        option = g2PlotLib.radar({
          header: ['角色', '维度', '数值'],
          data: [
            ['孙尚香', '防御', 5],
            ['黄忠', '防御', 49],
            ['孙尚香', '攻击', 6],
            ['黄忠', '攻击', 44],
            ['孙尚香', '速度', 61],
            ['黄忠', '速度', 33],
            ['孙尚香', '穿透', 55],
            ['黄忠', '穿透', 75],
            ['孙尚香', '护甲', 68],
            ['黄忠', '护甲', 4],
            ['孙尚香', '暴击', 45],
            ['黄忠', '暴击', 75],
          ],
          legend: 0,
          x: 1,
          y: 2,
          showLegend: false,
        });

        return <AChart option={option} />;
      case 'waterfall':
        // g2 plot 的waterfall存在 Y轴样式的问题，暂时用g2实现
        // option = g2PlotLib.waterfall({
        //   header: ['类别', '数值'],
        //   data: [
        //     ['日用品', 120],
        //     ['伙食费', 900],
        //     ['交通费', 200],
        //     ['水电费', 300],
        //     ['房租', 1200],
        //     ['商场消费', 1000],
        //     ['应酬红包', -200],
        //   ],
        // });

        // return <AChart option={option} />;

        option = {
          header: ['类别', '数值'],
          data: [
            ['日用品', 120],
            ['伙食费', 900],
            ['交通费', 200],
            ['水电费', 300],
            ['房租', 1200],
            ['商场消费', 1000],
            ['应酬红包', -200],
          ],
          padding: [20, 0, 30, 40],
          ...lib.waterfall,
        };

        return <G2 option={option} renderer="svg" />;

      case 'rangeline':
        return (
          <G2
            option={{
              header: ['类型', '最小值', '最大值', '均值'],
              data: [
                ['分类一', 76, 100, 85],
                ['分类二', 56, 108, 77],
                ['分类三', 38, 129, 103],
                ['分类四', 58, 155, 98],
                ['分类五', 45, 120, 83],
                ['分类六', 23, 99, 62],
                ['分类七', 18, 56, 44],
                ['分类八', 18, 34, 23],
              ],
              padding: [20, 10, 30, 40],
              rangeChart: Math.random() > 0.5 ? 'bar' : 'area',
              ...lib.rangeLine,
            }}
          />
        );

      default:
        return <G2Plot config={config} onMockChange={result => onMockChange(result, idx)} />;
    }
  };

  return (
    <BorderItem name={initState.border} {...props}>
      <CloseOutlined className="remove" onClick={() => onRemoveItem(idx)} />
      <Detail />
    </BorderItem>
  );
};
