import React, { useState, useEffect } from 'react';
import Layer from './index';
export default (props) => {
  const [dnd, setDnd] = useState(null);
  const [context, setContext] = useState(null);
  useEffect(() => {
    import('react-beautiful-dnd').then(setDnd);
    import('react-contextmenu').then(setContext);
  }, []);
  if (!dnd || !context) {
    return null;
  }
  return (
    <Layer
      {...props}
      DragDropContext={dnd.DragDropContext}
      Droppable={dnd.Droppable}
      Draggable={dnd.Draggable}
      ContextMenu={context.ContextMenu}
      MenuItem={context.MenuItem}
      ContextMenuTrigger={context.ContextMenuTrigger}
    />
  );
};
