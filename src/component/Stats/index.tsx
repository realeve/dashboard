import React, { useEffect, useState, useRef } from 'react';
import Stats from './stats';

export default function PerformanceStat({ style }) {
  const [inited, setInited] = useState(false);
  const [mode, setMode] = useState(0);
  const ref = useRef(null);
  const [stats, setStates] = useState(null);

  useEffect(() => {
    if (inited) {
      return;
    }
    let stats = new Stats(ref.current);
    setStates(stats);
    stats?.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
    let requestId = window.requestAnimationFrame(function loop() {
      stats?.update();
      requestAnimationFrame(loop);
    });
    setInited(true);

    return () => {
      window.cancelAnimationFrame(requestId);
    };
  }, []);

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
        transform: `scale(0.8)`,
        ...style,
      }}
      onClick={() => {
        setMode((mode + 1) % 3);
      }}
    />
  );
}
