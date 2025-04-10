import { all, takeLatest } from 'redux-saga/effects'

import {
    mountHomePageRequest,
    fetchHomePageDataRequest,
    downloadHomePageTimeseriesRequest,
} from 'actions/ui'

import {
    mountHomePageWorker,
    fetchHomePageDataWorker,
    downloadHomePageTimeseriesWorker,
} from './workers'

export default function* homePageWorker() {
    yield all([
        takeLatest(mountHomePageRequest.toString(), mountHomePageWorker),

        takeLatest(
            fetchHomePageDataRequest.toString(),
            fetchHomePageDataWorker
        ),

        takeLatest(
            downloadHomePageTimeseriesRequest.toString(),
            downloadHomePageTimeseriesWorker
        ),
    ])
}
