import { handleActions } from 'redux-actions'
import flow from 'lodash/fp/flow'
import set from 'lodash/fp/set'
import cloneDeep from 'lodash/cloneDeep'

import {
    FILTERS,
    CHARTS,
    AGG_UNIT,
    FILTER_SETTINGS,
} from 'constants/reducerKeys'
import { SPONSORED_PRODUCT, HEADLINE_SEARCH } from 'constants/factTypes'
import { DATES, AGGREGATION } from 'constants/filters'
import {
    METRIC_COLUMNS_ORDER,
    METRIC_COLUMNS_STATE,
} from 'configuration/tables'
import {
    // mounting
    mountCampaignPageRequest,
    mountCampaignPageSuccess,
    mountCampaignPageFailure,
    unmountCampaignPage,

    // page data
    fetchCampaignPageDataRequest,
    fetchCampaignPageDataSuccess,
    fetchCampaignPageDataFailure,

    // toggle details
    toggleCampaignPageDetails,

    // campaign details
    updateCampaignPageCampaignDetailsRequest,
    updateCampaignPageCampaignDetailsSuccess,
    updateCampaignPageCampaignDetailsFailure,

    // dayparting
    fetchCampaignPageHourlyMultipliersSuccess,
    fetchCampaignPageHourlyMultipliersFailure,
    updateCampaignPageHourlyMultipliersSuccess,
    updateCampaignPageHourlyMultipliersFailure,

    // aggregate data
    fetchCampaignPageAggregateSuccess,

    // timeseries data
    fetchCampaignPageSponsoredProductTimeseriesSuccess,
    fetchCampaignPageHeadlineSearchTimeseriesSuccess,

    // timeseries download
    downloadCampaignPageTimeseriesRequest,
    downloadCampaignPageTimeseriesSuccess,
    downloadCampaignPageTimeseriesFailure,

    // keywords table data
    fetchCampaignPageKeywordsTableRequest,
    fetchCampaignPageKeywordsTableSuccess,
    fetchCampaignPageKeywordsTableFailure,

    // keywords table download
    downloadCampaignPageKeywordsTableRequest,
    downloadCampaignPageKeywordsTableSuccess,
    downloadCampaignPageKeywordsTableFailure,

    // keywords table attach keywords
    attachCampaignPageKeywordsTableKeywordsRequest,
    attachCampaignPageKeywordsTableKeywordsSuccess,
    attachCampaignPageKeywordsTableKeywordsFailure,

    // keywords table update keyword
    updateCampaignPageKeywordsTableKeywordRequest,
    updateCampaignPageKeywordsTableKeywordSuccess,
    updateCampaignPageKeywordsTableKeywordFailure,

    // keywords table delete keyword
    deleteCampaignPageKeywordsTableKeywordRequest,
    deleteCampaignPageKeywordsTableKeywordSuccess,
    deleteCampaignPageKeywordsTableKeywordFailure,

    // products table data
    fetchCampaignPageProductsTableRequest,
    fetchCampaignPageProductsTableSuccess,
    fetchCampaignPageProductsTableFailure,

    // products table download
    downloadCampaignPageProductsTableRequest,
    downloadCampaignPageProductsTableSuccess,
    downloadCampaignPageProductsTableFailure,

    // products table attach
    attachCampaignPageProductsTableProductsRequest,
    attachCampaignPageProductsTableProductsSuccess,
    attachCampaignPageProductsTableProductsFailure,

    // products table update
    updateCampaignPageProductsTableProductRequest,
    updateCampaignPageProductsTableProductSuccess,
    updateCampaignPageProductsTableProductFailure,

    // products table delete
    deleteCampaignPageProductsTableProductRequest,
    deleteCampaignPageProductsTableProductSuccess,
    deleteCampaignPageProductsTableProductFailure,
    fetchCampaignPageFeaturePermissionsSuccess,

    // labels
    addCampaignPageLabelsRequest,
    addCampaignPageLabelsSuccess,
    addCampaignPageLabelsFailure,
} from 'actions/ui'

import {
    defaultAmsCharts,
    defaultAggregate,
    defaultTimeseries,
    defaultDatesFilter,
    getDefaultTable,
} from '../defaults'

const defaultKeywordsTable = getDefaultTable({
    order: [
        'keyword.text',
        'keyword.match_type',
        'keyword.bid',
        'keyword.base_bid',
        'keyword.state',
        ...METRIC_COLUMNS_ORDER,
    ],
    displayState: {
        'keyword.text': true,
        'keyword.match_type': true,
        'keyword.bid': true,
        'keyword.base_bid': true,
        'keyword.state': true,
        ...METRIC_COLUMNS_STATE,
    },
})
const defaultProductsTable = getDefaultTable({
    order: [
        'product_metadata.title',
        'product_metadata.price',
        'product_ad.asin',
        'product_ad.sku',
        'product_ad.state',
        ...METRIC_COLUMNS_ORDER,
    ],
    displayState: {
        'product_metadata.title': true,
        'product_metadata.price': true,
        'product_ad.asin': true,
        'product_ad.sku': true,
        'product_ad.state': true,
        ...METRIC_COLUMNS_STATE,
    },
})

export const defaultState = {
    [FILTERS]: {
        [AGGREGATION]: AGG_UNIT.DAY,
        [DATES]: defaultDatesFilter,
    },
    [FILTER_SETTINGS]: {
        anchored: [AGGREGATION, DATES],
        order: [],
        displayState: {},
    },

    [CHARTS]: defaultAmsCharts,
    hourlyMultipliers: [],
    campaignId: null,
    showDetails: true,
    aggregate: defaultAggregate,
    timeseries: defaultTimeseries,
    keywordsTable: defaultKeywordsTable,
    productsTable: defaultProductsTable,
    mounting: true,
    error: null,
    downloading: false,
    campaignUpdating: false,
    featurePermissions: [],
    addingLabels: false,
}

export default handleActions(
    {
        // mounting
        [mountCampaignPageRequest](state, action) {
            const { campaignId } = action.payload
            return flow(
                set(['campaignId'], campaignId),
                set(['mounting'], true)
            )(state)
        },
        [mountCampaignPageSuccess](state) {
            return set(['mounting'], false, state)
        },
        [mountCampaignPageFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['mounting'], false),
                set(['error'], message)
            )(state)
        },
        [unmountCampaignPage](state) {
            return flow(
                set(['hourlyMultipliers'], []),
                set(['brandId'], null),
                set(['campaignId'], null),
                set(['aggregate'], defaultAggregate),
                set(['timeseries'], defaultTimeseries),
                set(['keywordsTable'], defaultKeywordsTable),
                set(['productsTable'], defaultProductsTable)
            )(state)
        },

        // page data
        [fetchCampaignPageDataRequest](state) {
            return flow(
                set(['aggregate', 'loading'], true),
                set(['timeseries', 'loading'], true),
                set(['keywordsTable', 'loading'], true),
                set(['productsTable', 'loading'], true)
            )(state)
        },
        [fetchCampaignPageDataSuccess](state) {
            return flow(
                set(['aggregate', 'loading'], false),
                set(['timeseries', 'loading'], false),
                set(['keywordsTable', 'loading'], false),
                set(['productsTable', 'loading'], false)
            )(state)
        },
        [fetchCampaignPageDataFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['aggregate', 'loading'], false),
                set(['timeseries', 'loading'], false),
                set(['keywordsTable', 'loading'], false),
                set(['productsTable', 'loading'], false),
                set(['error'], message)
            )(state)
        },

        // toggle campaign details
        [toggleCampaignPageDetails](state) {
            return set(['showDetails'], !state.showDetails, state)
        },

        // campaign details
        [updateCampaignPageCampaignDetailsRequest](state) {
            return set(['campaignUpdating'], true, state)
        },
        [updateCampaignPageCampaignDetailsSuccess](state) {
            return set(['campaignUpdating'], false, state)
        },
        [updateCampaignPageCampaignDetailsFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['campaignUpdating'], false),
                set(['error'], message)
            )(state)
        },

        // dayparting multipliers
        [fetchCampaignPageHourlyMultipliersSuccess](state, action) {
            const data = action.payload
            return set(['hourlyMultipliers'], data, state)
        },
        [fetchCampaignPageHourlyMultipliersFailure](state, action) {
            const { message } = action.payload
            return set(['error'], message, state)
        },
        [updateCampaignPageHourlyMultipliersSuccess](state, action) {
            const data = action.payload
            return set(['hourlyMultipliers'], data, state)
        },
        [updateCampaignPageHourlyMultipliersFailure](state, action) {
            const { message } = action.payload
            return set(['error'], message, state)
        },

        // aggregate
        [fetchCampaignPageAggregateSuccess](state, action) {
            const results = action.payload
            return set(['aggregate', 'data'], results, state)
        },

        // timeseries data
        [fetchCampaignPageSponsoredProductTimeseriesSuccess](state, action) {
            const results = action.payload
            return set(['timeseries', SPONSORED_PRODUCT], results, state)
        },
        [fetchCampaignPageHeadlineSearchTimeseriesSuccess](state, action) {
            const results = action.payload
            return set(['timeseries', HEADLINE_SEARCH], results, state)
        },

        // timeseries download
        [downloadCampaignPageTimeseriesRequest](state) {
            return set(['downloading'], true, state)
        },
        [downloadCampaignPageTimeseriesSuccess](state) {
            return set(['downloading'], false, state)
        },
        [downloadCampaignPageTimeseriesFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['downloading'], false),
                set(['error'], message)
            )(state)
        },

        // keywords table data
        [fetchCampaignPageKeywordsTableRequest](state) {
            return set(['keywordsTable', 'loading'], true, state)
        },
        [fetchCampaignPageKeywordsTableSuccess](state, action) {
            const { count, results } = action.payload
            return flow(
                set(['keywordsTable', 'loading'], false),
                set(['keywordsTable', 'data'], results),
                set(['keywordsTable', 'pagination', 'total'], count)
            )(state)
        },
        [fetchCampaignPageKeywordsTableFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['keywordsTable', 'loading'], false),
                set(['error'], message)
            )(state)
        },

        // keywords table download
        [downloadCampaignPageKeywordsTableRequest](state) {
            return set(['downloading'], true, state)
        },
        [downloadCampaignPageKeywordsTableSuccess](state) {
            return set(['downloading'], false, state)
        },
        [downloadCampaignPageKeywordsTableFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['downloading'], false),
                set(['error'], message)
            )(state)
        },

        // keywords table keywords attach
        [attachCampaignPageKeywordsTableKeywordsRequest](state) {
            return set(['keywordsTable', 'attaching'], true, state)
        },
        [attachCampaignPageKeywordsTableKeywordsSuccess](state) {
            return set(['keywordsTable', 'attaching'], false, state)
        },
        [attachCampaignPageKeywordsTableKeywordsFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['keywordsTable', 'attaching'], false),
                set(['error'], message)
            )(state)
        },

        // keywords table keyword update
        [updateCampaignPageKeywordsTableKeywordRequest](state) {
            return set(['keywordsTable', 'updating'], true, state)
        },
        [updateCampaignPageKeywordsTableKeywordSuccess](state) {
            return set(['keywordsTable', 'updating'], false, state)
        },
        [updateCampaignPageKeywordsTableKeywordFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['keywordsTable', 'updating'], false),
                set(['error'], message)
            )(state)
        },

        // keywords table keyword delete
        [deleteCampaignPageKeywordsTableKeywordRequest](state) {
            return set(['keywordsTable', 'deleting'], true, state)
        },
        [deleteCampaignPageKeywordsTableKeywordSuccess](state) {
            return set(['keywordsTable', 'deleting'], false, state)
        },
        [deleteCampaignPageKeywordsTableKeywordFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['keywordsTable', 'deleting'], false),
                set(['error'], message)
            )(state)
        },

        // products table data
        [fetchCampaignPageProductsTableRequest](state) {
            return set(['productsTable', 'loading'], true, state)
        },
        [fetchCampaignPageProductsTableSuccess](state, action) {
            const { count, results } = action.payload
            return flow(
                set(['productsTable', 'loading'], false),
                set(['productsTable', 'data'], results),
                set(['productsTable', 'pagination', 'total'], count)
            )(state)
        },
        [fetchCampaignPageProductsTableFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['productsTable', 'loading'], false),
                set(['error'], message)
            )
        },

        // products table download
        [downloadCampaignPageProductsTableRequest](state) {
            return set(['downloading'], true, state)
        },
        [downloadCampaignPageProductsTableSuccess](state) {
            return set(['downloading'], false, state)
        },
        [downloadCampaignPageProductsTableFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['downloading'], false),
                set(['error'], message)
            )(state)
        },

        // products table products attach
        [attachCampaignPageProductsTableProductsRequest](state) {
            return set(['productsTable', 'attaching'], true, state)
        },
        [attachCampaignPageProductsTableProductsSuccess](state) {
            return set(['productsTable', 'attaching'], false, state)
        },
        [attachCampaignPageProductsTableProductsFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['productsTable', 'attaching'], false),
                set(['error'], message)
            )(state)
        },

        // products table product update
        [updateCampaignPageProductsTableProductRequest](state) {
            return set(['productsTable', 'updating'], true, state)
        },
        [updateCampaignPageProductsTableProductSuccess](state) {
            return set(['productsTable', 'updating'], false, state)
        },
        [updateCampaignPageProductsTableProductFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['productsTable', 'updating'], false),
                set(['error'], message)
            )(state)
        },

        // products table product delete
        [deleteCampaignPageProductsTableProductRequest](state) {
            return set(['productsTable', 'deleting'], true, state)
        },
        [deleteCampaignPageProductsTableProductSuccess](state) {
            return set(['productsTable', 'deleting'], false, state)
        },
        [deleteCampaignPageProductsTableProductFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['productsTable', 'deleting'], false),
                set(['error'], message)
            )(state)
        },

        // feature permissions
        [fetchCampaignPageFeaturePermissionsSuccess](state, action) {
            return set(['featurePermissions'], action.payload, state)
        },

        // add labels
        [addCampaignPageLabelsRequest](state) {
            return set(['addingLabels'], true, state)
        },
        [addCampaignPageLabelsSuccess](state) {
            return set(['addingLabels'], false, state)
        },
        [addCampaignPageLabelsFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['addingLabels'], false),
                set(['error'], message)
            )(state)
        },
    },
    cloneDeep(defaultState) // create clone, so the defaultState is not mutated
)
