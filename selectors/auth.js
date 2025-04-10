import createCachedSelector from 're-reselect'
import { createSelector } from 'reselect'
import get from 'lodash/get'
import isNull from 'lodash/isNull'

import moment from 'utilities/moment'

// selectors
export const selectAuth = state => state.auth

export const selectDomainValue = createCachedSelector(
    selectAuth,
    (state, path) => path,
    (domainState, path) => get(domainState, path)
)((state, path) => JSON.stringify(path))

export const selectHasRecentIntegration = createSelector(
    selectAuth,
    authState => {
        const { latestOrganizationIntegration } = authState

        if (isNull(latestOrganizationIntegration)) {
            return false
        }

        const now = moment()
        const thresholdTime = moment
            .utc(latestOrganizationIntegration)
            .add(24, 'hours')

        return now.isBefore(thresholdTime)
    }
)

export const selectHasIntegration = createSelector(
    selectAuth,
    authState => !isNull(authState.latestOrganizationIntegration)
)
