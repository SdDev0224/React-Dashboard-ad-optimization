import { connect } from 'react-redux'

import { signUpRequest, resetAuth } from 'actions/auth'

import SignupForm from './SignupForm'

const mapStateToProps = state => ({
    auth: state.auth,
})

const mapDispatchToProps = {
    signUpRequest,
    resetAuth,
}

const SignupFormContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(SignupForm)

export default SignupFormContainer
