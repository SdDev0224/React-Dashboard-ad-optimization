import React from 'react'
import PropTypes from 'prop-types'
import { Alert } from 'antd'

const propTypes = {
  hasRecentIntegration: PropTypes.bool.isRequired,
}
const defaultProps = {}

const RecentIntegrationBanner = ({ hasRecentIntegration }) =>
  hasRecentIntegration ? (
    <Alert
      banner
      type='warning'
      message='You have recently added a new Amazon Advertising integration.
                         Performance data can take up to 24 hours to become available in your account.'
    />
  ) : null

RecentIntegrationBanner.propTypes = propTypes
RecentIntegrationBanner.defaultProps = defaultProps

export default RecentIntegrationBanner
