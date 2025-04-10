import { createAction } from 'redux-actions'

// mounting
export const mountHomePageRequest = createAction('MOUNT_HOME_PAGE_REQUEST')
export const mountHomePageSuccess = createAction('MOUNT_HOME_PAGE_SUCCESS')
export const mountHomePageFailure = createAction('MOUNT_HOME_PAGE_FAILURE')
export const unmountHomePage = createAction('UNMOUNT_HOME_PAGE')

// page data
export const fetchHomePageDataRequest = createAction(
    'FETCH_HOME_PAGE_DATA_REQUEST'
)
export const fetchHomePageDataSuccess = createAction(
    'FETCH_HOME_PAGE_DATA_SUCCESS'
)
export const fetchHomePageDataFailure = createAction(
    'FETCH_HOME_PAGE_DATA_FAILURE'
)

// aggregate data
export const fetchHomePageAggregateSuccess = createAction(
    'FETCH_HOME_PAGE_AGGREGATE_SUCCESS'
)

// timeseries data
export const fetchHomePageSponsoredProductTimeseriesSuccess = createAction(
    'FETCH_HOME_PAGE_SPONSORED_PRODUCT_TIMESERIES_SUCCESS'
)
export const fetchHomePageHeadlineSearchTimeseriesSuccess = createAction(
    'FETCH_HOME_PAGE_HEADLINE_SEARCH_TIMESERIES_SUCCESS'
)

// timeseries download
export const downloadHomePageTimeseriesRequest = createAction(
    'DOWNLOAD_HOME_PAGE_TIMESERIES_REQUEST'
)
export const downloadHomePageTimeseriesSuccess = createAction(
    'DOWNLOAD_HOME_PAGE_TIMESERIES_SUCCESS'
)
export const downloadHomePageTimeseriesFailure = createAction(
    'DOWNLOAD_HOME_PAGE_TIMESERIES_FAILURE'
)
