import { call, select, put } from 'redux-saga/effects'

import { CAMPAIGN_PAGE } from 'constants/pages'

import { selectDomainValue as selectUiDomainValue } from 'selectors/ui'
import {
    createCampaignPageAutomationSuccess,
    createCampaignPageAutomationFailure,
    fetchCampaignPageAutomationSuccess,
    fetchCampaignPageAutomationFailure,
    updateCampaignPageAutomationSuccess,
    updateCampaignPageAutomationFailure,
} from 'actions/ui'
import {
    createCampaignAutomationSaga as createEntitiesCampaignAutomationSaga,
    fetchCampaignAutomationSaga as fetchEntitiesCampaignAutomationSaga,
    updateCampaignAutomationSaga as updateEntitiesCampaignAutomationSaga,
} from 'sagas/entities'

function* selectCampaignId() {
    const campaignId = yield select(selectUiDomainValue, [
        CAMPAIGN_PAGE,
        'campaignId',
    ])

    return campaignId
}

/**
 * Create campaign automation
 */
function* createCampaignAutomationSaga(payload) {
    try {
        yield call(createEntitiesCampaignAutomationSaga, payload)
        yield put(createCampaignPageAutomationSuccess())
    } catch (error) {
        yield put(createCampaignPageAutomationFailure(error))
    }
}

/**
 * Fetch campaign automation
 */
function* fetchCampaignAutomationSaga(campaignId) {
    try {
        yield call(fetchEntitiesCampaignAutomationSaga, campaignId)
        yield put(fetchCampaignPageAutomationSuccess())
    } catch (error) {
        yield put(fetchCampaignPageAutomationFailure(error))
    }
}

/**
 * Update campaign automation
 */
function* updateCampaignAutomationSaga(campaignId, payload) {
    try {
        yield call(updateEntitiesCampaignAutomationSaga, campaignId, payload)
        yield put(updateCampaignPageAutomationSuccess())
    } catch (error) {
        yield put(updateCampaignPageAutomationFailure(error))
    }
}

export function* createCampaignPageAutomationWorker(action) {
    const campaignId = yield selectCampaignId()

    yield call(createCampaignAutomationSaga, {
        ...action.payload,
        campaign_id: campaignId,
    })
}

export function* fetchCampaignPageAutomationWorker() {
    const campaignId = yield selectCampaignId()

    yield call(fetchCampaignAutomationSaga, campaignId)
}

export function* updateCampaignPageAutomationWorker(action) {
    const campaignId = yield selectCampaignId()

    yield call(updateCampaignAutomationSaga, campaignId, action.payload)
}

/**
 * Fetch data of tab
 */
export function* fetchCampaignPageAutomationTabDataWorker() {
    yield call(fetchCampaignPageAutomationWorker)
}

/**
 * When tab mounted, fetch all metadata and data of tab
 */
export function* mountCampaignPageAutomationTabWorker() {
    yield call(fetchCampaignPageAutomationTabDataWorker)
}
