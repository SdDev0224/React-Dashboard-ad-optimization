import { all, takeLatest } from 'redux-saga/effects'

import {
    attachCampaignPageKeywordsTableKeywordsRequest,
    attachCampaignPageProductsTableProductsRequest,
    deleteCampaignPageKeywordsTableKeywordRequest,
    deleteCampaignPageProductsTableProductRequest,
    downloadCampaignPageKeywordsTableRequest,
    downloadCampaignPageProductsTableRequest,
    downloadCampaignPageTimeseriesRequest,
    fetchCampaignPageDataRequest,
    fetchCampaignPageHourlyMultipliersRequest,
    fetchCampaignPageKeywordsTableRequest,
    fetchCampaignPageProductsTableRequest,
    mountCampaignPageRequest,
    updateCampaignPageCampaignDetailsRequest,
    updateCampaignPageHourlyMultipliersRequest,
    updateCampaignPageKeywordsTableKeywordRequest,
    updateCampaignPageProductsTableProductRequest,
    addCampaignPageLabelsRequest,
    removeCampaignPageLabelRequest,
} from 'actions/ui'

import {
    attachCampaignPageKeywordsTableKeywordsWorker,
    attachCampaignPageProductsTableProductsWorker,
    deleteCampaignPageKeywordsTableKeywordWorker,
    deleteCampaignPageProductsTableProductWorker,
    downloadCampaignPageKeywordsTableWorker,
    downloadCampaignPageProductsTableWorker,
    downloadCampaignPageTimeseriesWorker,
    fetchCampaignPageDataWorker,
    fetchCampaignPageHourlyMultipliersWorker,
    fetchCampaignPageKeywordsTableWorker,
    fetchCampaignPageProductsTableWorker,
    mountCampaignPageWorker,
    updateCampaignPageCampaignDetailsWorker,
    updateCampaignPageHourlyMultipliersWorker,
    updateCampaignPageKeywordsTableKeywordWorker,
    updateCampaignPageProductsTableProductWorker,
    addCampaignPageLabelsWorker,
    removeCampaignPageLabelWorker,
} from './workers'

import automationTabWorker from './automation'

export default function* campaignPageWorker() {
    yield all([
        takeLatest(
            mountCampaignPageRequest.toString(),
            mountCampaignPageWorker
        ),

        takeLatest(
            fetchCampaignPageDataRequest.toString(),
            fetchCampaignPageDataWorker
        ),

        takeLatest(
            updateCampaignPageCampaignDetailsRequest.toString(),
            updateCampaignPageCampaignDetailsWorker
        ),

        takeLatest(
            fetchCampaignPageHourlyMultipliersRequest.toString(),
            fetchCampaignPageHourlyMultipliersWorker
        ),

        takeLatest(
            updateCampaignPageHourlyMultipliersRequest.toString(),
            updateCampaignPageHourlyMultipliersWorker
        ),

        takeLatest(
            fetchCampaignPageKeywordsTableRequest.toString(),
            fetchCampaignPageKeywordsTableWorker
        ),

        takeLatest(
            fetchCampaignPageProductsTableRequest.toString(),
            fetchCampaignPageProductsTableWorker
        ),

        takeLatest(
            downloadCampaignPageTimeseriesRequest.toString(),
            downloadCampaignPageTimeseriesWorker
        ),

        takeLatest(
            downloadCampaignPageKeywordsTableRequest.toString(),
            downloadCampaignPageKeywordsTableWorker
        ),

        takeLatest(
            attachCampaignPageKeywordsTableKeywordsRequest.toString(),
            attachCampaignPageKeywordsTableKeywordsWorker
        ),

        takeLatest(
            updateCampaignPageKeywordsTableKeywordRequest.toString(),
            updateCampaignPageKeywordsTableKeywordWorker
        ),

        takeLatest(
            deleteCampaignPageKeywordsTableKeywordRequest.toString(),
            deleteCampaignPageKeywordsTableKeywordWorker
        ),

        takeLatest(
            downloadCampaignPageProductsTableRequest.toString(),
            downloadCampaignPageProductsTableWorker
        ),

        takeLatest(
            attachCampaignPageProductsTableProductsRequest.toString(),
            attachCampaignPageProductsTableProductsWorker
        ),

        takeLatest(
            updateCampaignPageProductsTableProductRequest.toString(),
            updateCampaignPageProductsTableProductWorker
        ),

        takeLatest(
            deleteCampaignPageProductsTableProductRequest.toString(),
            deleteCampaignPageProductsTableProductWorker
        ),

        takeLatest(
            addCampaignPageLabelsRequest.toString(),
            addCampaignPageLabelsWorker
        ),

        takeLatest(
            removeCampaignPageLabelRequest.toString(),
            removeCampaignPageLabelWorker
        ),

        // Automation Tab
        automationTabWorker(),
    ])
}
