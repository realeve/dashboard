import * as React from 'react';
import styles from './index.less';
import MoveableCanvas from '@/component/MoveableCanvas';

export default function App() {
  return (
    <div className={styles.container}>
      <MoveableCanvas style={{ width: 600, height: 300 }}>
        <div
          style={{
            background: `linear-gradient(45deg,#0f0 0%,#f00 100%)`,
            width: 1000,
            height: 800,
          }}
        />
      </MoveableCanvas>
    </div>
  );
}
