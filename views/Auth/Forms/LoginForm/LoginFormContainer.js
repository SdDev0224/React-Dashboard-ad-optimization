import { connect } from 'react-redux'

import { signInRequest, resetAuth } from 'actions/auth'

import LoginForm from './LoginForm'

const mapStateToProps = state => ({
    auth: state.auth,
})

const mapDispatchToProps = {
    signInRequest,
    resetAuth,
}

const LoginFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginForm)

export default LoginFormContainer
