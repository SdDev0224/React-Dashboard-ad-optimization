import { handleActions } from 'redux-actions'
import flow from 'lodash/fp/flow'
import set from 'lodash/fp/set'
import get from 'lodash/get'
import cloneDeep from 'lodash/cloneDeep'

import {
    mountAutomationPageRequest,
    mountAutomationPageSuccess,
    mountAutomationPageFailure,
    fetchAutomationPageDescriptionSuccess,
    fetchAutomationPageDataRequest,
    fetchAutomationPageDataSuccess,
    fetchAutomationPageDataFailure,
    fetchAutomationPageChangelogTableRequest,
    fetchAutomationPageChangelogTableSuccess,
    fetchAutomationPageChangelogTableFailure,
    fetchAutomationPageRecommendationsTableRequest,
    fetchAutomationPageRecommendationsTableSuccess,
    fetchAutomationPageRecommendationsTableFailure,
} from 'actions/ui'
import { FILTERS, FILTER_SETTINGS } from 'constants/reducerKeys'
import { DATES, REGIONS, COUNTRIES } from 'constants/filters'
import moment from 'utilities/moment'

import { getDefaultTable } from '../defaults'

export const defaultState = {
    mounting: true,
    error: null,
    automationDescription: null,
    descriptionLoading: false,
    [FILTERS]: {
        [DATES]: [moment().subtract(7, 'days'), moment()],
        [REGIONS]: [],
        [COUNTRIES]: [],
    },
    [FILTER_SETTINGS]: {
        anchored: [DATES],
        order: [REGIONS, COUNTRIES],
        displayState: {
            [REGIONS]: true,
            [COUNTRIES]: true,
        },
    },
    changelogTable: {
        ...getDefaultTable({
            order: [
                'resource_name',
                'resource_type',
                'change_description',
                'change_reason',
                'region',
                'country',
                'change_date',
            ],
            displayState: {
                resource_name: true,
                resource_type: true,
                change_description: true,
                change_reason: true,
                region: true,
                country: true,
                change_date: true,
            },
        }),
        sorter: { field: 'history_date', order: 'descend' },
    },
    recommendationsTable: {
        ...getDefaultTable({
            order: [
                'resource',
                'resource_type',
                'action_type',
                'recommendation',
                'description',
                'date',
            ],
            displayState: {
                resource: true,
                resource_type: true,
                action_type: true,
                recommendation: true,
                description: true,
                date: true,
            },
        }),
        sorter: { field: 'created_at', order: 'descend' },
    },
}

export default handleActions(
    {
        // mounting
        [mountAutomationPageRequest](state) {
            return set(['mounting'], true, state)
        },
        [mountAutomationPageSuccess](state) {
            return set(['mounting'], false, state)
        },
        [mountAutomationPageFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['mounting'], false),
                set(['error'], message)
            )(state)
        },

        // page data
        [fetchAutomationPageDataRequest](state) {
            return flow(
                set(['descriptionLoading'], true),
                set(['changelogTable', 'loading'], true),
                set(['recommendationsTable', 'loading'], true),
                set(['automationDescription'], null)
            )(state)
        },
        [fetchAutomationPageDataSuccess](state) {
            return flow(
                set(['descriptionLoading'], false),
                set(['changelogTable', 'loading'], false),
                set(['recommendationsTable', 'loading'], false)
            )(state)
        },
        [fetchAutomationPageDataFailure](state, action) {
            return flow(
                set(['descriptionLoading'], false),
                set(['changelogTable', 'loading'], false),
                set(['recommendationsTable', 'loading'], false),
                set(['error'], action.payload)
            )(state)
        },

        // automation description
        [fetchAutomationPageDescriptionSuccess](state, action) {
            return set(
                ['automationDescription'],
                get(action, ['payload', 'automation_description']),
                state
            )
        },

        // changelog table data
        [fetchAutomationPageChangelogTableRequest](state) {
            return set(['changelogTable', 'loading'], true, state)
        },
        [fetchAutomationPageChangelogTableSuccess](state, action) {
            const { count, results } = action.payload
            return flow(
                set(['changelogTable', 'loading'], false),
                set(['changelogTable', 'data'], results),
                set(['changelogTable', 'pagination', 'total'], count)
            )(state)
        },
        [fetchAutomationPageChangelogTableFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['changelogTable', 'loading'], false),
                set(['error'], message)
            )(state)
        },

        // recommendations table data
        [fetchAutomationPageRecommendationsTableRequest](state) {
            return set(['recommendationsTable', 'loading'], true, state)
        },
        [fetchAutomationPageRecommendationsTableSuccess](state, action) {
            const { count, results } = action.payload
            return flow(
                set(['recommendationsTable', 'loading'], false),
                set(['recommendationsTable', 'data'], results),
                set(['recommendationsTable', 'pagination', 'total'], count)
            )(state)
        },
        [fetchAutomationPageRecommendationsTableFailure](state, action) {
            const { message } = action.payload
            return flow(
                set(['recommendationsTable', 'loading'], false),
                set(['error'], message)
            )(state)
        },
    },
    cloneDeep(defaultState)
)
