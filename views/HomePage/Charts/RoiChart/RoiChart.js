import React from 'react'
import PropTypes from 'prop-types'

import {
    LEFT_AXIS_FIRST,
    LEFT_AXIS_SECOND,
    RIGHT_AXIS,
    ROI,
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

const RoiChart = props => (
    <StackedBarChartCard
        height={400}
        pageName={HOME_PAGE}
        chartName={ROI}
        chartConfig={{
            title: 'Return on Investment',
            titleHelpText: 'The returns on your advertising investments.',
            metricOptions: {
                [LEFT_AXIS_FIRST]: [
                    'attributed_sales_1_day__sum',
                    'attributed_sales_1_day_same_sku__sum',
                    'attributed_sales_7_day__sum',
                    'attributed_sales_7_day_same_sku__sum',
                    'attributed_sales_14_day__sum',
                    'attributed_sales_14_day_same_sku__sum',
                    'attributed_sales_30_day__sum',
                    'attributed_sales_30_day_same_sku__sum',
                ],
                [LEFT_AXIS_SECOND]: ['cost__sum'],
                [RIGHT_AXIS]: ['roas', 'spc', 'cpc', 'spm'],
            },
            defaultMetrics: {
                [LEFT_AXIS_FIRST]: 'attributed_sales_14_day__sum',
                [LEFT_AXIS_SECOND]: 'cost__sum',
                [RIGHT_AXIS]: 'roas',
            },
        }}
        {...props}
    />
)

RoiChart.propTypes = propTypes
RoiChart.defaultProps = defaultProps

export default RoiChart
