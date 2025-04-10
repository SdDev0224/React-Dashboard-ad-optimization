import { all, takeLatest } from 'redux-saga/effects'

import {
    mountApp,
    fetchCurrentPageData,
    resetCurrentPagePagination,
    changeCurrencyCode,
    changeCampaignsFilterInput,
    changeBrandsFilterInput,
} from 'actions/ui'

import {
    mountAppWorker,
    fetchCurrentPageDataWorker,
    resetCurrentPagePaginationWorker,
    changeCurrencyCodeWorker,
    changeCampaignsFilterInputWorker,
    changeBrandsFilterInputWorker,
} from './workers'

export default function* appWorker() {
    yield all([
        takeLatest(mountApp.toString(), mountAppWorker),

        // Actions for current page
        takeLatest(fetchCurrentPageData.toString(), fetchCurrentPageDataWorker),
        takeLatest(
            resetCurrentPagePagination.toString(),
            resetCurrentPagePaginationWorker
        ),

        takeLatest(changeCurrencyCode.toString(), changeCurrencyCodeWorker),

        takeLatest(
            changeCampaignsFilterInput.toString(),
            changeCampaignsFilterInputWorker
        ),

        takeLatest(
            changeBrandsFilterInput.toString(),
            changeBrandsFilterInputWorker
        ),
    ])
}
