import { getCurrentPage } from './pages'

/**
 * Currys action creator to inject pageName in payload
 *
 * If pageName is not provided, assumes current page
 *
 * @param {function} action - Action creator
 */
export const curryActionForPage = action => pageName => data =>
    action({
        pageName: pageName || getCurrentPage().page,
        data,
    })

/**
 * Currys action creator to inject pageName and tableName in payload
 *
 * If pageName is not provided, assumes current page
 *
 * @param {function} action - Action creator
 */
export const curryActionForPageTable = action => ({
    pageName,
    tableName,
} = {}) => data =>
    action({
        pageName: pageName || getCurrentPage().page,
        tableName: tableName || 'table',
        data,
    })

/**
 * Currys action creator to inject pageName and treemapName in payload
 *
 * If pageName is not provided, assumes current page
 *
 * @param {function} action - Action creator
 */
export const curryActionForPageTreemap = action => ({
    pageName,
    treemapName,
} = {}) => data =>
    action({
        pageName: pageName || getCurrentPage().page,
        treemapName: treemapName || 'treemap',
        data,
    })

/**
 * Currys action creator to inject pageName and chartName in payload
 *
 * If pageName is not provided, assumes current page
 *
 * @param {function} action - Action creator
 */
export const curryActionForPageChart = action => ({
    pageName,
    chartName,
} = {}) => data =>
    action({
        pageName: pageName || getCurrentPage().page,
        chartName: chartName || 'sovChart',
        data,
    })
