import { AutoChart, AutoChartOptions, AdvisorOptions } from './auto-chart';

/*
 * 自动图表
 * @param container - 容器
 * @param data - 数据
 * @param options - 配置
 */
export async  function autoChart(container: HTMLElement, data: any[] | Promise<any[]>, options?: AutoChartOptions) {
  let {plot} = await AutoChart.create(container, data, options); 
  return plot.plot;
}

export { AutoChartOptions, AdvisorOptions };
