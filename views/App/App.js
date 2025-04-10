import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Router, Route, Switch } from 'react-router-dom'

import { AUTH_PAGE } from 'constants/pages'
import { getPath } from 'helpers/pages'
import history from 'utilities/history'

import { AuthContainer } from 'views/Auth'
import { AppLayoutContainer } from 'views/AppLayout'
import { PrivateRouteContainer } from 'components/PrivateRoute'
import { LoadingIndicator } from 'components/LoadingIndicator'
import { MaintenancePage } from 'components/MaintenancePage'
import { ErrorPage } from 'components/ErrorBoundary'

class App extends Component {
    static propTypes = {
        // actions
        loadAuthRequest: PropTypes.func.isRequired,

        // Redux state
        isLoadingAuth: PropTypes.bool.isRequired,
        loadAuthError: PropTypes.string,
        displayMaintenancePage: PropTypes.bool.isRequired,
    }

    static defaultProps = {
        loadAuthError: null,
    }

    componentWillMount() {
        const { loadAuthRequest } = this.props
        loadAuthRequest()
    }

    render() {
        const {
            isLoadingAuth,
            loadAuthError,
            displayMaintenancePage,
        } = this.props

        if (isLoadingAuth) {
            return <LoadingIndicator />
        }

        if (displayMaintenancePage) {
            return <MaintenancePage />
        }

        if (loadAuthError) {
            return <ErrorPage />
        }

        return (
            <Router history={history}>
                <Switch>
                    <Route
                        path={getPath(AUTH_PAGE)}
                        component={AuthContainer}
                    />
                    <PrivateRouteContainer component={AppLayoutContainer} />
                </Switch>
            </Router>
        )
    }
}

export default App
