import { handleActions } from 'redux-actions'
import flow from 'lodash/fp/flow'
import set from 'lodash/fp/set'
import cloneDeep from 'lodash/cloneDeep'

import {
    FILTERS,
    FILTER_SETTINGS,
    CHARTS,
    AGG_UNIT,
} from 'constants/reducerKeys'
import { SPONSORED_PRODUCT, HEADLINE_SEARCH } from 'constants/factTypes'
import {
    METRIC_COLUMNS_ORDER,
    METRIC_COLUMNS_STATE,
} from 'configuration/tables'
import {
    DATES,
    CAMPAIGNS,
    CAMPAIGN_BUDGET,
    CAMPAIGN_STATES,
    CAMPAIGN_TARGETING_TYPES,
    CAMPAIGN_DAYPARTINGS,
    AGGREGATION,
    FACT_TYPES,
} from 'constants/filters'
import {
    // mounting
    mountBrandPageRequest,
    mountBrandPageSuccess,
    mountBrandPageFailure,
    unmountBrandPage,

    // page data
    fetchBrandPageDataRequest,
    fetchBrandPageDataSuccess,
    fetchBrandPageDataFailure,

    // toggle details
    toggleBrandPageDetails,

    // aggregate data
    fetchBrandPageAggregateSuccess,

    // timeseries data
    fetchBrandPageSponsoredProductTimeseriesSuccess,
    fetchBrandPageHeadlineSearchTimeseriesSuccess,

    // timeseries download
    downloadBrandPageTimeseriesRequest,
    downloadBrandPageTimeseriesSuccess,
    downloadBrandPageTimeseriesFailure,

    // treemap data
    fetchBrandPageTreemapRequest,
    fetchBrandPageTreemapSuccess,
    fetchBrandPageTreemapFailure,

    // table data
    fetchBrandPageTableRequest,
    fetchBrandPageTableSuccess,
    fetchBrandPageTableFailure,

    // table download
    downloadBrandPageTableRequest,
    downloadBrandPageTableSuccess,
    downloadBrandPageTableFailure,

    // table update
    updateBrandPageTableRequest,
    updateBrandPageTableSuccess,
    updateBrandPageTableFailure,

    // table delete
    deleteBrandPageTableRequest,
    deleteBrandPageTableSuccess,
    deleteBrandPageTableFailure,

    // labels
    addBrandPageLabelsRequest,
    addBrandPageLabelsSuccess,
    addBrandPageLabelsFailure,
} from 'actions/ui'

import {
    defaultAmsCharts,
    defaultFactTypes,
    defaultAggregate,
    defaultTimeseries,
    defaultTreemap,
    defaultDatesFilter,
    defaultNumberRange,
    getDefaultTable,
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
        [AGGREGATION]: AGG_UNIT.DAY,
        [DATES]: defaultDatesFilter,
        [FACT_TYPES]: defaultFactTypes,
        [CAMPAIGNS]: [],
        [CAMPAIGN_BUDGET]: defaultNumberRange,
        [CAMPAIGN_STATES]: [],
        [CAMPAIGN_TARGETING_TYPES]: [],
        [CAMPAIGN_DAYPARTINGS]: [],
    },
    [FILTER_SETTINGS]: {
        anchored: [AGGREGATION, DATES, FACT_TYPES],
        order: [
            CAMPAIGNS,
            CAMPAIGN_STATES,
            CAMPAIGN_BUDGET,
            CAMPAIGN_TARGETING_TYPES,
            CAMPAIGN_DAYPARTINGS,
        ],
        displayState: {
            [CAMPAIGNS]: true,
            [CAMPAIGN_STATES]: true,
            [CAMPAIGN_BUDGET]: false,
            [CAMPAIGN_TARGETING_TYPES]: false,
            [CAMPAIGN_DAYPARTINGS]: false,
        },
    },
    [CHARTS]: defaultAmsCharts,

    brandId: null,
    showDetails: false,
    aggregate: defaultAggregate,
    timeseries: defaultTimeseries,
    treemap: defaultTreemap,
    table: defaultTable,
    mounting: true,
    error: null,
    downloading: false,
    addingLabels: false,
}

export default handleActions(
    {
        // mounting
        [mountBrandPageRequest](state, action) {
            const { brandId } = action.payload
            return flow(
                set(['brandId'], brandId),
                set(['mounting'], true)
            )(state)
        },
        [mountBrandPageSuccess](state) {
            return set(['mounting'], false, state)
        },
        [mountBrandPageFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['mounting'], false),
                set(['error'], message)
            )(state)
        },
        [unmountBrandPage](state) {
            return flow(
                set(['brandId'], null),
                set(['aggregate'], defaultAggregate),
                set(['timeseries'], defaultTimeseries),
                set(['treemap'], defaultTreemap),
                set(['table'], defaultTable)
            )(state)
        },

        // page data
        [fetchBrandPageDataRequest](state) {
            return flow(
                set(['aggregate', 'loading'], true),
                set(['timeseries', 'loading'], true),
                set(['treemap', 'loading'], true),
                set(['table', 'loading'], true)
            )(state)
        },
        [fetchBrandPageDataSuccess](state) {
            return flow(
                set(['aggregate', 'loading'], false),
                set(['timeseries', 'loading'], false),
                set(['treemap', 'loading'], false),
                set(['table', 'loading'], false)
            )(state)
        },
        [fetchBrandPageDataFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['aggregate', 'loading'], false),
                set(['timeseries', 'loading'], false),
                set(['treemap', 'loading'], false),
                set(['table', 'loading'], false),
                set(['error'], message)
            )(state)
        },

        // toggle brand details
        [toggleBrandPageDetails](state) {
            return set(['showDetails'], !state.showDetails, state)
        },

        // aggregate
        [fetchBrandPageAggregateSuccess](state, action) {
            const results = action.payload
            return set(['aggregate', 'data'], results, state)
        },

        // timeseries data
        [fetchBrandPageSponsoredProductTimeseriesSuccess](state, action) {
            const results = action.payload
            return set(['timeseries', SPONSORED_PRODUCT], results, state)
        },
        [fetchBrandPageHeadlineSearchTimeseriesSuccess](state, action) {
            const results = action.payload
            return set(['timeseries', HEADLINE_SEARCH], results, state)
        },

        // timeseries download
        [downloadBrandPageTimeseriesRequest](state) {
            return set(['downloading'], true, state)
        },
        [downloadBrandPageTimeseriesSuccess](state) {
            return set(['downloading'], false, state)
        },
        [downloadBrandPageTimeseriesFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['downloading'], false),
                set(['error'], message)
            )(state)
        },

        // treemap data
        [fetchBrandPageTreemapRequest](state) {
            return set(['treemap', 'loading'], true, state)
        },
        [fetchBrandPageTreemapSuccess](state, action) {
            const { count, results } = action.payload
            return flow(
                set(['treemap', 'data'], results),
                set(['treemap', 'loading'], false),
                set(['treemap', 'pagination', 'total'], count)
            )(state)
        },
        [fetchBrandPageTreemapFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['treemap', 'loading'], false),
                set(['error'], message)
            )(state)
        },

        // table data
        [fetchBrandPageTableRequest](state) {
            return set(['table', 'loading'], true, state)
        },
        [fetchBrandPageTableSuccess](state, action) {
            const { count, results } = action.payload
            const { brandId } = state
            const withBrandId = results.map(record => ({
                ...record,
                profile: {
                    id: brandId,
                },
            }))
            return flow(
                set(['table', 'loading'], false),
                set(['table', 'data'], withBrandId),
                set(['table', 'pagination', 'total'], count)
            )(state)
        },
        [fetchBrandPageTableFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['table', 'loading'], false),
                set(['error'], message)
            )(state)
        },

        // table download
        [downloadBrandPageTableRequest](state) {
            return set(['downloading'], true, state)
        },
        [downloadBrandPageTableSuccess](state) {
            return set(['downloading'], false, state)
        },
        [downloadBrandPageTableFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['downloading'], false),
                set(['error'], message)
            )(state)
        },

        // table update
        [updateBrandPageTableRequest](state) {
            return set(['table', 'updating'], true, state)
        },
        [updateBrandPageTableSuccess](state) {
            return set(['table', 'updating'], false, state)
        },
        [updateBrandPageTableFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['table', 'updating'], false),
                set(['error'], message)
            )(state)
        },

        // table delete
        [deleteBrandPageTableRequest](state) {
            return set(['table', 'deleting'], true, state)
        },
        [deleteBrandPageTableSuccess](state) {
            return set(['table', 'deleting'], false, state)
        },
        [deleteBrandPageTableFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['table', 'deleting'], false),
                set(['error'], message)
            )(state)
        },

        // add labels
        [addBrandPageLabelsRequest](state) {
            return set(['addingLabels'], true, state)
        },
        [addBrandPageLabelsSuccess](state) {
            return set(['addingLabels'], false, state)
        },
        [addBrandPageLabelsFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['addingLabels'], false),
                set(['error'], message)
            )(state)
        },
    },
    cloneDeep(defaultState) // create clone, so the defaultState is not mutated
)
