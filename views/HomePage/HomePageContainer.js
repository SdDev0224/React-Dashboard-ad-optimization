import { connect } from 'react-redux'

import { selectDomainValue as selectUiDomainValue } from 'selectors/ui'
import { mountHomePageRequest, unmountHomePage } from 'actions/ui'
import { HOME_PAGE } from 'constants/pages'
import { withTabState } from 'components/HigherOrderComponents'

import HomePage from './HomePage'

const mapStateToProps = state => ({
    aggregate: selectUiDomainValue(state, [HOME_PAGE, 'aggregate']),
    mounting: selectUiDomainValue(state, [HOME_PAGE, 'mounting']),
})

const mapDispatchToProps = {
    mountHomePage: mountHomePageRequest,
    unmountHomePage,
}

const HomePageContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(HomePage)

export default withTabState(HomePageContainer, 'roi')
