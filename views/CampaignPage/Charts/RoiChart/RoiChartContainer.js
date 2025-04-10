import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import {
    selectChartMetrics,
    selectDataForStackedBarChart,
    selectLoadingForStackedBarChart,
    selectPageDownloading,
} from 'selectors/ui'
import { selectCampaign } from 'selectors/entities'
import {
    updateChartMetrics,
    downloadCampaignPageTimeseriesRequest,
} from 'actions/ui'
import { CAMPAIGN_PAGE } from 'constants/pages'
import { ROI } from 'constants/charts'
import { getFactTypeObject } from 'helpers/factTypes'

import RoiChart from './RoiChart'

const mapStateToProps = (state, ownProps) => {
    const { campaignId } = ownProps.match.params
    const campaign = selectCampaign(state, campaignId)
    // convert the factType for a single campaign to an object
    // that's compatible with the chart component
    const factTypes = campaign
        ? [getFactTypeObject(campaign.campaign_type)]
        : []

    const chartMetrics = selectChartMetrics(state, CAMPAIGN_PAGE, ROI)
    const loading = selectLoadingForStackedBarChart(state, CAMPAIGN_PAGE)
    const downloading = selectPageDownloading(state, CAMPAIGN_PAGE)
    const { axes, series } = selectDataForStackedBarChart(
        state,
        CAMPAIGN_PAGE,
        ROI
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
    downloadData: downloadCampaignPageTimeseriesRequest,
}

const RoiChartContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(RoiChart)

export default withRouter(RoiChartContainer)
