import { ConfigPanel } from './config-panel';
import { Toolbar } from './toolbar';
import { AutoPlot } from './auto-plot';
import { DummyPlot } from './dummy-plot';
import { isEqual, pick } from '@antv/util';
import { Options as AdvisorOptions, Advice } from './advisor';
import { Preferences } from '@antv/rules';
import { EmptyContent } from './empty-content';
import { MockPanel } from './mock-panel';

const CACHES: Map<HTMLElement, AutoChart> = new Map();

/**
 * 清理已经销毁的container绑定的AutoChart实例
 */
function CheckAndClean() {
  for (const [container, chart] of CACHES.entries()) {
    if (!document.contains(container)) {
      chart.destroy();
      CACHES.delete(container);
    }
  }
  window.requestAnimationFrame(CheckAndClean);
}

window.requestAnimationFrame(CheckAndClean);

export interface NoDataRenderer {
  render(container: HTMLElement): void;
  destroy(container: HTMLElement): void;
}

export interface AutoChartOptions extends AdvisorOptions {
  /**
   * 使用的数据字段
   */
  fields?: string[];
  /** 偏好选项 */
  preferences?: Preferences;
  /** 是否显示图表切换界面 */
  toolbar?: boolean;
  /** 开发模式 */
  development?: boolean;
  /**
   * 主题
   */
  theme?: string;
  /**
   * g2plot配置
   */
  config?: {
    type: string;
    configs: any;
  };
  /**
   * 无数据的渲染逻辑
   */
  noDataContent?: NoDataRenderer;

  /**
   * 无数据场景,Mock完成之后触发
   */
  onMockChange?: (result: { config?: any; data?: any[] }) => void;
}

export { AdvisorOptions };

export class AutoChart {
  static async create(
    container: HTMLElement,
    data: any[] | Promise<any[]>,
    options?: AutoChartOptions,
  ): Promise<AutoChart> {
    let dataP: any[];
    if (Array.isArray(data)) {
      dataP = data;
    } else if (data instanceof Promise) {
      dataP = await data;
    } else {
      throw new TypeError('data type is error');
    }
    if (!dataP || !Array.isArray(dataP)) {
      throw new TypeError('data type is error');
    }
    let inst: AutoChart;
    if (CACHES.get(container)) {
      inst = CACHES.get(container) as AutoChart;
      // 如果配置和数据一样 不渲染直接返回
      if (isEqual(inst.options, options) && isEqual(inst.data, data)) return inst;
    } else {
      inst = new AutoChart(container);
      CACHES.set(container, inst);
    }
    return await inst.setup(dataP, options);
  }

  private container!: HTMLElement;
  private rendered = false;
  public plot?: AutoPlot | DummyPlot;

  constructor(container: HTMLElement) {
    this.container = container;
    this.plot = null;
  }

  private development!: boolean;
  private data!: any[];
  private options: AutoChartOptions = {};
  private toolbar?: Toolbar;
  private configPanel?: ConfigPanel;

  private noDataContent?: NoDataRenderer;
  private mockPanel?: MockPanel;
  private isMocked = false;

  async setup(data: any[], options?: AutoChartOptions) {
    if (this.rendered) this.destroy();
    this.rendered = true;
    this.isMocked = false;
    this.options = options || {};
    const { fields, development, noDataContent } = this.options;
    this.noDataContent = noDataContent || new EmptyContent(this.container);
    this.data = fields && fields.length > 0 ? data.map(item => pick(item, fields)) : data;
    this.development =
      (development === undefined && process.env.NODE_ENV === 'development') ||
      (development !== undefined && development === true);
    await this.render();
    return this;
  }

  async render() {
    const { options, container, development, noDataContent } = this;
    const { title, theme, toolbar, description, purpose, preferences } = options;
    let { config, onMockChange } = options;
    if (this.data && this.data.length === 0) {
      if (development) {
        // 如果是在开发模式下 等待用户mock的数据和配置
        const mockPanel = new MockPanel(container);
        this.mockPanel = mockPanel;
        this.isMocked = true;
        const result = await mockPanel.ps;
        this.data = result.data;
        config = result.config;
        onMockChange && onMockChange(result);
        this.mockPanel.destroy();
      } else {
        noDataContent!.render(container);
        return;
      }
    }
    if (config) {
      if (typeof config.type !== 'string') throw new Error('please set the plotType');
      this.plot = new DummyPlot(container, this.data, config);
    } else {
      // 获取上次渲染的advise 和 index
      let oldAdvices: Advice[] = [];
      let oldIndex = 0;
      if (this.plot instanceof AutoPlot) {
        oldAdvices = this.plot.advices;
        oldIndex = this.plot.current;
      }
      this.plot = new AutoPlot(
        container,
        this.data,
        { title, theme, description, purpose, preferences },
        oldAdvices,
        oldIndex,
      );

      if (toolbar) {
        this.toolbar = new Toolbar(this.plot);
      }
    }

    if (development) {
      this.configPanel = new ConfigPanel(this.plot, this.isMocked);
    }
  }

  /**
   * 清除上次渲染遗留的元素
   */
  destroy() {
    if (this.noDataContent) this.noDataContent.destroy(this.container);
    if (this.configPanel) this.configPanel.destroy();
    if (this.toolbar) this.toolbar.destroy();
    if (this.plot) this.plot.destroy();
    if (this.mockPanel) this.mockPanel.destroy();
  }
}
