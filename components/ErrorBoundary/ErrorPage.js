import React from 'react'
import { Button } from 'antd'
import { showReportDialog } from '@sentry/browser'

import { TextButton } from 'components/TextButton'
import logoIcon from 'images/logo-icon.svg'
import { showDriftSidebar } from 'helpers/drift'

import styles from './styles.scss'

const propTypes = {}
const defaultProps = {}

const ErrorPage = () => (
  <div className={styles.background}>
    <div className={styles['error-div']}>
      <div className={styles.logo}>
        <img alt='logo' src={logoIcon} />
      </div>

      <h3>Something has gone wrong.</h3>

      <p>
        Our team has been notified and we are actively working to fix this
        issue. Please refresh the page.
      </p>

      <p>
        Contact us{' '}
        <TextButton link onClick={showDriftSidebar}>
          on chat
        </TextButton>{' '}
        for questions or concerns.
      </p>

      <p>
        Lastly, you can click the link below to provide a full error report with
        more details.
      </p>
      <Button type='primary' onClick={() => showReportDialog()}>
        Submit Error Report
      </Button>
    </div>
  </div>
)

ErrorPage.propTypes = propTypes
ErrorPage.defaultProps = defaultProps

export default ErrorPage
