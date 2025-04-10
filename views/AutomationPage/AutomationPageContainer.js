import { connect } from 'react-redux'

import { AUTOMATION_PAGE } from 'constants/pages'
import { selectDomainValue as selectUiDomainValue } from 'selectors/ui'
import { selectDomainValue as selectAuthDomainValue } from 'selectors/auth'
import { mountAutomationPageRequest, unmountAutomationPage } from 'actions/ui'
import { withTabState } from 'components/HigherOrderComponents'

import AutomationPage from './AutomationPage'

const mapStateToProps = state => ({
    mounting: selectUiDomainValue(state, [AUTOMATION_PAGE, 'mounting']),
    automationDescription: selectUiDomainValue(state, [
        AUTOMATION_PAGE,
        'automationDescription',
    ]),
    descriptionLoading: selectUiDomainValue(state, [
        AUTOMATION_PAGE,
        'descriptionLoading',
    ]),
    featurePermissions: selectAuthDomainValue(state, 'featurePermissions'),
})

const mapDispatchToProps = {
    mountPage: mountAutomationPageRequest,
    unmountPage: unmountAutomationPage,
}

const AutomationPageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(AutomationPage)

export default withTabState(AutomationPageContainer, 'overview')
