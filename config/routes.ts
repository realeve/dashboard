// routes: [
//   {
//     path: '/',
//     component: '../layouts/index',
//     routes: [
//       { path: '/', component: '../pages/index', title: '数据大屏' },
//       { path: '/config', component: '../pages/config', title: '页面配置' },
//       { path: '/list', component: '../pages/list', title: '大屏列表' },
//     ],
//   },
// ],

// 为兼容mpa，只使用一级路由
export const routes = [
  { path: '/', component: '../pages/index', title: '数据大屏' },
  { path: '/config', component: '../pages/config', title: '页面配置' },
  { path: '/list', component: '../pages/list', title: '大屏列表' },
];
