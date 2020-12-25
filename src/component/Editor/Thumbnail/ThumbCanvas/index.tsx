import zrender from 'zrender';
import { useRef, useEffect, useState, useMemo } from 'react';
import styles from './index.less';
import { getStyle } from '@/pages/index/lib';
import { GROUP_COMPONENT_KEY, SCREEN_EDGE_KEY } from '@/models/common';
import * as R from 'ramda';
import { connect } from 'react-redux';
import { ICommon } from '@/models/common';
import { IPanelItem, diff } from './lib';

const getRect = (option: IPanelItem, { fill, stroke }) => ({
  rect: new zrender.Rect({
    shape: option,
    style: {
      fill,
      stroke,
    },
    silent: true,
  }),
  id: option.id,
});
let activeStyle = { fill: '#2681ff', stroke: '#2681ff' };

export interface IThumbProps
  extends Pick<ICommon, 'page' | 'history' | 'panel' | 'curHistoryIdx' | 'selectedPanel'> {
  style?: React.CSSProperties;
  /** 渲染引擎 */
  renderer?: 'svg' | 'canvas';
  /** 颜色 */
  fill: string;
  /** 边框颜色 **/
  stroke: string;
  [key: string]: any;
}
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
  let panel = history[curHistoryIdx]?.panel || _panel;
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
    let zr = zrender.init(ref.current, { renderer });
    setInstanse(zr);
  }, []);

  useEffect(() => {
    if (instanse == null) {
      return;
    }
    let nextItem: IPanelItem[] = panel
      .filter((item) => ![SCREEN_EDGE_KEY, GROUP_COMPONENT_KEY].includes(item.key))
      .map((item) => {
        let { width, height, left, top } = getStyle({ style: item.style, page });
        return {
          id: item.id,
          x: left / 10,
          y: top / 10,
          width: width / 10,
          height: height / 10,
        };
      });

    let result = diff(prevItem, nextItem);

    setPrevItem(nextItem);
    updateRect(result);
  }, [instanse == null, nextIds]);

  const getRectEl = (id: string) => {
    let el = R.find(R.propEq('id', id))(rects) as { rect: any; id: string };
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
      let el = getRectEl(id);
      if (!el) return;
      el.animate('style', false).when(50, { fill, stroke })?.start();
    });
    selectedPanel.forEach((id) => {
      let el = getRectEl(id);
      if (!el) return;
      el.animate('style', false).when(50, activeStyle)?.start();
    });
  }, [selectedPanel]);

  const updateRect = (result: { remove: string[]; change: IPanelItem[]; add: IPanelItem[] }) => {
    addRect(result.add);
    removeRect(result.remove);
    changeRect(result.change);
  };

  const changeRect = (rect: IPanelItem[]) => {
    if (rect.length == 0) return;

    rect.forEach(({ id, ...shape }) => {
      let el = getRectEl(id);
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
    if (rectid.length == 0) return;
    rects.forEach((item) => {
      if (rectid.includes(item.id)) {
        instanse.remove(item.rect);
      }
    });
  };

  // 增加矩形面板
  const addRect = (rect: IPanelItem[]) => {
    if (rect.length == 0) return;
    let style = { fill, stroke };
    let nextRects = rect.map((item) => {
      return getRect(item, selectedPanel.includes(item.id) ? activeStyle : style);
    });
    setRects(nextRects);
    nextRects.map(({ rect }) => instanse.add(rect));
  };

  return <div className={styles.thumbnail} style={style} ref={ref} />;
};

export default connect(({ common }: { common: ICommon }) => common)(Index);
