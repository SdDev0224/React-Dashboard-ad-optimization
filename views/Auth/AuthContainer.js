import { connect } from 'react-redux'

import { withGoogleTracker } from 'components/HigherOrderComponents'

import Auth from './Auth'

const mapStateToProps = state => ({
    auth: state.auth,
})

const AuthContainer = connect(mapStateToProps)(Auth)

export default withGoogleTracker(AuthContainer)
