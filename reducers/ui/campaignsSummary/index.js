import { handleActions } from 'redux-actions'
import flow from 'lodash/fp/flow'
import set from 'lodash/fp/set'
import cloneDeep from 'lodash/cloneDeep'

import { FILTERS, FILTER_SETTINGS } from 'constants/reducerKeys'
import {
    FACT_TYPES,
    DATES,
    REGIONS,
    COUNTRIES,
    BRANDS,
    CAMPAIGNS,
    CAMPAIGN_STATES,
    CAMPAIGN_TARGETING_TYPES,
    CAMPAIGN_DAYPARTINGS,
    CAMPAIGN_NAME,
} from 'constants/filters'
import {
    METRIC_COLUMNS_ORDER,
    METRIC_COLUMNS_STATE,
} from 'configuration/tables'
import {
    // mounting
    mountCampaignsSummaryPageRequest,
    mountCampaignsSummaryPageSuccess,
    mountCampaignsSummaryPageFailure,
    unmountCampaignsSummaryPage,

    // page data
    fetchCampaignsSummaryPageDataRequest,
    fetchCampaignsSummaryPageDataSuccess,
    fetchCampaignsSummaryPageDataFailure,

    // treemap data
    fetchCampaignsSummaryPageTreemapRequest,
    fetchCampaignsSummaryPageTreemapSuccess,
    fetchCampaignsSummaryPageTreemapFailure,

    // table data
    fetchCampaignsSummaryPageTableRequest,
    fetchCampaignsSummaryPageTableSuccess,
    fetchCampaignsSummaryPageTableFailure,

    // table download
    downloadCampaignsSummaryPageTableSuccess,
    downloadCampaignsSummaryPageTableRequest,
    downloadCampaignsSummaryPageTableFailure,

    // table update
    updateCampaignsSummaryPageTableRequest,
    updateCampaignsSummaryPageTableSuccess,
    updateCampaignsSummaryPageTableFailure,

    // table delete
    deleteCampaignsSummaryPageTableRequest,
    deleteCampaignsSummaryPageTableSuccess,
    deleteCampaignsSummaryPageTableFailure,
} from 'actions/ui'

import {
    defaultTreemap,
    defaultDatesFilter,
    getDefaultTable,
    defaultFactTypes,
} from '../defaults'

const defaultTable = getDefaultTable({
    order: [
        'campaign.name',
        'campaign.targeting_type',
        'campaign.state',
        'campaign.budget',
        'campaign.start_date',
        'campaign.end_date',
        ...METRIC_COLUMNS_ORDER,
    ],
    displayState: {
        'campaign.name': true,
        'campaign.targeting_type': true,
        'campaign.state': true,
        'campaign.budget': true,
        'campaign.start_date': true,
        'campaign.end_date': true,
        ...METRIC_COLUMNS_STATE,
    },
})

export const defaultState = {
    [FILTERS]: {
        [FACT_TYPES]: defaultFactTypes,
        [DATES]: defaultDatesFilter,
        [REGIONS]: [],
        [COUNTRIES]: [],
        [BRANDS]: [],
        [CAMPAIGNS]: [],
        [CAMPAIGN_STATES]: [],
        [CAMPAIGN_TARGETING_TYPES]: [],
        [CAMPAIGN_DAYPARTINGS]: [],
        [CAMPAIGN_NAME]: null,
    },
    [FILTER_SETTINGS]: {
        anchored: [CAMPAIGN_NAME, DATES, FACT_TYPES],
        order: [
            REGIONS,
            COUNTRIES,
            BRANDS,
            CAMPAIGNS,
            CAMPAIGN_STATES,
            CAMPAIGN_TARGETING_TYPES,
            CAMPAIGN_DAYPARTINGS,
        ],
        displayState: {
            [REGIONS]: true,
            [COUNTRIES]: true,
            [BRANDS]: false,
            [CAMPAIGNS]: true,
            [CAMPAIGN_STATES]: true,
            [CAMPAIGN_TARGETING_TYPES]: false,
            [CAMPAIGN_DAYPARTINGS]: false,
        },
    },

    treemap: defaultTreemap,
    table: defaultTable,
    mounting: true,
    error: null,
    downloading: false,
}

export default handleActions(
    {
        // mounting
        [mountCampaignsSummaryPageRequest](state) {
            return set(['mounting'], true, state)
        },
        [mountCampaignsSummaryPageSuccess](state) {
            return set(['mounting'], false, state)
        },
        [mountCampaignsSummaryPageFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['mounting'], false),
                set(['error'], message)
            )(state)
        },
        [unmountCampaignsSummaryPage](state) {
            return flow(
                set(['treemap'], defaultTreemap),
                set(['table'], defaultTable)
            )(state)
        },

        // page data
        [fetchCampaignsSummaryPageDataRequest](state) {
            return flow(
                set(['treemap', 'loading'], true),
                set(['table', 'loading'], true)
            )(state)
        },
        [fetchCampaignsSummaryPageDataSuccess](state) {
            return flow(
                set(['treemap', 'loading'], false),
                set(['table', 'loading'], false)
            )(state)
        },
        [fetchCampaignsSummaryPageDataFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['treemap', 'loading'], false),
                set(['table', 'loading'], false),
                set(['error'], message)
            )(state)
        },

        // treemap data
        [fetchCampaignsSummaryPageTreemapRequest](state) {
            return set(['treemap', 'loading'], true, state)
        },
        [fetchCampaignsSummaryPageTreemapSuccess](state, action) {
            const { count, results } = action.payload
            return flow(
                set(['treemap', 'loading'], false),
                set(['treemap', 'data'], results),
                set(['treemap', 'pagination', 'total'], count)
            )(state)
        },
        [fetchCampaignsSummaryPageTreemapFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['treemap', 'loading'], false),
                set(['error'], message)
            )(state)
        },

        // table data
        [fetchCampaignsSummaryPageTableRequest](state) {
            return set(['table', 'loading'], true, state)
        },
        [fetchCampaignsSummaryPageTableSuccess](state, action) {
            const { count, results } = action.payload
            return flow(
                set(['table', 'loading'], false),
                set(['table', 'data'], results),
                set(['table', 'pagination', 'total'], count)
            )(state)
        },
        [fetchCampaignsSummaryPageTableFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['table', 'loading'], false),
                set(['error'], message)
            )(state)
        },

        // table download
        [downloadCampaignsSummaryPageTableSuccess](state) {
            return set(['downloading'], false, state)
        },
        [downloadCampaignsSummaryPageTableRequest](state) {
            return set(['downloading'], true, state)
        },
        [downloadCampaignsSummaryPageTableFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['downloading'], false),
                set(['error'], message)
            )(state)
        },

        // table update
        [updateCampaignsSummaryPageTableRequest](state) {
            return set(['table', 'updating'], true, state)
        },
        [updateCampaignsSummaryPageTableSuccess](state) {
            return set(['table', 'updating'], false, state)
        },
        [updateCampaignsSummaryPageTableFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['table', 'updating'], false),
                set(['error'], message)
            )(state)
        },

        // table delete
        [deleteCampaignsSummaryPageTableRequest](state) {
            return set(['table', 'deleting'], true, state)
        },
        [deleteCampaignsSummaryPageTableSuccess](state) {
            return set(['table', 'deleting'], false, state)
        },
        [deleteCampaignsSummaryPageTableFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['table', 'deleting'], false),
                set(['error'], message)
            )(state)
        },
    },
    cloneDeep(defaultState) // create clone, so the defaultState is not mutated
)
