import React from 'react'
import PropTypes from 'prop-types'
import { Redirect, Switch, Route } from 'react-router-dom'

import logoIcon from 'images/logo-icon.svg'
import {
  HOME_PAGE,
  AUTH_PAGE,
  AUTH_SIGNUP_PAGE,
  AUTH_FORGOT_PASSWORD_PAGE,
} from 'constants/pages'
import { getPath } from 'helpers/pages'

import styles from './styles.scss'
import {
  LoginFormContainer,
  SignupFormContainer,
  ForgotPasswordFormContainer,
} from './Forms'

const propTypes = {
  // React router
  location: PropTypes.shape({
    state: PropTypes.object,
  }).isRequired,

  // Redux state
  auth: PropTypes.shape({
    signedIn: PropTypes.bool,
    isFetching: PropTypes.bool,
    error: PropTypes.string,
  }).isRequired,
}
const defaultProps = {}

const Auth = ({ location, auth }) => {
  const { from } = location.state || {
    from: { pathname: getPath(HOME_PAGE) },
  }

  if (auth.signedIn) {
    return <Redirect to={from} />
  }

  return (
    <div className={styles.background}>
      <div className={styles.form}>
        <div className={styles.logo}>
          <img alt='logo' src={logoIcon} />
        </div>

        <Switch>
          <Route
            exact
            path={getPath(AUTH_PAGE)}
            component={LoginFormContainer}
          />
          <Route
            path={getPath(AUTH_SIGNUP_PAGE)}
            component={SignupFormContainer}
          />
          <Route
            path={getPath(AUTH_FORGOT_PASSWORD_PAGE)}
            component={ForgotPasswordFormContainer}
          />
          <Redirect to={getPath(AUTH_PAGE)} />
        </Switch>
      </div>
    </div>
  )
}

Auth.propTypes = propTypes
Auth.defaultProps = defaultProps

export default Auth
