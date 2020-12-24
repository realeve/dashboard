// umi官方推荐做法，不生效，移除对该文件的引用；
import { dynamic } from 'umi';
export default dynamic({
  loader: async function () {
    // 这里的注释 webpackChunkName 可以指导 webpack 将该组件 HugeA 以这个名字单独拆出去
    const { default: Layer } = await import(/* webpackChunkName: "panel_Layer" */ './index');
    return Layer;
  },
});

// 以下方式写法累赘，但能将其中的配置项单独提取出来；
// import React, { useState, useEffect } from 'react';
// import Layer from './index';
// export default Layer;

// export default (props) => {
//   const [dnd, setDnd] = useState(null);
//   const [context, setContext] = useState(null);
//   useEffect(() => {
//     import('react-beautiful-dnd').then(setDnd);
//     import('react-contextmenu').then(setContext);
//   }, []);
//   if (!dnd || !context) {
//     return null;
//   }
//   return (
//     <Layer
//       {...props}
//       DragDropContext={dnd.DragDropContext}
//       Droppable={dnd.Droppable}
//       Draggable={dnd.Draggable}
//       ContextMenu={context.ContextMenu}
//       MenuItem={context.MenuItem}
//       ContextMenuTrigger={context.ContextMenuTrigger}
//     />
//   );
// };
