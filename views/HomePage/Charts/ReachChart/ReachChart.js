import React from 'react'
import PropTypes from 'prop-types'

import {
    LEFT_AXIS_FIRST,
    LEFT_AXIS_SECOND,
    RIGHT_AXIS,
    REACH,
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

const ReachChart = props => (
    <StackedBarChartCard
        pageName={HOME_PAGE}
        chartName={REACH}
        height={400}
        chartConfig={{
            title: 'Reach and Engagement',
            titleHelpText:
                'The number of potential customers you are reaching with your ads and their level of engagement.',
            metricOptions: {
                [LEFT_AXIS_FIRST]: ['impressions__sum'],
                [LEFT_AXIS_SECOND]: ['clicks__sum'],
                [RIGHT_AXIS]: ['ctr', 'spc', 'cpc', 'spm', 'cpm'],
            },
            defaultMetrics: {
                [LEFT_AXIS_FIRST]: 'impressions__sum',
                [LEFT_AXIS_SECOND]: 'clicks__sum',
                [RIGHT_AXIS]: 'ctr',
            },
        }}
        {...props}
    />
)

ReachChart.propTypes = propTypes
ReachChart.defaultProps = defaultProps

export default ReachChart
