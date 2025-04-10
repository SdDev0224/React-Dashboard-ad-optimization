import { all, call, select, put, delay } from 'redux-saga/effects'
import get from 'lodash/get'

import { BRAND_PAGE } from 'constants/pages'
import { SEARCH_RESULTS_PER_QUERY } from 'configuration/typeahead'

import numeral from 'utilities/numeral'
import { getCurrentPage } from 'helpers/pages'
import {
  putItemToUserSettingsTable,
  getItemFromUserSettingsTable,
} from 'services/dynamoApi'
import {
  fetchPageDataActions,
  updatePaginationActions,
  fetchCurrentPageData,
  fetchCurrencySettingsSuccess,
  searchBrandsRequest,
  searchBrandsSuccess,
  searchBrandsFailure,
  searchCampaignsRequest,
  searchCampaignsSuccess,
  searchCampaignsFailure,
  fetchOrganizationLabelsSuccess,
  setGlobalNotification,
} from 'actions/ui'
import {
  selectCurrencyCode,
  selectDomainValue as selectUiDomainValue,
} from 'selectors/ui'
import { selectDomainValue as selectAuthDomainValue } from 'selectors/auth'

import cerebroApiSaga from 'sagas/common/cerebroApi'

import { getCampaigns, getBrands, getLabels } from 'services/cerebroApi'

function* fetchCurrentPageDataSaga() {
  const { page: pageName } = getCurrentPage()
  const fetchingAction = fetchPageDataActions[pageName]

  if (fetchingAction) {
    yield put(fetchingAction())
  }
}

function* resetCurrentPagePaginationSaga() {
  const { page: pageName } = getCurrentPage()
  const paginationActions = get(
    updatePaginationActions,
    pageName,
    []
  ).map((paginationAction) => put(paginationAction({ current: 1 })))

  yield all(paginationActions)
}

function* setDisplayCurrencySaga(currencyCode) {
  yield call([numeral, 'locale'], currencyCode)
}

function* fetchCurrencySettingsSaga() {
  const userId = yield select(selectAuthDomainValue, ['username'])
  const key = {
    UserId: userId,
    Domain: `global-currency`,
  }

  const { Item } = yield call(getItemFromUserSettingsTable, key)
  const currencyCode = Item ? Item.currencyCode : null

  yield put(fetchCurrencySettingsSuccess(currencyCode))
  yield call(setDisplayCurrencySaga, currencyCode)
}

function* searchCampaignsSaga({ data: query, pageName }) {
  if (query.length > 1) {
    yield put(searchCampaignsRequest())
    yield call(cerebroApiSaga, searchCampaignsSuccess, getCampaigns, {
      limit: SEARCH_RESULTS_PER_QUERY,
      name__icontains: query,
      ...(pageName === BRAND_PAGE && {
        profile__in: yield select(selectUiDomainValue, [BRAND_PAGE, 'brandId']),
      }),
    })
  }
}

function* searchBrandsSaga(query) {
  if (query.length > 1) {
    yield put(searchBrandsRequest())
    yield call(cerebroApiSaga, searchBrandsSuccess, getBrands, {
      limit: SEARCH_RESULTS_PER_QUERY,
      brand_name__icontains: query,
    })
  }
}

/**
 * Fetch all labels for an organization
 */
export function* fetchOrganizationLabelsSaga() {
  yield call(cerebroApiSaga, fetchOrganizationLabelsSuccess, getLabels)
}

/**
 * Changes default currency code for the user
 */
export function* changeCurrencyCodeWorker() {
  const userId = yield select(selectAuthDomainValue, ['username'])
  const currencyCode = yield select(selectCurrencyCode)
  const item = {
    UserId: userId,
    Domain: `global-currency`,
    currencyCode,
  }

  yield call(setDisplayCurrencySaga, currencyCode)
  yield all([
    put(fetchCurrentPageData()),
    call(putItemToUserSettingsTable, item),
  ])
}

/**
 * Mounts the application
 */
export function* mountAppWorker() {
  yield all([
    // Fetch currency settings
    call(fetchCurrencySettingsSaga),
    call(fetchGlobalNotificationSaga),
  ])
}

/**
 * Fetches page data of current page
 */
export function* fetchCurrentPageDataWorker() {
  yield call(fetchCurrentPageDataSaga)
}

/**
 * Resets pagination of current page
 */
export function* resetCurrentPagePaginationWorker() {
  yield call(resetCurrentPagePaginationSaga)
}

/**
 * Fetches typeahead data for campaign filters
 */
export function* changeCampaignsFilterInputWorker(action) {
  // debounce by 500ms
  yield delay(500)
  try {
    yield call(searchCampaignsSaga, action.payload)
  } catch (error) {
    yield put(searchCampaignsFailure(error))
  }
}

/**
 * Fetches typeahead data for brands filters
 */
export function* changeBrandsFilterInputWorker(action) {
  // debounce by 500ms
  yield delay(500)
  try {
    yield call(searchBrandsSaga, action.payload)
  } catch (error) {
    yield put(searchBrandsFailure(error))
  }
}
