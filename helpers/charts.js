import get from 'lodash/get'

import { AMS_TIMESERIES_CHARTS } from 'configuration/charts'

/**
 * Return default metrics of chart
 *
 * @param {string} chartName
 */
export const getChartDefaultMetrics = chartName =>
    get(AMS_TIMESERIES_CHARTS, [chartName, 'defaultMetrics'])
