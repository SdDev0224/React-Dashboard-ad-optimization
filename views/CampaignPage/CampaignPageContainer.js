import { connect } from 'react-redux'

import { selectBrand, selectCampaign } from 'selectors/entities'
import { selectDomainValue as selectUiDomainValue } from 'selectors/ui'
import {
    mountCampaignPageRequest,
    unmountCampaignPage,
    updateCampaignPageHourlyMultipliersRequest,
    updateCampaignPageCampaignDetailsRequest,
} from 'actions/ui'
import {
    CAMPAIGN_PAGE,
    BRANDS_SUMMARY_PAGE,
    CAMPAIGNS_SUMMARY_PAGE,
} from 'constants/pages'
import { withTabState } from 'components/HigherOrderComponents'

import CampaignPage from './CampaignPage'

const mapStateToProps = (state, ownProps) => {
    const { brandId, campaignId } = ownProps.match.params
    const campaign = selectCampaign(state, campaignId)

    return {
        topLevelPage: brandId ? BRANDS_SUMMARY_PAGE : CAMPAIGNS_SUMMARY_PAGE,
        featurePermissions: selectUiDomainValue(state, [
            CAMPAIGN_PAGE,
            'featurePermissions',
        ]),
        brand: campaign ? selectBrand(state, campaign.profile_id) : {},
        campaignId,
        campaign,
        hourlyMultipliers: selectUiDomainValue(state, [
            CAMPAIGN_PAGE,
            'hourlyMultipliers',
        ]),
        campaignAggregate: selectUiDomainValue(state, [
            CAMPAIGN_PAGE,
            'aggregate',
        ]),
        mounting: selectUiDomainValue(state, [CAMPAIGN_PAGE, 'mounting']),
    }
}

const mapDispatchToProps = {
    mountCampaignPage: mountCampaignPageRequest,
    unmountCampaignPage,
    updateCampaignRequest: updateCampaignPageCampaignDetailsRequest,
    updateCampaignPageHourlyMultipliersRequest,
}

const CampaignPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(CampaignPage)

export default withTabState(CampaignPageContainer, 'roi')
