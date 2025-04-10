// noinspection ES6CheckImport
import ReactGA from 'react-ga'
import { configureScope, captureException } from '@sentry/browser'
import { call, put, all, select } from 'redux-saga/effects'
import get from 'lodash/get'
import find from 'lodash/find'
import isNull from 'lodash/isNull'
import has from 'lodash/has'

import {
  CEREBRO_ACCESS_TOKEN,
  CEREBRO_REFRESH_TOKEN,
  CUSTOMER_SERVICE,
  ORGANIZATION_ID,
  ORGANIZATION_GROUP_ID,
} from 'constants/localStorage'
import {
  DIMENSIONS,
  CUSTOM_DIMENSIONS,
  UNAUTHENTICATED_USER_ID,
  UNAUTHENTICATED_CUSTOMER_ID,
} from 'constants/googleAnalytics'

import {
  // Load auth
  loadAuthFinish,
  loadAuthFailure,

  // organization integration status
  fetchLatestOrganizationIntegrationSuccess,

  // organizations
  changeOrganizationSuccess,
  changeOrganizationFailure,

  // organization groups
  changeOrganizationGroupSuccess,
  changeOrganizationGroupFailure,

  // feature Permissions
  changeFeaturePermissions,

  // Sign up
  signUpSuccess,
  signUpFailure,

  // Sign in
  signInRequest,
  signInSuccess,
  signInFailure,

  // Sign out
  signOutSuccess,
  signOutFailure,

  // Send reset email
  sendResetEmailSuccess,
  sendResetEmailFailure,

  // Reset password
  resetPasswordSuccess,
  resetPasswordFailure,
} from 'actions/auth'
import { fetchCurrentPageData } from 'actions/ui'

import { selectDomainValue as selectAuthDomainValue } from 'selectors/auth'
import {
  loginWithCerebro,
  getUserOrganizationGroups,
  getUserFeaturePermissions,
  getUserOrganizationFeaturePermissions,
  getOrganizationIntegrations,
} from 'services/cerebroApi'
import {
  signInWithCognito,
  signUpWithCognito,
  signOutWithCognito,
  currentAuthenticatedUserWithCognito,
  sendResetEmailWithCognito,
  resetPasswordWithCognito,
} from 'services/cognitoApi'
import {
  getItemFromUserSettingsTable,
  putItemToUserSettingsTable,
} from 'services/dynamoApi'

import { formatSignUpData } from 'helpers/params'
import { hasCustomerServicePermissions } from 'helpers/featurePermissions'

import cerebroApiSaga from 'sagas/common/cerebroApi'
import { fetchOrganizationsSaga } from 'sagas/orgs/organizations'

export const setSentryUserContext = ({ id, email }) => {
  configureScope((scope) => {
    scope.setUser({
      id,
      email,
    })
  })
}

export const unsetSentryUserContext = () => {
  configureScope((scope) => {
    scope.setUser({})
  })
}

function* getAndSetId({
  userId,
  idsUserCanAccess,
  fetchIdFromDynamoSaga,
  putIdToDynamoSaga,
  deleteId,
  setId,
}) {
  // fetch any saved default id from DynamoDB
  const defaultId = yield call(fetchIdFromDynamoSaga, userId)

  // check if user still has access to default id
  const canAccessDefaultId = find(idsUserCanAccess, { id: defaultId })

  // get first id the user can access
  const firstId = get(idsUserCanAccess, ['0', 'id'], null)

  // determine the effective id
  let effectiveId
  if (!isNull(defaultId) && canAccessDefaultId) {
    effectiveId = defaultId
  } else if (!isNull(defaultId) && !canAccessDefaultId && !isNull(firstId)) {
    effectiveId = firstId
  } else if (isNull(defaultId) && !isNull(firstId)) {
    effectiveId = firstId
  } else {
    effectiveId = null
  }

  // sync the effective id with DynamoDB
  yield call(putIdToDynamoSaga, userId, effectiveId)

  // sync the effective id with local storage
  if (isNull(effectiveId)) {
    yield call(deleteId)
  } else {
    yield call(setId, effectiveId)
  }

  return effectiveId
}

function* setCerebroAuthTokensSaga(accessToken, refreshToken) {
  yield all([
    call([localStorage, 'setItem'], CEREBRO_ACCESS_TOKEN, accessToken),
    call([localStorage, 'setItem'], CEREBRO_REFRESH_TOKEN, refreshToken),
  ])
}

function* deleteCerebroAuthTokensSaga() {
  yield all([
    call([localStorage, 'removeItem'], CEREBRO_ACCESS_TOKEN),
    call([localStorage, 'removeItem'], CEREBRO_REFRESH_TOKEN),
  ])
}

function* setCerebroOrganizationIdSaga(organizationId) {
  yield call([localStorage, 'setItem'], ORGANIZATION_ID, organizationId)
}

function* deleteCerebroOrganizationIdSaga() {
  yield call([localStorage, 'removeItem'], ORGANIZATION_ID)
}

function* setCerebroOrganizationGroupIdSaga(organizationGroupId) {
  yield call(
    [localStorage, 'setItem'],
    ORGANIZATION_GROUP_ID,
    organizationGroupId
  )
}

function* deleteCerebroOrganizationGroupIdSaga() {
  yield call([localStorage, 'removeItem'], ORGANIZATION_GROUP_ID)
}

function* setCustomerServicePermissionsSaga(userFeaturePermissions) {
  yield call(
    [localStorage, 'setItem'],
    CUSTOMER_SERVICE,
    hasCustomerServicePermissions(userFeaturePermissions)
  )
}

function* deleteCustomerServicePermissionsSaga() {
  yield call([localStorage, 'removeItem'], CUSTOMER_SERVICE)
}

export function* setSentryUserContextSaga(user) {
  const { username, attributes } = user

  yield call(setSentryUserContext, {
    id: username,
    email: attributes.email,
  })
}

export function* unsetSentryUserContextSaga() {
  yield call(unsetSentryUserContext)
}

export function* setGoogleUserContextSaga(user) {
  const { username } = user
  // set default GA user dimension
  yield call([ReactGA, 'set'], {
    [DIMENSIONS.userId]: username,
  })
  // set custom GA user dimension
  yield call([ReactGA, 'set'], {
    [CUSTOM_DIMENSIONS.customerId]: username,
  })
}

export function* unsetGoogleUserContextSaga() {
  // unset default GA user dimension
  yield call([ReactGA, 'set'], {
    [DIMENSIONS.userId]: UNAUTHENTICATED_USER_ID,
  })
  // unset custom GA user dimension
  yield call([ReactGA, 'set'], {
    [CUSTOM_DIMENSIONS.customerId]: UNAUTHENTICATED_CUSTOMER_ID,
  })
}

function* authorizeCognitoSaga(email, password) {
  // sign in with cognito
  yield call(signInWithCognito, email, password)
}

function* authorizeCerebroSaga(email, password) {
  // login with cerebro and get auth tokens
  const response = yield call(loginWithCerebro, email, password)

  if (response.status !== 200) {
    if (has(response, ['data', 'error_description'])) {
      throw new Error(get(response, ['data', 'error_description']))
    } else if (has(response, ['data', 'error'])) {
      throw new Error(get(response, ['data', 'error']))
    }
  }

  // save auth tokens to local storage
  const { access_token, refresh_token } = response.data
  yield call(setCerebroAuthTokensSaga, access_token, refresh_token)
}

function* getCurrentCognitoUserSaga() {
  let currentUser

  try {
    currentUser = yield call(currentAuthenticatedUserWithCognito)
  } catch (e) {
    // sign out will clear all existing cognito keys from localStorage
    yield call(signOutWithCognito)
    currentUser = null
  }

  return currentUser
}

function* getUserOrganizationGroupsSaga() {
  return yield call(cerebroApiSaga, null, getUserOrganizationGroups)
}

function* getUserFeaturePermissionsSaga() {
  return yield call(cerebroApiSaga, null, getUserFeaturePermissions)
}

function* getUserOrganizationFeaturePermissionsSaga() {
  return yield call(cerebroApiSaga, null, getUserOrganizationFeaturePermissions)
}

function* fetchLatestActiveOrganizationIntegrationSaga(organizationId) {
  if (!isNull(organizationId)) {
    yield call(
      cerebroApiSaga,
      fetchLatestOrganizationIntegrationSuccess,
      getOrganizationIntegrations,
      organizationId,
      {
        limit: 1,
        offset: 0,
        ordering: '-created_at',
        active: true,
      }
    )
  }
}

function* saveCurrentUserToAppSaga({
  cognitoUser,
  organizationId,
  organizations,
  organizationGroupId,
  organizationGroups,
  featurePermissions,
}) {
  // Set context for Sentry
  yield call(setSentryUserContextSaga, cognitoUser)

  // Set context for Google Analytics
  yield call(setGoogleUserContextSaga, cognitoUser)

  // Store current user
  yield put(
    signInSuccess({
      cognitoUser,
      organizationId,
      organizations,
      organizationGroupId,
      organizationGroups,
      featurePermissions,
    })
  )
}

function* fetchOrganizationIdFromDynamoSaga(userId) {
  const key = {
    UserId: userId,
    Domain: 'auth-organizationId',
  }
  const { Item } = yield call(getItemFromUserSettingsTable, key)
  return get(Item, 'organizationId', null)
}

function* putOrganizationIdToDynamoSaga(userId, organizationId) {
  const item = {
    UserId: userId,
    Domain: 'auth-organizationId',
    organizationId,
  }
  yield call(putItemToUserSettingsTable, item)
}

function* fetchOrganizationGroupIdFromDynamoSaga(userId) {
  const key = {
    UserId: userId,
    Domain: 'auth-organizationGroupId',
  }
  const { Item } = yield call(getItemFromUserSettingsTable, key)
  return get(Item, 'organizationGroupId', null)
}

function* putOrganizationGroupIdToDynamoSaga(userId, organizationGroupId) {
  const item = {
    UserId: userId,
    Domain: 'auth-organizationGroupId',
    organizationGroupId,
  }
  yield call(putItemToUserSettingsTable, item)
}

function* getAndSetDefaultOrganizationId(userId, organizations) {
  return yield call(getAndSetId, {
    userId,
    idsUserCanAccess: organizations,
    fetchIdFromDynamoSaga: fetchOrganizationIdFromDynamoSaga,
    putIdToDynamoSaga: putOrganizationIdToDynamoSaga,
    deleteId: deleteCerebroOrganizationIdSaga,
    setId: setCerebroOrganizationIdSaga,
  })
}

function* getAndSetDefaultOrganizationGroupId(userId, organizationGroups) {
  return yield call(getAndSetId, {
    userId,
    idsUserCanAccess: organizationGroups,
    fetchIdFromDynamoSaga: fetchOrganizationGroupIdFromDynamoSaga,
    putIdToDynamoSaga: putOrganizationGroupIdToDynamoSaga,
    deleteId: deleteCerebroOrganizationGroupIdSaga,
    setId: setCerebroOrganizationGroupIdSaga,
  })
}

function* getAndSetUserFeaturePermissionsSaga(userId, organizations) {
  // get/set the default organization id
  const organizationId = yield call(
    getAndSetDefaultOrganizationId,
    userId,
    organizations
  )

  // load user specific feature permissions
  const { data: userFeaturePermissions } = yield call(
    getUserFeaturePermissionsSaga
  )

  // set the customer service role in local storage
  yield call(setCustomerServicePermissionsSaga, userFeaturePermissions)

  // load organization groups if user has CS permissions
  let organizationGroupId = null
  let organizationGroups = []
  if (hasCustomerServicePermissions(userFeaturePermissions)) {
    const { data } = yield call(getUserOrganizationGroupsSaga)
    organizationGroups = data
    organizationGroupId = yield call(
      getAndSetDefaultOrganizationGroupId,
      userId,
      organizationGroups
    )
  }

  // determine user's feature permissions for current org
  const { data: featurePermissions } = yield call(
    getUserOrganizationFeaturePermissionsSaga
  )

  return {
    organizationId,
    organizationGroupId,
    organizationGroups,
    featurePermissions,
  }
}

/**
 * Authentication entry point for the application
 */
export function* loadAuthWorker() {
  try {
    // Load maintenance page setting
    const displayMaintenancePage = yield call(fetchShowMaintenancePageSaga)

    if (displayMaintenancePage) {
      return yield put(loadAuthFinish(displayMaintenancePage))
    }

    // Load current user
    const cognitoUser = yield call(getCurrentCognitoUserSaga)

    if (cognitoUser) {
      // Calling `fetchOrganizationsSaga` also ensures cerebro tokens are
      // valid. If cerebro tokens are invalid, an action will be dispatched
      // to sign out the user.
      const { status, data: organizations } = yield call(fetchOrganizationsSaga)

      if (status === 200) {
        const { username: userId } = cognitoUser

        // get/set user's organizations, organization groups, and permissions
        const {
          organizationId,
          organizationGroupId,
          organizationGroups,
          featurePermissions,
        } = yield call(
          getAndSetUserFeaturePermissionsSaga,
          userId,
          organizations
        )

        // save integrations associated with active organization to state
        yield call(fetchLatestActiveOrganizationIntegrationSaga, organizationId)

        // save user
        yield call(saveCurrentUserToAppSaga, {
          cognitoUser,
          organizationId,
          organizations,
          organizationGroupId,
          organizationGroups,
          featurePermissions,
        })
      }
    }

    return yield put(loadAuthFinish(displayMaintenancePage))
  } catch (e) {
    yield call(captureException, e)
    yield put(loadAuthFailure({ error: e.message }))
    throw e
  }
}

/**
 * Sign the user out of the application
 */
export function* signOutWorker() {
  try {
    // Remove token stored in local storage
    yield all([
      call(deleteCerebroAuthTokensSaga),
      call(deleteCerebroOrganizationIdSaga),
      call(deleteCerebroOrganizationGroupIdSaga),
      call(deleteCustomerServicePermissionsSaga),
    ])

    // reset sentry and google analytics
    yield all([
      call(unsetSentryUserContextSaga),
      call(unsetGoogleUserContextSaga),
    ])

    // Sign out with Cognito
    yield call(signOutWithCognito)

    yield put(signOutSuccess())
  } catch (e) {
    yield call(captureException, e)
    yield put(signOutFailure({ error: e.message }))
  }
}

/**
 * Sign the user into the application
 */
export function* signInWorker(action) {
  const { email, password } = action.payload

  try {
    // authorize with cognito and cerebro
    yield all([
      call(authorizeCognitoSaga, email, password),
      call(authorizeCerebroSaga, email, password),
    ])

    // get cognito user and all associated organizations
    const [cognitoUser, organizationsResponse] = yield all([
      call(getCurrentCognitoUserSaga),
      call(fetchOrganizationsSaga),
    ])
    const { username: userId } = cognitoUser
    const { data: organizations } = organizationsResponse

    // get/set user's organizations, organization groups, and permissions
    const {
      organizationId,
      organizationGroupId,
      organizationGroups,
      featurePermissions,
    } = yield call(getAndSetUserFeaturePermissionsSaga, userId, organizations)

    // save integrations associated with active organization to state
    yield call(fetchLatestActiveOrganizationIntegrationSaga, organizationId)

    // save user
    yield call(saveCurrentUserToAppSaga, {
      cognitoUser,
      organizationId,
      organizations,
      organizationGroupId,
      organizationGroups,
      featurePermissions,
    })
  } catch (e) {
    yield call(captureException, e)
    yield put(signInFailure({ error: e.message }))
  }
}

/**
 * Sign the user up
 */
export function* signUpWorker(action) {
  const formValues = action.payload
  const { email, password } = formValues
  const signUpData = formatSignUpData(formValues)

  try {
    yield call(signUpWithCognito, signUpData)

    // Mark sign up succeeded
    yield put(signUpSuccess())

    // Trigger sign in
    yield call(
      signInWorker,
      signInRequest({
        email,
        password,
      })
    )
  } catch (e) {
    yield call(captureException, e)
    yield put(signUpFailure({ error: e.message }))
  }
}

/**
 * Sends a password reset email to the user
 */
export function* sendResetEmailWorker(action) {
  try {
    const { email } = action.payload

    yield call(sendResetEmailWithCognito, email)

    yield put(sendResetEmailSuccess())
  } catch (err) {
    yield call(captureException, err)
    yield put(sendResetEmailFailure({ error: err.message }))
  }
}

/**
 * Resets a user's password
 */
export function* resetPasswordWorker(action) {
  const { email, code, newPassword } = action.payload

  try {
    yield call(resetPasswordWithCognito, email, code, newPassword)

    yield put(resetPasswordSuccess())
  } catch (err) {
    yield call(captureException, err)
    yield put(resetPasswordFailure({ error: err.message }))
  }
}

/**
 * Change the user's organization
 */
export function* changeOrganizationWorker(action) {
  const { organizationId } = action.payload

  try {
    const userId = yield select(selectAuthDomainValue, 'username')

    // save new organization to local storage
    yield call(setCerebroOrganizationIdSaga, organizationId)

    // update store with feature permissions for new organization
    const { data } = yield call(getUserOrganizationFeaturePermissions)
    yield put(changeFeaturePermissions(data))

    // update organization integration status
    yield call(fetchLatestActiveOrganizationIntegrationSaga, organizationId)

    // update page and save new organization to DynamoDB
    yield all([
      put(fetchCurrentPageData()),
      call(putOrganizationIdToDynamoSaga, userId, organizationId),
    ])

    yield put(changeOrganizationSuccess(organizationId))
  } catch (err) {
    yield call(captureException, err)
    yield put(changeOrganizationFailure({ error: err.message }))
  }
}

/**
 * Change the user's organization group
 */
export function* changeOrganizationGroupWorker(action) {
  const { organizationGroupId, organizationId } = action.payload

  try {
    const userId = yield select(selectAuthDomainValue, 'username')

    // save new organization and organization group to local storage
    yield call(setCerebroOrganizationIdSaga, organizationId)
    yield call(setCerebroOrganizationGroupIdSaga, organizationGroupId)

    // update store with feature permissions for new organization
    const { data } = yield call(getUserOrganizationFeaturePermissions)
    yield put(changeFeaturePermissions(data))

    // update organization integration status
    yield call(fetchLatestActiveOrganizationIntegrationSaga, organizationId)

    // update page and save new organization to DynamoDB
    yield all([
      put(fetchCurrentPageData()),
      call(putOrganizationGroupIdToDynamoSaga, userId, organizationGroupId),
    ])

    yield put(changeOrganizationGroupSuccess(organizationGroupId))
  } catch (err) {
    yield call(captureException, err)
    yield put(changeOrganizationGroupFailure({ error: err.message }))
  }
}
