import React, { useEffect, useState } from 'react';

import { IApiConfig, IChartConfig } from '@/component/chartItem/interface';
// import * as THREE from 'three';
import useMeasure from './useMeasure';
export let mock = {};

export const config: IChartConfig[] = [
  {
    key: 'speed',
    defaultValue: 5,
    title: '摆动速度',
    step: 1,
    type: 'range',
    min: 1,
    max: 20,
  },
  {
    key: 'blue_offset',
    defaultValue: 210,
    title: '颜色偏移',
    step: 1,
    type: 'range',
    min: 1,
    max: 255,
  },
  {
    key: 'AMOUNT',
    defaultValue: 100,
    title: 'X轴数量',
    step: 2,
    type: 'range',
    min: 20,
    max: 200,
  },
  {
    key: 'AMOUNT_Y',
    defaultValue: 20,
    title: 'Y轴数量',
    step: 2,
    type: 'range',
    min: 10,
    max: 200,
  },
  {
    key: 'SEPARATION',
    defaultValue: 200,
    title: '间隔',
    step: 5,
    type: 'range',
    min: 10,
    max: 500,
  },
  {
    key: 'MAXSIZE',
    defaultValue: 20,
    title: '尺寸',
    step: 2,
    type: 'range',
    min: 10,
    max: 50,
  },
  {
    key: 'WAVESIZE',
    defaultValue: 100,
    title: '摆动幅度',
    step: 2,
    type: 'range',
    min: 10,
    max: 200,
  },
  {
    key: 'MOUSE_TRACK',
    defaultValue: true,
    title: '鼠标跟随',
    type: 'switch',
  },
];

export const apiConfig: IApiConfig = {
  show: false,
  type: 'url',
  url: 'http://localhost:8000/mock/28_wave_effect.json',
  interval: 5,
  cache: 2,
  config: [],
};

const getColor = ({ ratio, blue_offset, THREE }) => {
  let color = {
    r: 0,
    g: Math.floor(255 - ratio * 255),
    b: Math.floor(blue_offset + blue_offset * ratio),
  };

  return new THREE.Color(
    // color.r / 255,
    Math.random() * 0.4,
    color.g / 255,
    color.b / 255,
  );
};

export default ({
  option: {
    speed = 5,
    blue_offset = 210,
    AMOUNT = 100,
    AMOUNT_Y = 20,
    SEPARATION = 200,
    MAXSIZE = 20,
    WAVESIZE = 100,
    MOUSE_TRACK = true,
  },
}) => {
  const [domRef, { width, height }] = useMeasure();

  const [THREE, setTHREE] = useState(null);
  const [init, setInit] = useState(false);
  useEffect(() => {
    import('three').then((res) => {
      setTHREE(res);
      setInit(true);
    });
  }, []);

  const wave = () => {
    const SPEED_OFFSET = speed / 100;

    let container: HTMLElement = domRef.current;

    if (!container || width * height == 0) {
      return;
    }

    let camera = null;
    camera = new THREE.PerspectiveCamera(35, width / 2 / (height / 2), 1, 10000);
    camera.position.y = 1000;
    camera.position.z = 2000;

    let renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(width, height);
    renderer.setClearAlpha(0);

    container.appendChild(renderer.domElement);
    let scene = new THREE.Scene();

    let particles = [];
    let count = 0;

    function setup() {
      const map = new THREE.TextureLoader().load(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAb1BMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8v0wLRAAAAJHRSTlMAC/goGvDhmwcExrVjWzrm29TRqqSKenRXVklANSIUE8mRkGpv+HOfAAABCElEQVQ4y4VT13LDMAwLrUHteO+R9f/fWMfO6dLaPeKVEECRxOULWsEGpS9nULDwia2Y+ALqUNbAWeg775zv+sA4/FFRMxt8U2FZFCVWjR/YrH4/H9sarclSKdPMWKzb8VsEeHB3m0shkhVCyNzeXeAQ9Xl4opEieX2QCGnwGbj6GMyjw9t1K0fK9YZunPXeAGsfJtYjwzxaBnozGGorYz0ypK2HzQSYx1y8DgSRo2ewOiyh2QWOEk1Y9OrQV0a8TiBM1a8eMHWYnRMy7CZ4t1CmyRkhSUvP3gRXyHOCLBxNoC3IJv//ZrJ/kxxUHPUB+6jJZZHrpg6GOjnqaOmzp4NDR48OLxn/H27SRQ08S0ZJAAAAAElFTkSuQmCC',
      );
      for (let x = 0; x < AMOUNT; x++) {
        particles.push([]);
        var ratio = x / AMOUNT; //+ Math.random() / 10;
        for (let y = 0; y < AMOUNT_Y; y++) {
          let material = new THREE.SpriteMaterial({
            map,
            opacity: 1,
            color: getColor({ ratio, blue_offset, THREE }),
          });

          let particle = new THREE.Sprite(material);
          particle.position.x = x * SEPARATION - (AMOUNT * SEPARATION) / 2;
          particle.position.z = y * SEPARATION - (AMOUNT_Y * SEPARATION) / 2;
          particles[x].push(particle);
          scene.add(particle);
        }
      }
    }

    let offset_camera = 0;
    document.addEventListener(
      'mousemove',
      (t) => {
        offset_camera = t.clientX - width / 2;
      },
      false,
    );

    let ANIMATE_ID = null;
    function render() {
      MOUSE_TRACK && (scene.position.x += 0.005 * (offset_camera - scene.position.x));
      // scene.position.y = 364;
      // scene.matrixWorldNeedsUpdate = true;

      camera.lookAt(scene.position);

      for (let x = 0; x < AMOUNT; x++) {
        for (let y = 0; y < AMOUNT_Y; y++) {
          let particle = particles[x][y];
          particle.position.y =
            Math.sin((x + count) * 0.3) * WAVESIZE + Math.sin((y + count) * 0.5) * WAVESIZE;
          let scale =
            (Math.sin((x + count) * 0.3) + 1) * MAXSIZE +
            (Math.sin((y + count) * 0.5) + 1) * MAXSIZE;
          particle.scale.x = particle.scale.y = scale;
        }
      }
      renderer.render(scene, camera);
      count += SPEED_OFFSET;
      ANIMATE_ID = requestAnimationFrame(render);
    }

    const stopAnimate = () => {
      window.cancelAnimationFrame(ANIMATE_ID);
    };

    return {
      render: () => {
        setup();
        ANIMATE_ID = requestAnimationFrame(render);
      },
      stopAnimate,
      onresize: function () {
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      },
      reset: () => {
        container.childNodes[0] && container.removeChild(container.childNodes[0]);
      },
    };
  };

  let [canvas, setCanvas] = useState(null);

  const refresh = () => {
    let _canvas = wave();
    _canvas?.render();
    setCanvas(_canvas);
  };

  useEffect(() => {
    if (!THREE) return;
    canvas?.stopAnimate();
    canvas?.reset();
    refresh();
  }, [
    speed,
    blue_offset,
    width,
    height,
    AMOUNT,
    AMOUNT_Y,
    SEPARATION,
    MAXSIZE,
    WAVESIZE,
    MOUSE_TRACK,
    init,
  ]);

  // useEffect(() => {
  //   if (width * height == 0) {
  //     return;
  //   }
  //   canvas?.onresize();
  // }, [width, height]);

  return <div ref={domRef} style={{ width: '100%', height: '100%' }} />;
};
