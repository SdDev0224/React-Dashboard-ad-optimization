import React from 'react'
import PropTypes from 'prop-types'

import {
    LEFT_AXIS_FIRST,
    LEFT_AXIS_SECOND,
    RIGHT_AXIS,
    CONVERSIONS,
} from 'constants/charts'

import { StackedBarChartCard } from 'components/StackedBarChartCard'
import { HOME_PAGE } from 'constants/pages'

const propTypes = {
    chartMetrics: PropTypes.objectOf(PropTypes.string).isRequired,
    factTypes: PropTypes.arrayOf(
        PropTypes.shape({
            value: PropTypes.string,
            label: PropTypes.string,
        })
    ).isRequired,
    loading: PropTypes.bool.isRequired,
    axes: PropTypes.objectOf(
        PropTypes.shape({
            tickInterval: PropTypes.number,
            tickFormat: PropTypes.func,
        })
    ).isRequired,
    series: PropTypes.objectOf(
        PropTypes.shape({
            normalizedData: PropTypes.arrayOf(PropTypes.object),
            labelData: PropTypes.arrayOf(PropTypes.object),
        })
    ).isRequired,
    downloading: PropTypes.bool.isRequired,

    // actions
    updateChartMetrics: PropTypes.func.isRequired,
    downloadData: PropTypes.func.isRequired,
}
const defaultProps = {}

const ConversionChart = props => (
    <StackedBarChartCard
        pageName={HOME_PAGE}
        chartName={CONVERSIONS}
        height={400}
        chartConfig={{
            title: 'Conversions',
            titleHelpText: 'How often customers are converting on your ads.',
            metricOptions: {
                [LEFT_AXIS_FIRST]: [
                    'attributed_conversions_1_day__sum',
                    'attributed_conversions_1_day_same_sku__sum',
                    'attributed_conversions_7_day__sum',
                    'attributed_conversions_7_day_same_sku__sum',
                    'attributed_conversions_14_day__sum',
                    'attributed_conversions_14_day_same_sku__sum',
                    'attributed_conversions_30_day__sum',
                    'attributed_conversions_30_day_same_sku__sum',
                ],
                [LEFT_AXIS_SECOND]: ['clicks__sum', 'impressions__sum'],
                [RIGHT_AXIS]: [
                    'conversion_rate_clicks',
                    'conversion_rate_impressions',
                    'aov',
                ],
            },
            defaultMetrics: {
                [LEFT_AXIS_FIRST]: 'attributed_conversions_14_day__sum',
                [LEFT_AXIS_SECOND]: 'clicks__sum',
                [RIGHT_AXIS]: 'conversion_rate_clicks',
            },
        }}
        {...props}
    />
)

ConversionChart.propTypes = propTypes
ConversionChart.defaultProps = defaultProps

export default ConversionChart
