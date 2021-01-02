import { hierarchy, treemap, treemapResquarify } from 'd3-hierarchy';
import { assign, isArray } from '@antv/util';
import { getField } from './option-parser';

const { Node } = hierarchy;
export { Node };
interface HierarchyApi {
  root?: any;
  rows?: any;
  children?: any;
  dataType: string;
  getAllNodes?: () => any[];
}

interface View extends HierarchyApi {}

const HIERARCHY = 'hierarchy';
const DEFAULT_OPTIONS: Options = {
  field: 'value',
  tile: 'treemapSquarify', // treemapBinary, treemapDice, treemapSlice, treemapSliceDice, treemapSquarify, treemapResquarify
  size: [1, 1], // width, height
  round: false,
  // ratio: 1.618033988749895, // golden ratio
  padding: 0,
  paddingInner: 0,
  paddingOuter: 0,
  paddingTop: 0,
  paddingRight: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  as: ['x', 'y'],
};

export interface Options {
  /**
   * 字段名 默认为 value
   */
  field?: string;
  tile?:
    | 'treemapBinary'
    | 'treemapDice'
    | 'treemapSlice'
    | 'treemapSliceDice'
    | 'treemapSquarify'
    | 'treemapResquarify';
  size?: [number, number];
  round?: boolean;
  ratio?: number;
  padding?: number;
  paddingInner?: number;
  paddingOuter?: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  as: [string, string];
}

function getAllNodes() {
  const nodes: any[] = [];
  // eslint-disable-next-line @typescript-eslint/no-invalid-this
  const root = this;
  if (root && root.each) {
    // d3-hierarchy
    root.each((node: any) => {
      nodes.push(node);
    });
  } else if (root && root.eachNode) {
    // @antv/hierarchy
    root.eachNode((node: any) => {
      nodes.push(node);
    });
  }
  return nodes;
}

export function transform(dataView: View, options: Options): typeof Node {
  if (dataView.dataType !== HIERARCHY) {
    throw new TypeError('Invalid DataView: This transform is for Hierarchy data only!');
  }
  dataView.root = hierarchy({
    name: 'root',
    children: dataView.children,
  });
  dataView.rows = dataView.root;
  const { root } = dataView;
  options = assign({} as Options, DEFAULT_OPTIONS, options);

  const { as } = options;
  if (!isArray(as) || as.length !== 2) {
    throw new TypeError('Invalid as: it must be an array with 2 strings (e.g. [ "x", "y" ])!');
  }

  let field;
  try {
    field = getField(options);
  } catch (e) {
    console.warn(e);
  }
  if (field) {
    root.sum((d) => d[field]);
  }

  const treemapLayout = treemap();
  treemapLayout
    .tile(treemapResquarify)
    .size(options.size)
    .round(options.round)
    .padding(options.padding)
    .paddingInner(options.paddingInner)
    .paddingOuter(options.paddingOuter)
    .paddingTop(options.paddingTop)
    .paddingRight(options.paddingRight)
    .paddingBottom(options.paddingBottom)
    .paddingLeft(options.paddingLeft);
  treemapLayout(root);

  /*
   * points:
   *   3  2
   *   0  1
   */
  const x = as[0];
  const y = as[1];
  root.each((node) => {
    node[x] = [node.x0, node.x1, node.x1, node.x0];
    node[y] = [node.y1, node.y1, node.y0, node.y0];
    ['x0', 'x1', 'y0', 'y1'].forEach((prop) => {
      if (as.indexOf(prop) === -1) {
        delete node[prop];
      }
    });
  });
  root.getAllNodes = getAllNodes;
  return root;
}
