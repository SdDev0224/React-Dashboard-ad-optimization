import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { CAMPAIGN_PAGE } from 'constants/pages'
import { selectCampaignLabels } from 'selectors/entities'
import { selectDomainValue as selectUiDomainValue } from 'selectors/ui'
import { selectDomainValue as selectAuthDomainValue } from 'selectors/auth'
import {
    addCampaignPageLabelsRequest,
    removeCampaignPageLabelRequest,
} from 'actions/ui'

import Labels from './Labels'

const mapStateToProps = (state, ownProps) => {
    const { campaignId } = ownProps.match.params
    return {
        labels: selectCampaignLabels(state, campaignId),
        orgLabels: selectUiDomainValue(state, ['app', 'organizationLabels']),
        addingLabels: selectUiDomainValue(state, [
            CAMPAIGN_PAGE,
            'addingLabels',
        ]),
        featurePermissions: selectAuthDomainValue(state, 'featurePermissions'),
    }
}

const mapDispatchToProps = {
    addLabelsRequest: addCampaignPageLabelsRequest,
    removeLabelRequest: removeCampaignPageLabelRequest,
}

const LabelsContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Labels)

export default withRouter(LabelsContainer)
