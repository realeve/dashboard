import { axios, mock } from '@/utils/axios';
import * as R from 'ramda';
export interface IComponentItem {
  title: string;
  icon: string;
  num?: number;
  list: {
    title: string;
    image: string;
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
    list: [],
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
          },
          {
            title: '轮播图',
            image: '/img/config/img_multi.png',
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
          },
          {
            title: '视频',
            image: '/img/config/video.png',
          },
          {
            title: '萤石云播放器',
            image: '/img/config/video_stone.png',
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
