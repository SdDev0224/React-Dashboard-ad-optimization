import React from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'antd'

const propTypes = {
    globalNotification: PropTypes.object,
}

const defaultProps = {
    globalNotification: null,
}

const GlobalNotificationBanner = ({ globalNotification }) => {
    if (!globalNotification || !globalNotification.enabled) {
        return null
    }

    return (
        <Alert
            banner
            type={globalNotification.type}
            message={globalNotification.message}
            closable
        />
    )
}

GlobalNotificationBanner.propTypes = propTypes
GlobalNotificationBanner.defaultProps = defaultProps

export default GlobalNotificationBanner
