var echarts = require('echarts/lib/echarts');
var lib = require('zrender/esm/core/util');

require('./liquidFillSeries');
require('./liquidFillView');

echarts.registerVisual(lib.curry(require('./dataColor'), 'liquidFill'));
