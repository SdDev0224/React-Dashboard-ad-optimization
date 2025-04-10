import { matchPath } from 'react-router-dom'
import find from 'lodash/find'
import isNull from 'lodash/isNull'
import get from 'lodash/get'
import includes from 'lodash/includes'

import { PAGES_AND_PATHS } from 'configuration/pages'
import history from 'utilities/history'
import { PROFILE_PAGE } from 'constants/pages'

export const getPath = page => get(find(PAGES_AND_PATHS, { page }), 'path')

export const getPage = (path, exact = true) => {
    let match = null
    const pageAndPath = find(PAGES_AND_PATHS, item => {
        match = matchPath(path, { path: item.path, exact })
        return !isNull(match)
    })
    if (pageAndPath) {
        const { page } = pageAndPath
        return { page, match }
    }
    return {}
}

/**
 * Get current page object
 *
 * @returns {object} - Current page object
 */
export const getCurrentPage = () => {
    const {
        location: { pathname },
    } = history

    return getPage(pathname)
}

export const isProfilePage = location => {
    const match = matchPath(location.pathname, {
        path: getPath(PROFILE_PAGE),
    })
    return Boolean(match)
}

export const isSovPage = location => {
    return includes(location.pathname, 'sov')
}
