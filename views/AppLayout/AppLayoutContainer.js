import { compose } from 'redux'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'

import { withGoogleTracker } from 'components/HigherOrderComponents'
import { selectCurrencyCode, selectGlobalNotification } from 'selectors/ui'
import {
    selectDomainValue as selectAuthDomainValue,
    selectHasRecentIntegration,
} from 'selectors/auth'
import { selectOrganizations } from 'selectors/orgs'
import { mountApp, changeCurrencyCode } from 'actions/ui'
import {
    changeOrganizationRequest,
    changeOrganizationGroupRequest,
} from 'actions/auth'

import AppLayout from './AppLayout'

const mapStateToProps = state => ({
    currencyCode: selectCurrencyCode(state),
    hasRecentIntegration: selectHasRecentIntegration(state),
    currentOrganizationId: selectAuthDomainValue(state, 'organizationId'),
    organizations: selectOrganizations(state),
    currentOrganizationGroupId: selectAuthDomainValue(
        state,
        'organizationGroupId'
    ),
    organizationGroups: selectAuthDomainValue(state, 'organizationGroups'),
    featurePermissions: selectAuthDomainValue(state, 'featurePermissions'),
    globalNotification: selectGlobalNotification(state),
})

const mapDispatchToProps = {
    mountApp,
    changeCurrencyCode,
    changeOrganization: changeOrganizationRequest,
    changeOrganizationGroup: changeOrganizationGroupRequest,
}

export default compose(
    withGoogleTracker,
    withRouter,
    connect(
        mapStateToProps,
        mapDispatchToProps
    )
)(AppLayout)
