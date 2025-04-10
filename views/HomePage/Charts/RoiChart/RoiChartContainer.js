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
import { ROI } from 'constants/charts'

import RoiChart from './RoiChart'

const mapStateToProps = state => {
    const chartMetrics = selectChartMetrics(state, HOME_PAGE, ROI)
    const factTypes = selectPageFactTypes(state, HOME_PAGE)
    const loading = selectLoadingForStackedBarChart(state, HOME_PAGE)
    const downloading = selectPageDownloading(state, HOME_PAGE)
    const { axes, series } = selectDataForStackedBarChart(state, HOME_PAGE, ROI)

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

const RoiChartContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(RoiChart)

export default RoiChartContainer
