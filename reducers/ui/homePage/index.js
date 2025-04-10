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
    AGGREGATION,
    DATES,
    FACT_TYPES,
    REGIONS,
    COUNTRIES,
    BRANDS,
} from 'constants/filters'
import {
    // mounting
    mountHomePageRequest,
    mountHomePageSuccess,
    mountHomePageFailure,
    unmountHomePage,

    // page data
    fetchHomePageDataRequest,
    fetchHomePageDataSuccess,
    fetchHomePageDataFailure,

    // aggregate data
    fetchHomePageAggregateSuccess,

    // timeseries data
    fetchHomePageSponsoredProductTimeseriesSuccess,
    fetchHomePageHeadlineSearchTimeseriesSuccess,

    // timeseries download
    downloadHomePageTimeseriesRequest,
    downloadHomePageTimeseriesSuccess,
    downloadHomePageTimeseriesFailure,
} from 'actions/ui'

import {
    defaultFactTypes,
    defaultAmsCharts,
    defaultAggregate,
    defaultTimeseries,
    defaultDatesFilter,
} from '../defaults'

export const defaultState = {
    [FILTERS]: {
        [AGGREGATION]: AGG_UNIT.DAY,
        [FACT_TYPES]: defaultFactTypes,
        [DATES]: defaultDatesFilter,
        [REGIONS]: [],
        [COUNTRIES]: [],
        [BRANDS]: [],
    },
    [FILTER_SETTINGS]: {
        anchored: [AGGREGATION, DATES, FACT_TYPES],
        order: [REGIONS, COUNTRIES, BRANDS],
        displayState: {
            [REGIONS]: true,
            [COUNTRIES]: true,
            [BRANDS]: true,
        },
    },
    [CHARTS]: defaultAmsCharts,

    aggregate: defaultAggregate,
    timeseries: defaultTimeseries,
    mounting: true,
    error: null,
    downloading: false,
}

export default handleActions(
    {
        // mounting
        [mountHomePageRequest](state) {
            return set(['mounting'], true, state)
        },
        [mountHomePageSuccess](state) {
            return set(['mounting'], false, state)
        },
        [mountHomePageFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['mounting'], false),
                set(['error'], message)
            )(state)
        },
        [unmountHomePage](state) {
            return flow(
                set(['aggregate'], defaultAggregate),
                set(['timeseries'], defaultTimeseries)
            )(state)
        },

        // page data
        [fetchHomePageDataRequest](state) {
            return flow(
                set(['aggregate', 'loading'], true),
                set(['timeseries', 'loading'], true)
            )(state)
        },
        [fetchHomePageDataSuccess](state) {
            return flow(
                set(['aggregate', 'loading'], false),
                set(['timeseries', 'loading'], false)
            )(state)
        },
        [fetchHomePageDataFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['aggregate', 'loading'], false),
                set(['timeseries', 'loading'], false),
                set(['error'], message)
            )(state)
        },

        // aggregate
        [fetchHomePageAggregateSuccess](state, action) {
            const results = action.payload
            return set(['aggregate', 'data'], results, state)
        },

        // timeseries
        [fetchHomePageSponsoredProductTimeseriesSuccess](state, action) {
            const results = action.payload
            return set(['timeseries', SPONSORED_PRODUCT], results, state)
        },
        [fetchHomePageHeadlineSearchTimeseriesSuccess](state, action) {
            const results = action.payload
            return set(['timeseries', HEADLINE_SEARCH], results, state)
        },

        // timeseries download
        [downloadHomePageTimeseriesRequest](state) {
            return set(['downloading'], true, state)
        },
        [downloadHomePageTimeseriesSuccess](state) {
            return set(['downloading'], false, state)
        },
        [downloadHomePageTimeseriesFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['downloading'], false),
                set(['error'], message)
            )(state)
        },
    },
    cloneDeep(defaultState) // create clone, so the defaultState is not mutated
)
