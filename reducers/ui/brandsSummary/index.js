import { handleActions } from 'redux-actions'
import flow from 'lodash/fp/flow'
import set from 'lodash/fp/set'
import cloneDeep from 'lodash/cloneDeep'

import { FILTERS, FILTER_SETTINGS } from 'constants/reducerKeys'
import {
    DATES,
    COUNTRIES,
    REGIONS,
    BRANDS,
    FACT_TYPES,
} from 'constants/filters'
import {
    METRIC_COLUMNS_ORDER,
    METRIC_COLUMNS_STATE,
} from 'configuration/tables'
import {
    // mounting
    mountBrandsSummaryPageRequest,
    mountBrandsSummaryPageSuccess,
    mountBrandsSummaryPageFailure,
    unmountBrandsSummaryPage,

    // page data
    fetchBrandsSummaryPageDataRequest,
    fetchBrandsSummaryPageDataSuccess,
    fetchBrandsSummaryPageDataFailure,

    // treemap data
    fetchBrandsSummaryPageTreemapRequest,
    fetchBrandsSummaryPageTreemapSuccess,
    fetchBrandsSummaryPageTreemapFailure,

    // table data
    fetchBrandsSummaryPageTableRequest,
    fetchBrandsSummaryPageTableSuccess,
    fetchBrandsSummaryPageTableFailure,

    // table download
    downloadBrandsSummaryPageTableRequest,
    downloadBrandsSummaryPageTableSuccess,
    downloadBrandsSummaryPageTableFailure,
} from 'actions/ui'

import {
    defaultFactTypes,
    defaultTreemap,
    defaultDatesFilter,
    getDefaultTable,
} from '../defaults'

const defaultTable = getDefaultTable({
    order: [
        'profile.brand_name',
        'profile.country_code',
        'profile.currency_code',
        'profile.region',
        'profile.timezone',
        ...METRIC_COLUMNS_ORDER,
    ],
    displayState: {
        'profile.brand_name': true,
        'profile.country_code': true,
        'profile.currency_code': true,
        'profile.region': true,
        'profile.timezone': true,
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
    },
    [FILTER_SETTINGS]: {
        anchored: [DATES, FACT_TYPES],
        order: [REGIONS, COUNTRIES, BRANDS],
        displayState: {
            [REGIONS]: true,
            [COUNTRIES]: true,
            [BRANDS]: true,
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
        [mountBrandsSummaryPageRequest](state) {
            return set(['mounting'], true, state)
        },
        [mountBrandsSummaryPageSuccess](state) {
            return set(['mounting'], false, state)
        },
        [mountBrandsSummaryPageFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['mounting'], false),
                set(['error'], message)
            )(state)
        },
        [unmountBrandsSummaryPage](state) {
            return flow(
                set(['treemap'], defaultTreemap),
                set(['table'], defaultTable)
            )(state)
        },

        // page data
        [fetchBrandsSummaryPageDataRequest](state) {
            return flow(
                set(['treemap', 'loading'], true),
                set(['table', 'loading'], true)
            )(state)
        },
        [fetchBrandsSummaryPageDataSuccess](state) {
            return flow(
                set(['treemap', 'loading'], false),
                set(['table', 'loading'], false)
            )(state)
        },
        [fetchBrandsSummaryPageDataFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['treemap', 'loading'], false),
                set(['table', 'loading'], false),
                set(['error'], message)
            )(state)
        },

        // treemap data
        [fetchBrandsSummaryPageTreemapRequest](state) {
            return set(['treemap', 'loading'], true, state)
        },
        [fetchBrandsSummaryPageTreemapSuccess](state, action) {
            const { count, results } = action.payload
            return flow(
                set(['treemap', 'loading'], false),
                set(['treemap', 'data'], results),
                set(['treemap', 'pagination', 'total'], count)
            )(state)
        },
        [fetchBrandsSummaryPageTreemapFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['treemap', 'loading'], false),
                set(['error'], message)
            )(state)
        },

        // table data
        [fetchBrandsSummaryPageTableRequest](state) {
            return set(['table', 'loading'], true, state)
        },
        [fetchBrandsSummaryPageTableSuccess](state, action) {
            const { count, results } = action.payload
            return flow(
                set(['table', 'loading'], false),
                set(['table', 'data'], results),
                set(['table', 'pagination', 'total'], count)
            )(state)
        },
        [fetchBrandsSummaryPageTableFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['table', 'loading'], false),
                set(['error'], message)
            )(state)
        },

        // table download
        [downloadBrandsSummaryPageTableRequest](state) {
            return set(['downloading'], true, state)
        },
        [downloadBrandsSummaryPageTableSuccess](state) {
            return set(['downloading'], false, state)
        },
        [downloadBrandsSummaryPageTableFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['downloading'], false),
                set(['error'], message)
            )(state)
        },
    },
    cloneDeep(defaultState) // create clone, so the defaultState is not mutated
)
