import { createAction } from 'redux-actions'

import {
    curryActionForPage,
    curryActionForPageTable,
    curryActionForPageTreemap,
    curryActionForPageChart,
} from 'helpers/curry'

// Filters
export const updatePageFilter = createAction('UPDATE_PAGE_FILTER')
export const resetPageFilters = createAction('RESET_PAGE_FILTERS')
export const updatePageFilterSettings = createAction(
    'UPDATE_PAGE_FILTER_SETTINGS'
)
export const fetchPageFilterSettingsSuccess = createAction(
    'FETCH_PAGE_FILTER_SETTINGS_SUCCESS'
)

export const updatePageFilterForPage = curryActionForPage(updatePageFilter)
export const resetPageFiltersForPage = curryActionForPage(resetPageFilters)
export const updatePageFilterSettingsForPage = curryActionForPage(
    updatePageFilterSettings
)
export const fetchPageFilterSettingsSuccessForPage = curryActionForPage(
    fetchPageFilterSettingsSuccess
)

// Chart
export const updateChartMetrics = createAction('UPDATE_CHART_METRICS')
export const updateChartSorter = createAction('UPDATE_CHART_SORTER')
export const updateChartSorterForPageChart = curryActionForPageChart(
    updateChartSorter
)

// Table
export const updateTablePagination = createAction('UPDATE_TABLE_PAGINATION')
export const updateTableSorter = createAction('UPDATE_TABLE_SORTER')
export const updateTableSettings = createAction('UPDATE_TABLE_SETTINGS')
export const fetchTableSettingsSuccess = createAction(
    'FETCH_TABLE_SETTINGS_SUCCESS'
)

export const updateTablePaginationForPageTable = curryActionForPageTable(
    updateTablePagination
)
export const updateTableSorterForPageTable = curryActionForPageTable(
    updateTableSorter
)
export const updateTableSettingsForPageTable = curryActionForPageTable(
    updateTableSettings
)
export const fetchTableSettingsSuccessForPageTable = curryActionForPageTable(
    fetchTableSettingsSuccess
)

// Treemap
export const updateTreemapPagination = createAction('UPDATE_TREEMAP_PAGINATION')
export const updateTreemapSorter = createAction('UPDATE_TREEMAP_SORTER')

export const updateTreemapPaginationForPageTreemap = curryActionForPageTreemap(
    updateTreemapPagination
)
export const updateTreemapSorterForPageTreemap = curryActionForPageTreemap(
    updateTreemapSorter
)
