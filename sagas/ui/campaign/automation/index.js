import { all, takeLatest } from 'redux-saga/effects'

import {
    mountCampaignPageAutomationTab,
    createCampaignPageAutomationRequest,
    fetchCampaignPageAutomationRequest,
    updateCampaignPageAutomationRequest,
} from 'actions/ui'

import {
    mountCampaignPageAutomationTabWorker,
    createCampaignPageAutomationWorker,
    fetchCampaignPageAutomationWorker,
    updateCampaignPageAutomationWorker,
} from './workers'

export default function* campaignPageWorker() {
    yield all([
        takeLatest(
            mountCampaignPageAutomationTab.toString(),
            mountCampaignPageAutomationTabWorker
        ),

        takeLatest(
            createCampaignPageAutomationRequest.toString(),
            createCampaignPageAutomationWorker
        ),

        takeLatest(
            fetchCampaignPageAutomationRequest.toString(),
            fetchCampaignPageAutomationWorker
        ),

        takeLatest(
            updateCampaignPageAutomationRequest.toString(),
            updateCampaignPageAutomationWorker
        ),
    ])
}
