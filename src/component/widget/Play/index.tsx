import React from 'react';
import { RightOutlined, LeftOutlined, CaretRightOutlined, PauseOutlined } from '@ant-design/icons';
import styles from './index.less';
import classnames from 'classnames';

interface IPlayProps {
  setPlay: React.Dispatch<React.SetStateAction<boolean>>;
  play?: boolean;
  className?: string;
  gotoNext?: () => void;
  gotoPrev?: () => void;
  style?: React.CSSProperties;
}
export default ({
  className,
  play = true,
  setPlay,
  gotoNext,
  gotoPrev,
  style = { width: 100 },
}: IPlayProps) => {
  return (
    <div className={classnames(styles.play, className)} style={style}>
      <LeftOutlined onClick={gotoPrev} className={styles.playItem} />
      {play ? (
        <PauseOutlined
          onClick={() => {
            setPlay(false);
          }}
          className={styles.playItem}
          title="点击停止"
        />
      ) : (
        <CaretRightOutlined
          onClick={() => {
            setPlay(true);
          }}
          className={styles.playItem}
          title="点击开始"
        />
      )}
      <RightOutlined onClick={gotoNext} className={styles.playItem} />
    </div>
  );
};
