import { createAction } from 'redux-actions'

// mounting
export const mountCampaignsSummaryPageRequest = createAction(
    'MOUNT_CAMPAIGNS_SUMMARY_PAGE_REQUEST'
)
export const mountCampaignsSummaryPageSuccess = createAction(
    'MOUNT_CAMPAIGNS_SUMMARY_PAGE_SUCCESS'
)
export const mountCampaignsSummaryPageFailure = createAction(
    'MOUNT_CAMPAIGNS_SUMMARY_PAGE_FAILURE'
)
export const unmountCampaignsSummaryPage = createAction(
    'UNMOUNT_CAMPAIGNS_SUMMARY_PAGE'
)

// page data
export const fetchCampaignsSummaryPageDataRequest = createAction(
    'FETCH_CAMPAIGNS_SUMMARY_PAGE_DATA_REQUEST'
)
export const fetchCampaignsSummaryPageDataSuccess = createAction(
    'FETCH_CAMPAIGNS_SUMMARY_PAGE_DATA_SUCCESS'
)
export const fetchCampaignsSummaryPageDataFailure = createAction(
    'FETCH_CAMPAIGNS_SUMMARY_PAGE_DATA_FAILURE'
)

// treemap data
export const fetchCampaignsSummaryPageTreemapRequest = createAction(
    'FETCH_CAMPAIGNS_SUMMARY_PAGE_TREEMAP_REQUEST'
)
export const fetchCampaignsSummaryPageTreemapSuccess = createAction(
    'FETCH_CAMPAIGNS_SUMMARY_PAGE_TREEMAP_SUCCESS'
)
export const fetchCampaignsSummaryPageTreemapFailure = createAction(
    'FETCH_CAMPAIGNS_SUMMARY_PAGE_TREEMAP_FAILURE'
)

// table data
export const fetchCampaignsSummaryPageTableRequest = createAction(
    'FETCH_CAMPAIGNS_SUMMARY_PAGE_TABLE_REQUEST'
)
export const fetchCampaignsSummaryPageTableSuccess = createAction(
    'FETCH_CAMPAIGNS_SUMMARY_PAGE_TABLE_SUCCESS'
)
export const fetchCampaignsSummaryPageTableFailure = createAction(
    'FETCH_CAMPAIGNS_SUMMARY_PAGE_TABLE_FAILURE'
)

// table download
export const downloadCampaignsSummaryPageTableRequest = createAction(
    'DOWNLOAD_CAMPAIGNS_SUMMARY_PAGE_TABLE_REQUEST'
)
export const downloadCampaignsSummaryPageTableSuccess = createAction(
    'DOWNLOAD_CAMPAIGNS_SUMMARY_PAGE_TABLE_SUCCESS'
)
export const downloadCampaignsSummaryPageTableFailure = createAction(
    'DOWNLOAD_CAMPAIGNS_SUMMARY_PAGE_TABLE_FAILURE'
)

// table update
export const updateCampaignsSummaryPageTableRequest = createAction(
    'UPDATE_CAMPAIGNS_SUMMARY_PAGE_TABLE_REQUEST'
)
export const updateCampaignsSummaryPageTableSuccess = createAction(
    'UPDATE_CAMPAIGNS_SUMMARY_PAGE_TABLE_SUCCESS'
)
export const updateCampaignsSummaryPageTableFailure = createAction(
    'UPDATE_CAMPAIGNS_SUMMARY_PAGE_TABLE_FAILURE'
)

// table delete
export const deleteCampaignsSummaryPageTableRequest = createAction(
    'DELETE_CAMPAIGNS_SUMMARY_PAGE_TABLE_REQUEST'
)
export const deleteCampaignsSummaryPageTableSuccess = createAction(
    'DELETE_CAMPAIGNS_SUMMARY_PAGE_TABLE_SUCCESS'
)
export const deleteCampaignsSummaryPageTableFailure = createAction(
    'DELETE_CAMPAIGNS_SUMMARY_PAGE_TABLE_FAILURE'
)
