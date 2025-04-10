import { handleActions, combineActions } from 'redux-actions'
import flow from 'lodash/fp/flow'
import set from 'lodash/fp/set'

import cloneDeep from 'lodash/cloneDeep'

import {
    createCampaignPageAutomationRequest,
    createCampaignPageAutomationSuccess,
    createCampaignPageAutomationFailure,
    fetchCampaignPageAutomationRequest,
    fetchCampaignPageAutomationSuccess,
    fetchCampaignPageAutomationFailure,
    updateCampaignPageAutomationRequest,
    updateCampaignPageAutomationSuccess,
    updateCampaignPageAutomationFailure,
} from 'actions/ui'

const defaultState = {
    loading: false,
    error: null,
}

export default handleActions(
    {
        [combineActions(
            createCampaignPageAutomationRequest,
            fetchCampaignPageAutomationRequest,
            updateCampaignPageAutomationRequest
        )](state) {
            return flow(
                set('loading', true),
                set('error', null)
            )(state)
        },

        [combineActions(
            createCampaignPageAutomationSuccess,
            fetchCampaignPageAutomationSuccess,
            updateCampaignPageAutomationSuccess
        )](state) {
            return flow(
                set('loading', false),
                set('error', null)
            )(state)
        },

        [combineActions(
            createCampaignPageAutomationFailure,
            fetchCampaignPageAutomationFailure,
            updateCampaignPageAutomationFailure
        )](state, action) {
            const { message } = action.payload

            return flow(
                set('loading', false),
                set('error', message)
            )(state)
        },
    },
    cloneDeep(defaultState) // create clone, so the defaultState is not mutated
)
