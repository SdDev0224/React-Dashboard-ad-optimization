import { handleActions, combineActions } from 'redux-actions'
import set from 'lodash/fp/set'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'

import {
    resetAuth,
    resetAuthErrors,

    // Load auth
    loadAuthRequest,
    loadAuthFinish,
    loadAuthFailure,

    // organization integrations
    fetchLatestOrganizationIntegrationSuccess,

    // Sign up
    signUpRequest,
    signUpSuccess,
    signUpFailure,

    // Sign in
    signInRequest,
    signInSuccess,
    signInFailure,

    // Sign out
    signOutRequest,
    signOutSuccess,
    signOutFailure,

    // Send reset email
    sendResetEmailRequest,
    sendResetEmailSuccess,
    sendResetEmailFailure,

    // Reset password
    resetPasswordRequest,
    resetPasswordSuccess,
    resetPasswordFailure,

    // Feature permissions
    changeFeaturePermissions,

    // Change organization
    changeOrganizationSuccess,
    changeOrganizationFailure,

    // Change organization group
    changeOrganizationGroupSuccess,
    changeOrganizationGroupFailure,
} from 'actions/auth'

export const defaultState = {
    signedIn: false,
    username: null,
    organizationId: null,
    organizationGroupId: null,
    organizationGroups: [],
    featurePermissions: [],
    latestOrganizationIntegration: null,
    email: null,
    email_verified: null,
    name: null,
    company: null,
    phone_number: null,
    phone_number_verified: null,
    passwordResetEmailSent: false,
    passwordResetSuccess: false,
    displayMaintenancePage: false,
    isLoadingAuth: true, // defaults to true so loading indicator is always shown by default when application loads
    isFetching: false,
    loadAuthError: null,
    error: null,
}

export default handleActions(
    {
        [loadAuthRequest](state) {
            return {
                ...state,
                isLoadingAuth: true,
            }
        },

        [loadAuthFinish](state, action) {
            const displayMaintenancePage = action.payload
            return {
                ...state,
                isLoadingAuth: false,
                displayMaintenancePage,
            }
        },

        [loadAuthFailure](state, action) {
            const { error } = action.payload
            return {
                ...state,
                isLoadingAuth: false,
                loadAuthError: error,
            }
        },

        [combineActions(resetAuth, signOutSuccess)]() {
            return { ...defaultState, isLoadingAuth: false }
        },

        [resetAuthErrors](state) {
            return {
                ...state,
                error: null,
            }
        },

        [combineActions(
            signUpRequest,
            signInRequest,
            signOutRequest,
            resetPasswordRequest
        )](state) {
            return {
                ...state,
                isFetching: true,
                error: null,
            }
        },

        [signUpSuccess](state) {
            return {
                ...state,
                isFetching: false,
                error: null,
            }
        },

        [signInSuccess](state, action) {
            const {
                cognitoUser: { username, attributes },
                organizationId,
                organizationGroupId,
                organizationGroups,
                featurePermissions,
            } = action.payload
            return {
                ...state,
                signedIn: true,
                isFetching: false,
                error: null,

                username,
                organizationId,
                organizationGroupId,
                organizationGroups,
                featurePermissions,
                email: attributes.email,
                email_verified: attributes.email_verified,
                name: attributes.name,
                company: attributes['custom:company'] || null,
                phone_number: attributes.phone_number || null,
                phone_number_verified: attributes.phone_number_verified || null,
            }
        },

        [sendResetEmailRequest](state, action) {
            const { email } = action.payload
            return {
                ...state,
                isFetching: true,
                error: null,
                email,
            }
        },

        [sendResetEmailSuccess](state) {
            return {
                ...state,
                passwordResetEmailSent: true,
                isFetching: false,
                error: null,
            }
        },

        [resetPasswordSuccess](state) {
            return {
                ...state,
                passwordResetSuccess: true,
                isFetching: false,
                error: null,
            }
        },

        [combineActions(
            signUpFailure,
            signOutFailure,
            signInFailure,
            sendResetEmailFailure,
            resetPasswordFailure
        )](state, action) {
            const { error } = action.payload
            return {
                ...state,
                isFetching: false,
                error,
            }
        },

        [changeFeaturePermissions](state, action) {
            const featurePermissions = action.payload
            return {
                ...state,
                featurePermissions,
            }
        },

        [changeOrganizationSuccess](state, action) {
            const organizationId = action.payload
            return {
                ...state,
                organizationId,
            }
        },

        [changeOrganizationGroupSuccess](state, action) {
            const organizationGroupId = action.payload
            return {
                ...state,
                organizationGroupId,
            }
        },

        [combineActions(
            changeOrganizationFailure,
            changeOrganizationGroupFailure
        )](state, action) {
            const { error } = action.payload
            return {
                ...state,
                error,
            }
        },

        [fetchLatestOrganizationIntegrationSuccess](state, action) {
            const latestIntegrationCreatedDate = get(
                action,
                ['payload', 'results', '0', 'created_at'],
                null
            )
            return set(
                ['latestOrganizationIntegration'],
                latestIntegrationCreatedDate,
                state
            )
        },
    },
    cloneDeep(defaultState) // create clone, so the defaultState is not mutated
)
