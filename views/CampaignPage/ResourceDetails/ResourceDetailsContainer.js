import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { selectDomainValue as selectUiDomainValue } from 'selectors/ui'
import { selectBrand, selectCampaign } from 'selectors/entities'
import { CAMPAIGN_PAGE } from 'constants/pages'
import {
    toggleCampaignPageDetails,
    updateCampaignPageCampaignDetailsRequest,
} from 'actions/ui'

import ResourceDetails from './ResourceDetails'

const mapStateToProps = (state, ownProps) => {
    const { campaignId } = ownProps.match.params
    const campaign = selectCampaign(state, campaignId)

    return {
        brand: campaign ? selectBrand(state, campaign.profile_id) : {},
        campaign,
        showDetails: selectUiDomainValue(state, [CAMPAIGN_PAGE, 'showDetails']),
        campaignUpdating: selectUiDomainValue(state, [
            CAMPAIGN_PAGE,
            'campaignUpdating',
        ]),
    }
}

const mapDispatchToProps = {
    toggleCampaignPageDetails,
    updateCampaignRequest: updateCampaignPageCampaignDetailsRequest,
}

const ResourceDetailsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ResourceDetails)

export default withRouter(ResourceDetailsContainer)
