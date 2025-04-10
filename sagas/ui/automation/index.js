import { all, takeLatest } from 'redux-saga/effects'

import {
    mountAutomationPageRequest,
    fetchAutomationPageDataRequest,
    fetchAutomationPageChangelogTableRequest,
    fetchAutomationPageRecommendationsTableRequest,
} from 'actions/ui'

import {
    mountAutomationPageWorker,
    fetchAutomationPageDataWorker,
    fetchAutomationPageChangelogTableWorker,
    fetchAutomationPageRecommendationsTableWorker,
} from './workers'

export default function* automationPageWorker() {
    yield all([
        takeLatest(
            mountAutomationPageRequest.toString(),
            mountAutomationPageWorker
        ),
        takeLatest(
            fetchAutomationPageDataRequest.toString(),
            fetchAutomationPageDataWorker
        ),
        takeLatest(
            fetchAutomationPageChangelogTableRequest.toString(),
            fetchAutomationPageChangelogTableWorker
        ),
        takeLatest(
            fetchAutomationPageRecommendationsTableRequest.toString(),
            fetchAutomationPageRecommendationsTableWorker
        ),
    ])
}
