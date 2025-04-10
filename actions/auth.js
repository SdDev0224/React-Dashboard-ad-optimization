import { createAction } from 'redux-actions'

// Reset Auth
export const resetAuth = createAction('RESET_AUTH')
export const resetAuthErrors = createAction('RESET_AUTH_ERRORS')

// Load Auth
export const loadAuthRequest = createAction('LOAD_AUTH_REQUEST')
export const loadAuthFinish = createAction('LOAD_AUTH_FINISH')
export const loadAuthFailure = createAction('LOAD_AUTH_FAILURE')

// Fetch organization integration status
export const fetchLatestOrganizationIntegrationSuccess = createAction(
    'FETCH_LATEST_ORGANIZATION_INTEGRATION_SUCCESS'
)

// Change organization
export const changeOrganizationRequest = createAction(
    'CHANGE_ORGANIZATION_REQUEST'
)
export const changeOrganizationSuccess = createAction(
    'CHANGE_ORGANIZATION_SUCCESS'
)
export const changeOrganizationFailure = createAction(
    'CHANGE_ORGANIZATION_FAILURE'
)

// Change organization group
export const changeOrganizationGroupRequest = createAction(
    'CHANGE_ORGANIZATION_GROUP_REQUEST'
)
export const changeOrganizationGroupSuccess = createAction(
    'CHANGE_ORGANIZATION_GROUP_SUCCESS'
)
export const changeOrganizationGroupFailure = createAction(
    'CHANGE_ORGANIZATION_GROUP_FAILURE'
)

// Change feature permissions
export const changeFeaturePermissions = createAction(
    'CHANGE_FEATURE_PERMISSIONS'
)

// Sign Up
export const signUpRequest = createAction('SIGN_UP_REQUEST')
export const signUpSuccess = createAction('SIGN_UP_SUCCESS')
export const signUpFailure = createAction('SIGN_UP_FAILURE')

// Sign In
export const signInRequest = createAction('SIGN_IN_REQUEST')
export const signInSuccess = createAction('SIGN_IN_SUCCESS')
export const signInFailure = createAction('SIGN_IN_FAILURE')

// Sign Out
export const signOutRequest = createAction('SIGN_OUT_REQUEST')
export const signOutSuccess = createAction('SIGN_OUT_SUCCESS')
export const signOutFailure = createAction('SIGN_OUT_FAILURE')

// Send reset email
export const sendResetEmailRequest = createAction('SEND_RESET_EMAIL_REQUEST')
export const sendResetEmailSuccess = createAction('SEND_RESET_EMAIL_SUCCESS')
export const sendResetEmailFailure = createAction('SEND_RESET_EMAIL_FAILURE')

// Reset password
export const resetPasswordRequest = createAction('RESET_PASSWORD_REQUEST')
export const resetPasswordSuccess = createAction('RESET_PASSWORD_SUCCESS')
export const resetPasswordFailure = createAction('RESET_PASSWORD_FAILURE')
