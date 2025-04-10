import { connect } from 'react-redux'

import {
    selectChartMetrics,
    selectPageFactTypes,
    selectDataForStackedBarChart,
    selectLoadingForStackedBarChart,
    selectPageDownloading,
} from 'selectors/ui'
import {
    updateChartMetrics,
    downloadHomePageTimeseriesRequest,
} from 'actions/ui'
import { HOME_PAGE } from 'constants/pages'
import { REACH } from 'constants/charts'

import ReachChart from './ReachChart'

const mapStateToProps = state => {
    const chartMetrics = selectChartMetrics(state, HOME_PAGE, REACH)
    const factTypes = selectPageFactTypes(state, HOME_PAGE)
    const loading = selectLoadingForStackedBarChart(state, HOME_PAGE)
    const downloading = selectPageDownloading(state, HOME_PAGE)
    const { axes, series } = selectDataForStackedBarChart(
        state,
        HOME_PAGE,
        REACH
    )

    return {
        chartMetrics,
        factTypes,
        axes,
        series,
        loading,
        downloading,
    }
}

const mapDispatchToProps = {
    updateChartMetrics,
    downloadData: downloadHomePageTimeseriesRequest,
}

const ReachChartContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ReachChart)

export default ReachChartContainer
