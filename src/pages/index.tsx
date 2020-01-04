import React, { useState } from 'react';
import styles from './index.less';
import Draggable from 'react-draggable';
import { Card } from 'antd';
import { ResizableBox } from 'react-resizable';
import 'react-resizable/css/styles.css';
import { useDebounce } from 'react-use';

export default function() {
  const [size, setSize] = useState({ width: 200, height: 200 });
  const onResize = (event, { element, size, handle }) => {
    setSize({ width: size.width, height: size.height });
  };
  const [chartSize, setChartSize] = React.useState({ width: 200, height: 200 });

  const [, cancel] = useDebounce(
    () => {
      setChartSize(size);
    },
    500,
    [size],
  );

  return (
    <div className={styles.chartContainer}>
      <Draggable handle="strong" style={size}>
        <ResizableBox
          {...size}
          onResize={onResize}
          draggableOpts={{ grid: [25, 25] }}
          maxConstraints={[1200, 600]}
          minConstraints={[200, 200]}
          handleSize={[20, 20]}
          lockAspectRatio={false}
          resizeHandles={['se', 'e', 's']}
          // handle={h => <span className={`react-resizable-handle react-resizable-handle-${h}`} />}
        >
          <Card title="图表面板" style={{ ...chartSize }} bordered={false}>
            I can only be moved within my offsetParent.
            <strong className="cursor">
              <div>Drag here</div>
            </strong>
          </Card>
        </ResizableBox>
      </Draggable>
    </div>
  );
}
