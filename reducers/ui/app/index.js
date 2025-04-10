import { handleActions, combineActions } from 'redux-actions'
import set from 'lodash/fp/set'

import { defaultCurrencyCode } from 'configuration/currency'
import {
    changeCurrencyCode,
    fetchCurrencySettingsSuccess,
    searchBrandsRequest,
    searchBrandsSuccess,
    searchBrandsFailure,
    searchCampaignsRequest,
    searchCampaignsSuccess,
    searchCampaignsFailure,
    fetchOrganizationLabelsSuccess,
    setGlobalNotification,
} from 'actions/ui'

const defaultState = {
    currencyCode: null,
    brandsFilterLoading: false,
    campaignsFilterLoading: false,
    organizationLabels: [],
    globalNotification: null,
}

export default handleActions(
    {
        [changeCurrencyCode](state, action) {
            const { currencyCode } = action.payload
            return set(['currencyCode'], currencyCode, state)
        },

        [fetchCurrencySettingsSuccess](state, action) {
            const currencyCode = action.payload

            return set(
                ['currencyCode'],
                currencyCode || defaultCurrencyCode,
                state
            )
        },

        // search brands
        [searchBrandsRequest](state) {
            return set(['brandsFilterLoading'], true, state)
        },
        [combineActions(searchBrandsSuccess, searchBrandsFailure)](state) {
            return set(['brandsFilterLoading'], false, state)
        },

        // search campaigns
        [searchCampaignsRequest](state) {
            return set(['campaignsFilterLoading'], true, state)
        },
        [combineActions(searchCampaignsSuccess, searchCampaignsFailure)](
            state
        ) {
            return set(['campaignsFilterLoading'], false, state)
        },

        // organization labels
        [fetchOrganizationLabelsSuccess](state, action) {
            return set(['organizationLabels'], action.payload.results, state)
        },

        // global notification
        [setGlobalNotification](state, action) {
            return set(['globalNotification'], action.payload, state)
        },
    },
    defaultState
)
