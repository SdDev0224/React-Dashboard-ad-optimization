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
import { CONVERSIONS } from 'constants/charts'

import ConversionsChart from './ConversionsChart'

const mapStateToProps = state => {
    const chartMetrics = selectChartMetrics(state, HOME_PAGE, CONVERSIONS)
    const factTypes = selectPageFactTypes(state, HOME_PAGE)
    const loading = selectLoadingForStackedBarChart(state, HOME_PAGE)
    const downloading = selectPageDownloading(state, HOME_PAGE)
    const { axes, series } = selectDataForStackedBarChart(
        state,
        HOME_PAGE,
        CONVERSIONS
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

const ConversionsChartContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ConversionsChart)

export default ConversionsChartContainer
