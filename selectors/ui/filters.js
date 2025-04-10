import createCachedSelector from 're-reselect'
import get from 'lodash/get'
import pickBy from 'lodash/pickBy'

import { FILTERS, FILTER_SETTINGS } from 'constants/reducerKeys'
import { AGGREGATION } from 'constants/filters'

import { selectDomainState } from './ui'

export const selectPageFilters = createCachedSelector(
    selectDomainState,
    (state, pageName) => pageName,
    (uiState, pageName) => get(uiState, [pageName, FILTERS], {})
)((state, pageName) => pageName)

export const selectPageFilterSettings = createCachedSelector(
    selectDomainState,
    (state, pageName) => pageName,
    (uiState, pageName) => get(uiState, [pageName, FILTER_SETTINGS], {})
)((state, pageName) => pageName)

export const selectVisiblePageFilters = createCachedSelector(
    (state, pageName) => selectPageFilters(state, pageName),
    (state, pageName) => selectPageFilterSettings(state, pageName),
    (filters, { anchored = [], displayState }) =>
        pickBy(
            filters,
            (value, key) => anchored.includes(key) || displayState[key]
        )
)((state, pageName) => pageName)

export const selectPageAggregation = createCachedSelector(
    selectDomainState,
    (state, pageName) => pageName,
    (domainState, pageName) =>
        get(domainState, [pageName, FILTERS, AGGREGATION])
)((state, pageName) => pageName)
