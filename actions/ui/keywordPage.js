import { createAction } from 'redux-actions'

// mounting
export const mountKeywordPageRequest = createAction(
    'MOUNT_KEYWORD_PAGE_REQUEST'
)
export const mountKeywordPageSuccess = createAction(
    'MOUNT_KEYWORD_PAGE_SUCCESS'
)
export const mountKeywordPageFailure = createAction(
    'MOUNT_KEYWORD_PAGE_FAILURE'
)
export const unmountKeywordPage = createAction('UNMOUNT_KEYWORD_PAGE')

// page data
export const fetchKeywordPageDataRequest = createAction(
    'FETCH_KEYWORD_PAGE_DATA_REQUEST'
)
export const fetchKeywordPageDataSuccess = createAction(
    'FETCH_KEYWORD_PAGE_DATA_SUCCESS'
)
export const fetchKeywordPageDataFailure = createAction(
    'FETCH_KEYWORD_PAGE_DATA_FAILURE'
)

// toggle keyword details
export const toggleKeywordPageDetails = createAction(
    'TOGGLE_KEYWORD_PAGE_DETAILS'
)

// update keyword details
export const updateKeywordPageKeywordDetailsRequest = createAction(
    'UPDATE_KEYWORD_PAGE_KEYWORD_DETAILS_REQUEST'
)
export const updateKeywordPageKeywordDetailsSuccess = createAction(
    'UPDATE_KEYWORD_PAGE_KEYWORD_DETAILS_SUCCESS'
)
export const updateKeywordPageKeywordDetailsFailure = createAction(
    'UPDATE_KEYWORD_PAGE_KEYWORD_DETAILS_FAILURE'
)

// aggregate data
export const fetchKeywordPageAggregateSuccess = createAction(
    'FETCH_KEYWORD_PAGE_AGGREGATE_SUCCESS'
)

// timeseries data
export const fetchKeywordPageSponsoredProductTimeseriesSuccess = createAction(
    'FETCH_KEYWORD_PAGE_SPONSORED_PRODUCT_TIMESERIES_SUCCESS'
)
export const fetchKeywordPageHeadlineSearchTimeseriesSuccess = createAction(
    'FETCH_KEYWORD_PAGE_HEADLINE_SEARCH_TIMESERIES_SUCCESS'
)

// timeseries download
export const downloadKeywordPageTimeseriesRequest = createAction(
    'DOWNLOAD_KEYWORD_PAGE_TIMESERIES_REQUEST'
)
export const downloadKeywordPageTimeseriesSuccess = createAction(
    'DOWNLOAD_KEYWORD_PAGE_TIMESERIES_SUCCESS'
)
export const downloadKeywordPageTimeseriesFailure = createAction(
    'DOWNLOAD_KEYWORD_PAGE_TIMESERIES_FAILURE'
)
