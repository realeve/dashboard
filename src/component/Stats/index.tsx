import React, { useEffect, useState, useRef } from 'react';
import Stats from './stats';
import { useTimeout } from 'react-use';

export default function PerformanceStat({ style }) {
  const [mode, setMode] = useState(0);
  const ref = useRef(null);
  const [stats, setStates] = useState(null);
  const [isReady] = useTimeout(3 * 1000);

  useEffect(() => {
    if (!isReady()) {
      return;
    }
    const stats = new Stats(ref.current);
    setStates(stats);
    stats?.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    const requestId = window.requestAnimationFrame(function loop() {
      stats?.update();
      requestAnimationFrame(loop);
    });

    return () => {
      window.cancelAnimationFrame(requestId);
    };
  }, [isReady()]);

  useEffect(() => {
    stats?.showPanel(mode);
  }, [mode]);

  return (
    <div
      ref={ref}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        cursor: 'pointer',
        opacity: 0.9,
        zIndex: 10000,
        ...style,
      }}
      onClick={() => {
        setMode((mode + 1) % 3);
      }}
    />
  );
}
