import React from 'react'
import PropTypes from 'prop-types'
import { Divider, Row } from 'antd'

import { AppLink } from 'components/AppLink'
import { getPath } from 'helpers/pages'
import { AUTH_PAGE } from 'constants/pages'

import styles from './styles.scss'
import SendResetEmailForm from './SendResetEmailForm'
import ResetPasswordForm from './ResetPasswordForm'

const propTypes = {
    // redux state
    auth: PropTypes.shape({
        passwordResetEmailSent: PropTypes.bool,
    }).isRequired,

    // actions
    sendResetEmailRequest: PropTypes.func.isRequired,
    resetAuthErrors: PropTypes.func.isRequired,
    resetPasswordRequest: PropTypes.func.isRequired,
}
const defaultProps = {}

const ForgotPasswordForm = ({
    auth,
    sendResetEmailRequest,
    resetAuthErrors,
    resetPasswordRequest,
}) => (
    <div>
        <div className={styles.center}>
            <h3>Password Reset</h3>
        </div>

        <div className={styles.content}>
            <p>
                Enter the email address that you used to register. We will send
                you an email with a link to reset your password.
            </p>
        </div>

        <SendResetEmailForm
            auth={auth}
            resetAuthErrors={resetAuthErrors}
            sendResetEmailRequest={sendResetEmailRequest}
        />

        {auth.passwordResetEmailSent && <Divider />}

        <ResetPasswordForm
            auth={auth}
            resetPasswordRequest={resetPasswordRequest}
        />

        <Row type="flex" justify="center">
            <p>
                <AppLink to={getPath(AUTH_PAGE)}>
                    <span>Login</span>
                </AppLink>
            </p>
        </Row>
    </div>
)

ForgotPasswordForm.propTypes = propTypes
ForgotPasswordForm.defaultProps = defaultProps

export default ForgotPasswordForm
