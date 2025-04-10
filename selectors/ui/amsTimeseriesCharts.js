import createCachedSelector from 're-reselect'
import isEmpty from 'lodash/isEmpty'
import zipObject from 'lodash/zipObject'
import get from 'lodash/get'

import moment from 'utilities/moment'
import { getMetric, aggregateMetricByDateGroups } from 'helpers/metrics'
import { formatNumber, formatDate } from 'helpers/formatting'
import { FACT_TYPES } from 'constants/filters'
import {
    LEFT_AXIS_FIRST,
    RIGHT_AXIS,
    CHART_METRIC_KEYS,
} from 'constants/charts'
import { FACT_TYPE_KEYS } from 'constants/factTypes'
import { FILTERS, CHARTS } from 'constants/reducerKeys'

import { selectDomainState, selectDomainValue } from './ui'
import { selectPageAggregation } from './filters'

export const selectChartMetrics = createCachedSelector(
    selectDomainState,
    (state, pageName) => pageName,
    (state, pageName, chartName) => chartName,
    (domainState, pageName, chartName) =>
        get(domainState, [pageName, CHARTS, chartName], {})
)((state, pageName, chartName) => `${pageName}|${chartName}`)

export const selectPageFactTypes = (state, pageName) =>
    selectDomainValue(state, [pageName, FILTERS, FACT_TYPES])

export const selectPageTimeseriesData = (state, pageName) =>
    selectDomainValue(state, [pageName, 'timeseries'])

export const selectDataForStackedBarChart = createCachedSelector(
    selectPageTimeseriesData,
    selectPageAggregation,
    selectChartMetrics,
    (data, aggregate, chartMetrics) => {
        // Metrics selected for the chart
        const metrics = zipObject(
            CHART_METRIC_KEYS,
            CHART_METRIC_KEYS.map(chartMetricKey =>
                getMetric(chartMetrics[chartMetricKey])
            )
        )

        const metricAggregates = zipObject(
            FACT_TYPE_KEYS,
            FACT_TYPE_KEYS.map(factTypeKey =>
                zipObject(
                    CHART_METRIC_KEYS,
                    CHART_METRIC_KEYS.map(chartMetricKey =>
                        aggregateMetricByDateGroups({
                            data: data[factTypeKey],
                            metric: chartMetrics[chartMetricKey],
                            aggregate,
                            order: 'asc',
                        })
                    )
                )
            )
        )

        // Generate axes data
        const axes = {
            date: {
                tickInterval: moment.duration(1, aggregate).asMilliseconds(),
                tickFormat: value => {
                    const formattedDate = formatDate(value, aggregate)
                    return aggregate === 'week'
                        ? `
                        <span>
                            Wk. End <br />
                            ${formattedDate}
                        </span>
                    `
                        : formattedDate
                },
            },
            left: {
                tickFormat: value => {
                    const { format } = metrics[LEFT_AXIS_FIRST]

                    return formatNumber(value, format)
                },
            },
            right: {
                tickFormat: value => {
                    const { format } = metrics[RIGHT_AXIS]

                    return formatNumber(value, format)
                },
            },
        }

        // Generate series data
        const series = zipObject(
            FACT_TYPE_KEYS,
            FACT_TYPE_KEYS.map(factTypeKey =>
                zipObject(
                    CHART_METRIC_KEYS,
                    CHART_METRIC_KEYS.map(chartMetricKey => {
                        if (
                            isEmpty(
                                metricAggregates[factTypeKey][chartMetricKey]
                            )
                        ) {
                            return []
                        }

                        return metricAggregates[factTypeKey][
                            chartMetricKey
                        ].map(value => [
                            aggregate === 'week'
                                ? moment(value.period_end)
                                      .startOf('day')
                                      .valueOf()
                                : moment(value.period_start).valueOf(),
                            value[chartMetrics[chartMetricKey]],
                        ])
                    })
                )
            )
        )

        return {
            axes,
            series,
        }
    }
)((state, pageName, chartName) => `${pageName}|${chartName}`)

export const selectLoadingForStackedBarChart = (state, pageName) =>
    selectDomainValue(state, [pageName, 'timeseries', 'loading'])
