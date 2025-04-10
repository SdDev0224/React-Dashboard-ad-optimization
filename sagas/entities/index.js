import { call } from 'redux-saga/effects'

import {
    getBrand,
    getCampaign,
    updateCampaign,
    deleteCampaign,
    createCampaignAutomation,
    getCampaignAutomation,
    updateCampaignAutomation,
    getProduct,
    attachProduct,
    updateProduct,
    deleteProduct,
    getKeyword,
    attachKeyword,
    updateKeyword,
    deleteKeyword,
    getSovKeyword,
    attachSovKeyword,
    updateSovKeyword,
    deleteSovKeyword,
    updateBrand,
    getProductMetadata,
} from 'services/cerebroApi'
import {
    // Brand
    fetchBrandSuccess,
    updateBrandSuccess,

    // Campaign
    fetchCampaignSuccess,
    updateCampaignSuccess,
    deleteCampaignSuccess,

    // Campaign Automation
    createCampaignAutomationSuccess,
    fetchCampaignAutomationSuccess,
    updateCampaignAutomationSuccess,

    // Product
    fetchProductSuccess,
    attachProductSuccess,
    updateProductSuccess,
    deleteProductSuccess,

    // Keyword
    fetchKeywordSuccess,
    attachKeywordSuccess,
    updateKeywordSuccess,
    deleteKeywordSuccess,

    // SOV Keyword
    fetchSovKeywordSuccess,
    attachSovKeywordSuccess,
    updateSovKeywordSuccess,
    deleteSovKeywordSuccess,
    fetchProductMetadataSuccess,
} from 'actions/entities'
import cerebroApiSaga from 'sagas/common/cerebroApi'

// brands
export function* fetchBrandSaga(brandId) {
    yield call(cerebroApiSaga, fetchBrandSuccess, getBrand, brandId)
}

export function* updateBrandSaga(brandId, data) {
    yield call(cerebroApiSaga, updateBrandSuccess, updateBrand, brandId, data)
}

// campaigns
export function* fetchCampaignSaga(campaignId) {
    yield call(cerebroApiSaga, fetchCampaignSuccess, getCampaign, campaignId)
}

export function* updateCampaignSaga(campaignId, data) {
    yield call(
        cerebroApiSaga,
        updateCampaignSuccess,
        updateCampaign,
        campaignId,
        data
    )
}

export function* deleteCampaignSaga(campaignId) {
    yield call(
        cerebroApiSaga,
        deleteCampaignSuccess,
        deleteCampaign,
        campaignId
    )
}

// campaign automations
export function* createCampaignAutomationSaga(data) {
    yield call(
        cerebroApiSaga,
        createCampaignAutomationSuccess,
        createCampaignAutomation,
        data
    )
}

export function* fetchCampaignAutomationSaga(campaignId) {
    yield call(
        cerebroApiSaga,
        fetchCampaignAutomationSuccess,
        getCampaignAutomation,
        campaignId
    )
}

export function* updateCampaignAutomationSaga(campaignId, data) {
    yield call(
        cerebroApiSaga,
        updateCampaignAutomationSuccess,
        updateCampaignAutomation,
        campaignId,
        data
    )
}

// products
export function* fetchProductSaga(productId) {
    yield call(cerebroApiSaga, fetchProductSuccess, getProduct, productId)
}

export function* attachProductSaga(data) {
    yield call(cerebroApiSaga, attachProductSuccess, attachProduct, data)
}

export function* updateProductSaga(productId, data) {
    yield call(
        cerebroApiSaga,
        updateProductSuccess,
        updateProduct,
        productId,
        data
    )
}

export function* deleteProductSaga(productId) {
    yield call(cerebroApiSaga, deleteProductSuccess, deleteProduct, productId)
}

// product metadata
export function* fetchProductMetadataSaga(asin, countryCode) {
    yield call(
        cerebroApiSaga,
        fetchProductMetadataSuccess,
        getProductMetadata,
        {
            asin,
            marketplace: countryCode,
        }
    )
}

// keywords
export function* fetchKeywordSaga(keywordId) {
    yield call(cerebroApiSaga, fetchKeywordSuccess, getKeyword, keywordId)
}

export function* attachKeywordSaga(data) {
    yield call(cerebroApiSaga, attachKeywordSuccess, attachKeyword, data)
}

export function* updateKeywordSaga(keywordId, data) {
    yield call(
        cerebroApiSaga,
        updateKeywordSuccess,
        updateKeyword,
        keywordId,
        data
    )
}

export function* deleteKeywordSaga(keywordId) {
    yield call(cerebroApiSaga, deleteKeywordSuccess, deleteKeyword, keywordId)
}

// sov keywords
export function* fetchSovKeywordSaga(sovKeywordId) {
    yield call(
        cerebroApiSaga,
        fetchSovKeywordSuccess,
        getSovKeyword,
        sovKeywordId
    )
}

export function* attachSovKeywordSaga(data) {
    yield call(cerebroApiSaga, attachSovKeywordSuccess, attachSovKeyword, data)
}

export function* updateSovKeywordSaga(sovKeywordId, data) {
    yield call(
        cerebroApiSaga,
        updateSovKeywordSuccess,
        updateSovKeyword,
        sovKeywordId,
        data
    )
}

export function* deleteSovKeywordSaga(sovKeywordId) {
    yield call(
        cerebroApiSaga,
        deleteSovKeywordSuccess,
        deleteSovKeyword,
        sovKeywordId
    )
}
