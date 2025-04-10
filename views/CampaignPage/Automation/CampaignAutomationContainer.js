import { connect } from 'react-redux'

import { CAMPAIGN_PAGE } from 'constants/pages'

import { selectCampaignAutomation } from 'selectors/entities'
import { selectDomainValue as selectUiDomainValue } from 'selectors/ui'
import {
    mountCampaignPageAutomationTab,
    createCampaignPageAutomationRequest,
    updateCampaignPageAutomationRequest,
} from 'actions/ui'

import CampaignAutomation from './CampaignAutomation'

const mapStateToProps = state => {
    const campaignId = selectUiDomainValue(state, [CAMPAIGN_PAGE, 'campaignId'])
    const automation = selectCampaignAutomation(state, campaignId)
    const loading = selectUiDomainValue(state, [
        CAMPAIGN_PAGE,
        'automation',
        'loading',
    ])

    return {
        loading,
        automation,
    }
}

const mapDispatchToProps = {
    mountComponent: mountCampaignPageAutomationTab,
    createAutomation: createCampaignPageAutomationRequest,
    updateAutomation: updateCampaignPageAutomationRequest,
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CampaignAutomation)
