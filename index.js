/*
global
    STAGE,
    IDENTITY_POOL_ID,
    REGION,
    SENTRY_CONFIG_URL,
    USER_POOL_ID,
    USER_POOL_CLIENT_ID,
    GOOGLE_ANALYTICS_ID,
*/
import React from 'react'
import Amplify from 'aws-amplify'
import AWS from 'aws-sdk'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import createSagaMiddleware from 'redux-saga'
import ReactGA from 'react-ga'
import { init, captureException } from '@sentry/browser'
import { composeWithDevTools } from 'redux-devtools-extension'

import rootReducer from 'reducers'
import rootSaga from 'sagas'
import { AppContainer } from 'views/App'
import { ErrorBoundary } from 'components/ErrorBoundary'
import { sentryMiddleware } from 'sagas/middlewares'
import {
    DIMENSIONS,
    CUSTOM_DIMENSIONS,
    UNAUTHENTICATED_USER_ID,
    UNAUTHENTICATED_CUSTOMER_ID,
} from 'constants/googleAnalytics'

import './globals.scss'

// configure aws amplify sdk
Amplify.configure({
    Auth: {
        identityPoolId: IDENTITY_POOL_ID,
        region: REGION,
        userPoolId: USER_POOL_ID,
        userPoolWebClientId: USER_POOL_CLIENT_ID,
        mandatorySignIn: false, // Enforce user authentication prior to accessing AWS resources or not
    },
})

// configure AWS sdk client
AWS.config.update({ region: REGION })

// configure sentry
init({
    dsn: SENTRY_CONFIG_URL,
    environment: STAGE,
    beforeSend: event => (STAGE === 'Dev' ? null : event),
})

// configure google analytics
ReactGA.initialize(GOOGLE_ANALYTICS_ID, {
    titleCase: false,
    gaOptions: {
        [DIMENSIONS.userId]: UNAUTHENTICATED_USER_ID, // default GA user dimension
    },
})
ReactGA.set({ [CUSTOM_DIMENSIONS.customerId]: UNAUTHENTICATED_CUSTOMER_ID }) // custom GA user dimension

// create saga middleware
const sagaMiddleware = createSagaMiddleware({
    onError: err => {
        if (STAGE === 'Dev') {
            // eslint-disable-next-line
            console.error(err)
        } else {
            captureException(err)
        }
    },
})

// create redux store with redux tools in development and beta stages
const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(sagaMiddleware, sentryMiddleware))
)

// run redux sagas
sagaMiddleware.run(rootSaga)

// render application
const RootComponent = () => (
    <Provider store={store}>
        <ErrorBoundary>
            <AppContainer />
        </ErrorBoundary>
    </Provider>
)
ReactDOM.render(<RootComponent />, document.getElementById('root'))
