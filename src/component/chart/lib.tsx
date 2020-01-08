import * as g2plot from '@antv/g2plot';

export const showDefaultOption = chartType => {
  console.log(
    chartType + '默认配置项:',
    g2plot[chartType] && g2plot[chartType].getDefaultOptions(),
  );
};
