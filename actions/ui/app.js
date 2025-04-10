import { createAction } from 'redux-actions'

import { curryActionForPage } from 'helpers/curry'

export const mountApp = createAction('MOUNT_APP')

export const fetchCurrentPageData = createAction('FETCH_CURRENT_PAGE_DATA')
export const resetCurrentPagePagination = createAction(
    'RESET_CURRENT_PAGE_PAGINATION'
)

export const changeCurrencyCode = createAction('CHANGE_CURRENCY_CODE')
export const fetchCurrencySettingsSuccess = createAction(
    'FETCH_CURRENCY_SETTINGS_SUCCESS'
)

// search campaigns
export const changeCampaignsFilterInput = createAction(
    'CHANGE_CAMPAIGNS_FILTER_INPUT'
)
export const changeCampaignsFilterInputForPage = curryActionForPage(
    changeCampaignsFilterInput
)
export const searchCampaignsRequest = createAction('SEARCH_CAMPAIGNS_REQUEST')
export const searchCampaignsSuccess = createAction('SEARCH_CAMPAIGNS_SUCCESS')
export const searchCampaignsFailure = createAction('SEARCH_CAMPAIGNS_FAILURE')

// search brands
export const changeBrandsFilterInput = createAction(
    'CHANGE_BRANDS_FILTER_INPUT'
)
export const searchBrandsRequest = createAction('SEARCH_BRANDS_REQUEST')
export const searchBrandsSuccess = createAction('SEARCH_BRANDS_SUCCESS')
export const searchBrandsFailure = createAction('SEARCH_BRANDS_FAILURE')

// organization labels
export const fetchOrganizationLabelsSuccess = createAction(
    'FETCH_ORGANIZATION_LABELS_SUCCESS'
)

export const setGlobalNotification = createAction('SET_GLOBAL_NOTIFICATION')
