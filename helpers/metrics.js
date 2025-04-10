import divide from 'lodash/divide'
import get from 'lodash/get'
import groupBy from 'lodash/groupBy'
import has from 'lodash/has'
import identity from 'lodash/identity'
import isNull from 'lodash/isNull'
import isUndefined from 'lodash/isUndefined'
import map from 'lodash/map'
import orderBy from 'lodash/orderBy'
import sumBy from 'lodash/sumBy'
import toNumber from 'lodash/toNumber'

import moment from 'utilities/moment'
import { metrics } from 'configuration/metrics'

/**
 * Gets metric configuration for a given metric
 *
 * @param key the name of the metric
 * @returns {*}
 */
export const getMetric = key => metrics[key]

/**
 * Get the metric name, given a metric key
 *
 * @param key the name of the metric
 * @param short if short name should be returned
 * @returns {*}
 */
export const getMetricName = (key, short = false) =>
    get(metrics, [key, short ? 'short_name' : 'name'])

/**
 * Checks if a denominator is valid (i.e., non-zero and defined)
 *
 * @param value the value to check
 * @returns {boolean}
 */
const validDenominator = value => {
    if (isNull(value)) {
        return false
    }
    if (isUndefined(value)) {
        return false
    }
    if (toNumber(value) === 0) {
        return false
    }
    return true
}

/**
 * Aggregates metrics by date periods (e.g., day, week, month)
 *
 * @param data the raw data to aggregate
 * @param metric the metric that should be aggregated
 * @param aggregate 'day', 'week', or 'month'
 * @param dateKey the name of the property for the day in the raw data
 * @param getFactsFromItem function that returns the fact object, given an object in the array.
 * @param order either 'asc' or 'desc'
 * @returns {Array}
 */
export const aggregateMetricByDateGroups = ({
    data,
    metric,
    aggregate = 'week',
    dateKey = 'report_date',
    getFactsFromItem = identity,
    order = 'asc',
}) => {
    // create groups by aggregate
    const groups = groupBy(data, value =>
        moment(value[dateKey])
            .startOf(aggregate)
            .toISOString()
    )
    // aggregate by groups
    const groupedData = map(groups, (value, key) => {
        let aggregatedMetric
        if (has(metrics[metric], 'summary_calc')) {
            const { summary_calc } = metrics[metric]
            aggregatedMetric = summary_calc(value, getFactsFromItem)
        } else {
            aggregatedMetric = sumBy(value, metric)
        }

        return {
            period_start: key,
            period_end: moment(key)
                .endOf(aggregate)
                .toISOString(),
            [metric]: aggregatedMetric,
        }
    })
    // order and return data
    return orderBy(groupedData, 'period_start', [order])
}

/**
 * Helper function to calculate weighted average metrics
 *
 * @param data an array of objects with fact data
 * @param getFactsFromItem function that returns the fact object, given an object in the array.
 * @param numeratorMetricName the name of the metric for the numerator
 * @param denominatorMetricName the name of the metric for the denominator
 * @param divideDenominatorBy value to divide the denominator metric by
 */
const weightedAvg = (
    data,
    getFactsFromItem,
    numeratorMetricName,
    denominatorMetricName,
    divideDenominatorBy = 1
) => {
    const numerator = sumBy(data, item =>
        toNumber(getFactsFromItem(item)[numeratorMetricName])
    )
    const denominator = sumBy(data, item =>
        toNumber(getFactsFromItem(item)[denominatorMetricName])
    )
    return validDenominator(denominator)
        ? divide(numerator, divide(denominator, divideDenominatorBy))
        : null
}

/**
 * Average Order Value Weighted Average
 *
 * @param data an array of objects with fact data
 * @param getFactsFromItem function that returns the fact object, given an object in the array.
 */
export const aovWeightedAvg = (data, getFactsFromItem = identity) =>
    weightedAvg(
        data,
        getFactsFromItem,
        'attributed_sales_14_day__sum',
        'attributed_conversions_14_day__sum'
    )

/**
 * Click Through Rate Weighted Average
 *
 * @param data an array of objects with fact data
 * @param getFactsFromItem function that returns the fact object, given an object in the array.
 */
export const ctrWeightedAvg = (data, getFactsFromItem = identity) =>
    weightedAvg(data, getFactsFromItem, 'clicks__sum', 'impressions__sum')

/**
 * Return on Ad Spend Weighted Average
 *
 * @param data an array of objects with fact data
 * @param getFactsFromItem function that returns the fact object, given an object in the array.
 */
export const roasWeightedAvg = (data, getFactsFromItem = identity) =>
    weightedAvg(
        data,
        getFactsFromItem,
        'attributed_sales_14_day__sum',
        'cost__sum'
    )

/**
 * Advertising Cost of Sale Weighted Average
 *
 * @param data an array of objects with fact data
 * @param getFactsFromItem function that returns the fact object, given an object in the array.
 */
export const acosWeightedAvg = (data, getFactsFromItem = identity) =>
    weightedAvg(
        data,
        getFactsFromItem,
        'cost__sum',
        'attributed_sales_14_day__sum'
    )

/**
 * Sales per Click Weighted Average
 *
 * @param data an array of objects with fact data
 * @param getFactsFromItem function that returns the fact object, given an object in the array.
 */
export const spcWeightedAvg = (data, getFactsFromItem = identity) =>
    weightedAvg(
        data,
        getFactsFromItem,
        'attributed_sales_14_day__sum',
        'clicks__sum'
    )

/**
 * Cost per Click Weighted Average
 *
 * @param data an array of objects with fact data
 * @param getFactsFromItem function that returns the fact object, given an object in the array.
 */
export const cpcWeightedAvg = (data, getFactsFromItem = identity) =>
    weightedAvg(data, getFactsFromItem, 'cost__sum', 'clicks__sum')

/**
 * Cost per Acquisition Weighted Average
 *
 * @param data an array of objects with fact data
 * @param getFactsFromItem function that returns the fact object, given an object in the array.
 */
export const cpaWeightedAvg = (data, getFactsFromItem = identity) =>
    weightedAvg(
        data,
        getFactsFromItem,
        'cost__sum',
        'attributed_conversions_14_day__sum'
    )

/**
 * Cost per Thousand Impressions (Cost per Mille) Weighted Average
 *
 * @param data an array of objects with fact data
 * @param getFactsFromItem function that returns the fact object, given an object in the array.
 */
export const cpmWeightedAvg = (data, getFactsFromItem = identity) =>
    weightedAvg(data, getFactsFromItem, 'cost__sum', 'impressions__sum', 1000)

/**
 * Sales per Thousand Impressions (Sales per Mille)
 *
 * @param data an array of objects with fact data
 * @param getFactsFromItem function that returns the fact object, given an object in the array.
 */
export const spmWeightedAvg = (data, getFactsFromItem = identity) =>
    weightedAvg(
        data,
        getFactsFromItem,
        'attributed_sales_14_day__sum',
        'impressions__sum',
        1000
    )

/**
 * Sales per Thousand Impressions (Sales per Mille)
 *
 * @param data an array of objects with fact data
 * @param getFactsFromItem function that returns the fact object, given an object in the array.
 */
export const conversionRateClicksWeightedAvg = (
    data,
    getFactsFromItem = identity
) =>
    weightedAvg(
        data,
        getFactsFromItem,
        'attributed_conversions_14_day__sum',
        'clicks__sum'
    )

/**
 * Conversion Rate based on Impressions
 *
 * @param data an array of objects with fact data
 * @param getFactsFromItem function that returns the fact object, given an object in the array.
 */
export const conversionRateImpressionsWeightedAvg = (
    data,
    getFactsFromItem = identity
) =>
    weightedAvg(
        data,
        getFactsFromItem,
        'attributed_conversions_14_day__sum',
        'impressions__sum'
    )
