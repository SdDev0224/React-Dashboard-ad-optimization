import { connect } from 'react-redux'

import {
    sendResetEmailRequest,
    resetAuthErrors,
    resetPasswordRequest,
} from 'actions/auth'

import ForgotPasswordForm from './ForgotPasswordForm'

const mapStateToProps = state => ({
    auth: state.auth,
})

const mapDispatchToProps = {
    sendResetEmailRequest,
    resetAuthErrors,
    resetPasswordRequest,
}

const ForgotPasswordFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(ForgotPasswordForm)

export default ForgotPasswordFormContainer
