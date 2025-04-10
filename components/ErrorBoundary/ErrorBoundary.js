import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withScope, captureException } from '@sentry/browser'

import ErrorPage from './ErrorPage'

class ErrorBoundary extends Component {
    static propTypes = {
        children: PropTypes.node.isRequired,
    }

    state = { error: null }

    componentDidCatch(error, errorInfo) {
        this.setState({ error })
        withScope(scope => {
            Object.keys(errorInfo).forEach(key => {
                scope.setExtra(key, errorInfo[key])
            })
            captureException(error)
        })
    }

    render() {
        const { error } = this.state
        const { children } = this.props
        if (error) {
            return <ErrorPage />
        }
        // when there's not an error, render children untouched
        return children
    }
}

export default ErrorBoundary
