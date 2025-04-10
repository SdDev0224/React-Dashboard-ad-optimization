import { connect } from 'react-redux'
import { hot } from 'react-hot-loader'

import { loadAuthRequest } from 'actions/auth'
import { selectDomainValue as selectAuthDomainValue } from 'selectors/auth'

import App from './App'

const mapStateToProps = state => ({
    isLoadingAuth: selectAuthDomainValue(state, 'isLoadingAuth'),
    loadAuthError: selectAuthDomainValue(state, 'loadAuthError'),
    displayMaintenancePage: selectAuthDomainValue(
        state,
        'displayMaintenancePage'
    ),
})

const mapDispatchToProps = {
    loadAuthRequest,
}

const AppContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(App)

export default hot(module)(AppContainer)
