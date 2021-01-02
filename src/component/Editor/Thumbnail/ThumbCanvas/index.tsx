import { useRef, useEffect, useState, useMemo } from 'react';
import styles from './index.less';
import { getStyle } from '@/pages/index/lib';
import { GROUP_COMPONENT_KEY, SCREEN_EDGE_KEY } from '@/models/common';
import * as R from 'ramda';
import { connect } from 'react-redux';
import type { ICommon } from '@/models/common';
import type { IPanelItem } from './lib';
import { diff } from './lib';

import * as zrender from 'zrender/esm/zrender';
import 'zrender/esm/canvas/canvas';
import * as graphic from 'echarts/esm/util/graphic';

const getRect = (option: IPanelItem, { fill, stroke }) => ({
  rect: new graphic.Rect({
    shape: option,
    style: {
      fill,
      stroke,
    },
    silent: true,
  }),
  id: option.id,
});
const activeStyle = { fill: '#2681ff', stroke: '#2681ff' };

export type IThumbProps = {
  style?: React.CSSProperties;
  /** 渲染引擎 */
  renderer?: 'svg' | 'canvas';
  /** 颜色 */
  fill: string;
  /** 边框颜色 * */
  stroke: string;
  [key: string]: any;
} & Pick<ICommon, 'page' | 'history' | 'panel' | 'curHistoryIdx' | 'selectedPanel'>;
const Index = ({
  fill = '#999',
  stroke = '#2681ff',
  page,
  history,
  panel: _panel,
  curHistoryIdx,
  style = {},
  selectedPanel,
  renderer = 'canvas',
}: IThumbProps) => {
  const ref = useRef(null);
  const panel = history[curHistoryIdx]?.panel || _panel;
  const [rects, setRects] = useState<
    {
      rect: any;
      id: string;
    }[]
  >([]);

  const [instanse, setInstanse] = useState(null);

  const nextIds = useMemo(() => {
    return panel.map((item) => item.id);
  }, [panel]);

  const [prevItem, setPrevItem] = useState([]);
  const [prevSelect, setPrevSelect] = useState([]);

  useEffect(() => {
    if (!ref.current) {
      return;
    }
    const zr = zrender.init(ref.current, { renderer });
    setInstanse(zr);
  }, [renderer]);

  const changeRect = (rect: IPanelItem[]) => {
    if (rect.length === 0) return;

    rect.forEach(({ id, ...shape }) => {
      const el = getRectEl(id);
      if (!el) return;
      el.animateTo(
        {
          shape,
          style: selectedPanel.includes(id) ? activeStyle : { fill, stroke },
        },
        50,
      );
    });
  };
  // 移除面板
  const removeRect = (rectid: string[]) => {
    if (rectid.length === 0) return;
    rects.forEach((item) => {
      if (rectid.includes(item.id)) {
        instanse.remove(item.rect);
      }
    });
  };

  // 增加矩形面板
  const addRect = (rect: IPanelItem[]) => {
    if (rect.length === 0) return;
    const rectStyle = { fill, stroke };
    const nextRects = rect.map((item) => {
      return getRect(item, selectedPanel.includes(item.id) ? activeStyle : rectStyle);
    });
    setRects(nextRects);
    nextRects.map(({ rect: rectItem }) => instanse.add(rectItem));
  };

  const updateRect = (result: { remove: string[]; change: IPanelItem[]; add: IPanelItem[] }) => {
    addRect(result.add);
    removeRect(result.remove);
    changeRect(result.change);
  };

  useEffect(() => {
    if (instanse === null) {
      return;
    }
    const nextItem: IPanelItem[] = panel
      .filter((item) => ![SCREEN_EDGE_KEY, GROUP_COMPONENT_KEY].includes(item.key))
      .map((item) => {
        const { width, height, left, top } = getStyle({ style: item.style, page });
        return {
          id: item.id,
          x: left / 10,
          y: top / 10,
          width: width / 10,
          height: height / 10,
        };
      });

    const result = diff(prevItem, nextItem);

    setPrevItem(nextItem);
    updateRect(result);
  }, [instanse, page, panel, prevItem, nextIds]);

  const getRectEl = (id: string) => {
    const el = R.find(R.propEq('id', id))(rects) as { rect: any; id: string };
    if (!el) {
      return false;
    }
    return el.rect;
  };

  useEffect(() => {
    if (R.equals(selectedPanel, prevSelect)) {
      return;
    }
    setPrevSelect(selectedPanel);
    prevSelect.forEach((id) => {
      const el = getRectEl(id);
      if (!el) return;
      el.animate('style', false).when(50, { fill, stroke })?.start();
    });
    selectedPanel.forEach((id) => {
      const el = getRectEl(id);
      if (!el) return;
      el.animate('style', false).when(50, activeStyle)?.start();
    });
  }, [selectedPanel, stroke, fill]);

  return <div className={styles.thumbnail} style={style} ref={ref} />;
};

export default connect(({ common }: { common: ICommon }) => common)(Index);
