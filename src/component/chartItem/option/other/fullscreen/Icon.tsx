import React from 'react';

const ExitFullscreen = ({ fill, style }) => (
  <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" style={style}>
    <path
      d="M661.333333 384h170.666667a21.333333 21.333333 0 0 0 0-42.666667h-119.168l176.917333-176.917333a21.333333 21.333333 0 1 0-30.165333-30.165333L682.666667 311.168V192a21.333333 21.333333 0 0 0-42.666667 0v170.666667a21.333333 21.333333 0 0 0 21.333333 21.333333zM362.666667 640H192a21.333333 21.333333 0 0 0 0 42.666667h119.168l-176.917333 176.917333a21.333333 21.333333 0 1 0 30.165333 30.165333L341.333333 712.832V832a21.333333 21.333333 0 0 0 42.666667 0v-170.666667a21.333333 21.333333 0 0 0-21.333333-21.333333zM712.832 682.666667H832a21.333333 21.333333 0 0 0 0-42.666667h-170.666667a21.333333 21.333333 0 0 0-21.333333 21.333333v170.666667a21.333333 21.333333 0 0 0 42.666667 0v-119.168l176.917333 176.917333a21.333333 21.333333 0 0 0 30.165333-30.165333zM362.666667 170.666667a21.333333 21.333333 0 0 0-21.333334 21.333333v119.168L164.416 134.250667a21.333333 21.333333 0 0 0-30.165333 30.165333L311.168 341.333333H192a21.333333 21.333333 0 0 0 0 42.666667h170.666667a21.333333 21.333333 0 0 0 21.333333-21.333333V192a21.333333 21.333333 0 0 0-21.333333-21.333333z"
      fill={fill}
    />
  </svg>
);

const Fullscreen = ({ fill, style }) => (
  <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" style={style}>
    <path
      d="M680.39168 385.57184l266.34752-265.43104-0.9216 150.41536c-0.36352 12.47744 9.71776 23.48032 22.20032 23.1168h15.95392c12.47232-0.36864 22.93248-7.7056 23.1168-20.36224l0.7424-223.9744c0-0.18432 0.3584-11.92448 0.3584-11.92448 0.18432-6.23616-1.28512-11.92448-5.31968-15.95904s-9.53856-6.6048-15.96416-6.41536l-11.3664 0.18432c-0.18432 0-0.36352 0-0.54272 0.18432l-222.15168-0.9216c-12.47232 0.36864-22.92736 10.64448-23.11168 23.296v15.95904c1.83808 14.85312 13.57312 23.48032 26.04544 23.11168l146.3808 0.36864-265.61024 264.51456a30.99136 30.99136 0 0 0 0 43.83744 30.67904 30.67904 0 0 0 43.84256 0z m-335.68768 250.20416L78.1824 900.29056l0.91648-149.6832c0.36864-12.47744-9.72288-23.48032-22.20032-23.1168H40.02304c-12.47232 0.36352-22.93248 7.7056-23.1168 20.36736l-0.7424 224.1536c0 0.18432-0.3584 11.91936-0.3584 11.91936-0.18432 6.23616 1.28512 11.91936 5.31968 15.95904 4.03456 4.03456 9.53856 6.6048 15.95392 6.42048l11.37664-0.18432c0.18432 0 0.36352 0 0.54272-0.18432l223.06816 0.91648c12.4672-0.3584 22.92736-10.63424 23.10656-23.296v-15.95392c-1.83296-14.85312-13.57824-23.48544-26.05568-23.10656l-146.3808-0.37888 265.43104-264.50432a30.99648 30.99648 0 0 0 0-43.84256c-11.90912-12.29312-31.35488-12.29312-43.46368 0z m663.12704 336.23552l-0.55808-224.1536c-0.36352-12.48256-10.63936-19.99872-23.1168-20.36736h-15.9488c-12.48256-0.36352-22.38464 10.63936-22.20544 23.1168l0.9216 150.41536-266.53184-265.24672c-12.1088-12.1088-31.72864-12.1088-43.84256 0s-12.1088 31.72864 0 43.84256l265.43104 264.50432-146.3808 0.37888c-12.47744-0.37888-24.02816 8.43264-26.05056 23.10656v15.95392c0.36352 12.48256 10.64448 22.93248 23.1168 23.296l222.13632-0.91648c0.18432 0 0.36864 0.18944 0.55296 0.18944l11.37152 0.1792c6.23616 0.18432 11.9296-2.2016 15.96416-6.42048 4.03456-4.03968 5.49376-9.71264 5.31456-15.95904l-0.18944-11.91936h0.01536zM122.94144 77.21984l146.37568-0.36864c12.47232 0.36864 24.02816-8.43776 26.05568-23.11168V37.78048c-0.37888-12.47744-10.6496-22.93248-23.1168-23.30112l-223.24736 0.9216c-0.1792 0-0.36352-0.18432-0.54784-0.18432l-11.37152-0.18432c-6.24128-0.18432-11.92448 2.19648-15.95904 6.41536-4.03456 4.03968-5.504 9.72288-5.31456 15.96416 0 0 0.36864 11.74016 0.36864 11.92448l0.54272 224.15872c0.1792 12.47232 10.63936 19.9936 23.1168 20.35712h16.8704c12.48256 0.36352 22.37952-10.63936 22.19008-23.11168l-0.72192-149.68832 266.34752 264.69888a30.99648 30.99648 0 1 0 43.84256-43.84256L122.94144 77.21984z"
      fill={fill}
    />
  </svg>
);

export interface IFullscreenProp {
  /** 填充颜色 */
  readonly fill?: string;
  /** 全屏状态，用于切换图标 */
  readonly isFullscreen: boolean;
  /** 默认样式 */
  readonly style?: React.CSSProperties;
}

export default ({
  fill = '#e6e6e6',
  isFullscreen = false,
  style = { width: '100%', height: 'auto' },
}: IFullscreenProp) =>
  isFullscreen ? (
    <ExitFullscreen fill={fill} style={style} />
  ) : (
    <Fullscreen fill={fill} style={style} />
  );
