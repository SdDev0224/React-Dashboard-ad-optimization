import { all, call, select, put } from 'redux-saga/effects'

import { SPONSORED_PRODUCT, HEADLINE_SEARCH } from 'constants/factTypes'
import { hasPermissions } from 'helpers/featurePermissions'
import { DAYPARTING } from 'constants/featurePermissions'
import { CAMPAIGN_PAGE } from 'constants/pages'
import {
    formatPagination,
    formatSorter,
    formatCurrency,
    formatMetrics,
} from 'helpers/params'
import { formatFilters } from 'helpers/ui/campaignPage'
import { downloadCsv } from 'helpers/downloads'
import {
    getCampaignHourlyMultipliers,
    updateCampaignHourlyMultipliers,
    getKeywordsForCampaignSponsoredProductFactAggregates,
    getKeywordsForCampaignHeadlineSearchFactAggregates,
    getProductsForCampaignSponsoredProductFactAggregates,
    getProductsForCampaignHeadlineSearchFactAggregates,
    getCampaignSponsoredProductFactTimeseries,
    getCampaignHeadlineSearchFactTimeseries,
    getCampaignFactTimeseriesExport,
    getKeywordsForCampaignFactAggregatesExport,
    getProductsForCampaignFactAggregatesExport,
    getCampaignSponsoredProductFactAggregate,
    getCampaignHeadlineSearchFactAggregate,
    getBrandFeaturePermissions,
} from 'services/cerebroApi'
import {
    // mounting
    mountCampaignPageSuccess,
    mountCampaignPageFailure,

    // page data
    fetchCampaignPageDataSuccess,
    fetchCampaignPageDataFailure,

    // campaign details
    updateCampaignPageCampaignDetailsSuccess,
    updateCampaignPageCampaignDetailsFailure,

    // dayparting
    fetchCampaignPageHourlyMultipliersSuccess,
    fetchCampaignPageHourlyMultipliersFailure,
    updateCampaignPageHourlyMultipliersSuccess,
    updateCampaignPageHourlyMultipliersFailure,

    // aggregate
    fetchCampaignPageAggregateSuccess,

    // timeseries data
    fetchCampaignPageSponsoredProductTimeseriesSuccess,
    fetchCampaignPageHeadlineSearchTimeseriesSuccess,

    // timeseries download
    downloadCampaignPageTimeseriesSuccess,
    downloadCampaignPageTimeseriesFailure,

    // keywords table data
    fetchCampaignPageKeywordsTableRequest,
    fetchCampaignPageKeywordsTableSuccess,
    fetchCampaignPageKeywordsTableFailure,

    // keywords table download
    downloadCampaignPageKeywordsTableSuccess,
    downloadCampaignPageKeywordsTableFailure,

    // keyword table attach
    attachCampaignPageKeywordsTableKeywordsSuccess,
    attachCampaignPageKeywordsTableKeywordsFailure,

    // keyword table update
    updateCampaignPageKeywordsTableKeywordSuccess,
    updateCampaignPageKeywordsTableKeywordFailure,

    // keyword table delete
    deleteCampaignPageKeywordsTableKeywordSuccess,
    deleteCampaignPageKeywordsTableKeywordFailure,

    // products table data
    fetchCampaignPageProductsTableSuccess,
    fetchCampaignPageProductsTableFailure,

    // products table download
    downloadCampaignPageProductsTableSuccess,
    downloadCampaignPageProductsTableFailure,

    // products table attach
    attachCampaignPageProductsTableProductsSuccess,
    attachCampaignPageProductsTableProductsFailure,

    // products table update
    updateCampaignPageProductsTableProductSuccess,
    updateCampaignPageProductsTableProductFailure,

    // products table delete
    deleteCampaignPageProductsTableProductSuccess,
    deleteCampaignPageProductsTableProductFailure,

    // feature permissions
    fetchCampaignPageFeaturePermissionsSuccess,

    // add labels
    addCampaignPageLabelsSuccess,
    addCampaignPageLabelsFailure,
} from 'actions/ui'
import { selectCampaign } from 'selectors/entities'
import {
    selectDomainValue as selectUiDomainValue,
    selectVisiblePageFilters,
    selectTableSelectedMetrics,
    selectCurrencyCode,
} from 'selectors/ui'
import cerebroApiSaga from 'sagas/common/cerebroApi'
import {
    fetchCampaignSaga as fetchEntitiesCampaignSaga,
    updateCampaignSaga as updateEntitiesCampaignSaga,
    attachKeywordSaga as attachEntitiesKeywordSaga,
    updateKeywordSaga as updateEntitiesKeywordSaga,
    deleteKeywordSaga as deleteEntitiesKeywordSaga,
    attachProductSaga as attachEntitiesProductSaga,
    updateProductSaga as updateEntitiesProductSaga,
    deleteProductSaga as deleteEntitiesProductSaga,
} from 'sagas/entities'

import {
    fetchPageFilterSettingsSaga,
    fetchTableSettingsSaga,
} from '../shared/workers'
import { fetchOrganizationLabelsSaga } from '../app/workers'

const getKeywordsAggregatesApi = factType => {
    if (factType === SPONSORED_PRODUCT) {
        return getKeywordsForCampaignSponsoredProductFactAggregates
    }

    if (factType === HEADLINE_SEARCH) {
        return getKeywordsForCampaignHeadlineSearchFactAggregates
    }

    return null
}

const getProductsAggregatesApi = factType => {
    if (factType === SPONSORED_PRODUCT) {
        return getProductsForCampaignSponsoredProductFactAggregates
    }

    if (factType === HEADLINE_SEARCH) {
        return getProductsForCampaignHeadlineSearchFactAggregates
    }

    return null
}

const getCampaignAggregateApi = factType => {
    if (factType === SPONSORED_PRODUCT) {
        return getCampaignSponsoredProductFactAggregate
    }

    if (factType === HEADLINE_SEARCH) {
        return getCampaignHeadlineSearchFactAggregate
    }

    return null
}

function* fetchCampaignSaga() {
    const campaignId = yield select(selectUiDomainValue, [
        CAMPAIGN_PAGE,
        'campaignId',
    ])

    yield call(fetchEntitiesCampaignSaga, campaignId)
}

function* updateCampaignSaga(action) {
    const data = action.payload
    const campaignId = yield select(selectUiDomainValue, [
        CAMPAIGN_PAGE,
        'campaignId',
    ])

    yield call(updateEntitiesCampaignSaga, campaignId, data)
}

function* attachKeywordsSaga(action) {
    const { keywords } = action.payload

    yield all(keywords.map(keyword => call(attachEntitiesKeywordSaga, keyword)))
}

function* updateKeywordSaga(action) {
    const { keywordId, data } = action.payload

    yield call(updateEntitiesKeywordSaga, keywordId, data)
}

function* deleteKeywordSaga(action) {
    const { keywordId } = action.payload

    yield call(deleteEntitiesKeywordSaga, keywordId)
}

function* attachProductsSaga(action) {
    const { products } = action.payload

    yield all(products.map(product => call(attachEntitiesProductSaga, product)))
}

function* updateProductSaga(action) {
    const { productId, data } = action.payload

    yield call(updateEntitiesProductSaga, productId, data)
}

function* deleteProductSaga(action) {
    const { productId } = action.payload

    yield call(deleteEntitiesProductSaga, productId)
}

function* selectCampaignFactTypeSaga() {
    const campaignId = yield select(selectUiDomainValue, [
        CAMPAIGN_PAGE,
        'campaignId',
    ])
    const campaign = yield select(selectCampaign, campaignId)
    return campaign.campaign_type
}

function* fetchCampaignPageHourlyMultipliersSaga() {
    const campaignId = yield select(selectUiDomainValue, [
        CAMPAIGN_PAGE,
        'campaignId',
    ])
    const campaign = yield select(selectCampaign, campaignId)

    const featurePermissions = yield select(selectUiDomainValue, [
        CAMPAIGN_PAGE,
        'featurePermissions',
    ])

    // Load hourly multipliers only when dayparting is enabled for campaign
    // and user has permissions to the dayparting feature
    if (
        campaign.dayparting_enabled &&
        hasPermissions(featurePermissions, DAYPARTING)
    ) {
        yield call(
            cerebroApiSaga,
            fetchCampaignPageHourlyMultipliersSuccess,
            getCampaignHourlyMultipliers,
            campaignId
        )
    }
}

function* updateCampaignPageHourlyMultipliersSaga(action) {
    const campaignId = yield select(selectUiDomainValue, [
        CAMPAIGN_PAGE,
        'campaignId',
    ])
    const multipliers = action.payload

    yield call(
        cerebroApiSaga,
        updateCampaignPageHourlyMultipliersSuccess,
        updateCampaignHourlyMultipliers,
        campaignId,
        multipliers
    )
}

function* fetchCampaignPageSponsoredProductTimeseriesSaga() {
    const campaignId = yield select(selectUiDomainValue, [
        CAMPAIGN_PAGE,
        'campaignId',
    ])
    const factType = yield call(selectCampaignFactTypeSaga)
    if (factType === SPONSORED_PRODUCT) {
        const filters = yield select(selectVisiblePageFilters, CAMPAIGN_PAGE)
        const currency = yield select(selectCurrencyCode)
        const params = {
            ...formatFilters(filters),
            currency,
        }
        params.currency = currency
        yield call(
            cerebroApiSaga,
            fetchCampaignPageSponsoredProductTimeseriesSuccess,
            getCampaignSponsoredProductFactTimeseries,
            campaignId,
            params
        )
    } else {
        yield put(fetchCampaignPageSponsoredProductTimeseriesSuccess([]))
    }
}

function* fetchCampaignPageHeadlineSearchTimeseriesSaga() {
    const campaignId = yield select(selectUiDomainValue, [
        CAMPAIGN_PAGE,
        'campaignId',
    ])
    const factType = yield call(selectCampaignFactTypeSaga)
    if (factType === HEADLINE_SEARCH) {
        const filters = yield select(selectVisiblePageFilters, CAMPAIGN_PAGE)
        const currency = yield select(selectCurrencyCode)
        const params = {
            ...formatFilters(filters),
            currency,
        }
        params.currency = currency
        yield call(
            cerebroApiSaga,
            fetchCampaignPageHeadlineSearchTimeseriesSuccess,
            getCampaignHeadlineSearchFactTimeseries,
            campaignId,
            params
        )
    } else {
        yield put(fetchCampaignPageHeadlineSearchTimeseriesSuccess([]))
    }
}

function* fetchCampaignPageAggregateSaga() {
    const campaignId = yield select(selectUiDomainValue, [
        CAMPAIGN_PAGE,
        'campaignId',
    ])
    const filters = yield select(selectVisiblePageFilters, CAMPAIGN_PAGE)
    const currency = yield select(selectCurrencyCode)
    const params = {
        ...formatFilters(filters),
        currency,
    }
    const factType = yield call(selectCampaignFactTypeSaga)
    const aggregateApi = getCampaignAggregateApi(factType)

    yield call(
        cerebroApiSaga,
        fetchCampaignPageAggregateSuccess,
        aggregateApi,
        campaignId,
        params
    )
}

function* fetchCampaignPageKeywordsTableSaga() {
    const campaignId = yield select(selectUiDomainValue, [
        CAMPAIGN_PAGE,
        'campaignId',
    ])
    const filters = yield select(selectVisiblePageFilters, CAMPAIGN_PAGE)
    const { pagination, sorter } = yield select(selectUiDomainValue, [
        CAMPAIGN_PAGE,
        'keywordsTable',
    ])
    const metrics = yield select(
        selectTableSelectedMetrics,
        CAMPAIGN_PAGE,
        'keywordsTable'
    )
    const currency = yield select(selectCurrencyCode)
    const params = {
        ...formatPagination(pagination),
        ...formatSorter(sorter),
        ...formatFilters(filters),
        ...formatMetrics(metrics),
        ...formatCurrency(currency),
    }
    const factType = yield call(selectCampaignFactTypeSaga)
    const aggregatesApi = getKeywordsAggregatesApi(factType)

    yield call(
        cerebroApiSaga,
        fetchCampaignPageKeywordsTableSuccess,
        aggregatesApi,
        campaignId,
        params
    )
}

function* fetchCampaignPageProductsTableSaga() {
    const campaignId = yield select(selectUiDomainValue, [
        CAMPAIGN_PAGE,
        'campaignId',
    ])
    const filters = yield select(selectVisiblePageFilters, CAMPAIGN_PAGE)
    const { pagination, sorter } = yield select(selectUiDomainValue, [
        CAMPAIGN_PAGE,
        'productsTable',
    ])
    const metrics = yield select(
        selectTableSelectedMetrics,
        CAMPAIGN_PAGE,
        'productsTable'
    )
    const currency = yield select(selectCurrencyCode)
    const params = {
        ...formatPagination(pagination),
        ...formatSorter(sorter),
        ...formatFilters(filters),
        ...formatMetrics(metrics),
        ...formatCurrency(currency),
    }
    const factType = yield call(selectCampaignFactTypeSaga)
    const aggregatesApi = getProductsAggregatesApi(factType)

    yield call(
        cerebroApiSaga,
        fetchCampaignPageProductsTableSuccess,
        aggregatesApi,
        campaignId,
        params
    )
}

function* downloadCampaignPageTimeseriesSaga() {
    const campaignId = yield select(selectUiDomainValue, [
        CAMPAIGN_PAGE,
        'campaignId',
    ])
    const filters = yield select(selectVisiblePageFilters, CAMPAIGN_PAGE)
    const currency = yield select(selectCurrencyCode)
    const params = {
        ...formatFilters(filters),
        currency,
    }

    const response = yield call(
        cerebroApiSaga,
        downloadCampaignPageTimeseriesSuccess,
        getCampaignFactTimeseriesExport,
        campaignId,
        params
    )

    yield call(downloadCsv, response.data, `campaign-${campaignId}-timeseries`)
}

function* downloadCampaignPageKeywordsTableSaga() {
    const campaignId = yield select(selectUiDomainValue, [
        CAMPAIGN_PAGE,
        'campaignId',
    ])
    const filters = yield select(selectVisiblePageFilters, CAMPAIGN_PAGE)
    const { pagination, sorter } = yield select(selectUiDomainValue, [
        CAMPAIGN_PAGE,
        'keywordsTable',
    ])
    const currency = yield select(selectCurrencyCode)
    const params = {
        ...formatPagination(pagination),
        ...formatSorter(sorter),
        ...formatFilters(filters),
        ...formatCurrency(currency),
    }

    const response = yield call(
        cerebroApiSaga,
        downloadCampaignPageKeywordsTableSuccess,
        getKeywordsForCampaignFactAggregatesExport,
        campaignId,
        params
    )

    yield call(downloadCsv, response.data, `campaign-${campaignId}-keywords`)
}

function* downloadCampaignPageProductsTableSaga() {
    const campaignId = yield select(selectUiDomainValue, [
        CAMPAIGN_PAGE,
        'campaignId',
    ])
    const filters = yield select(selectVisiblePageFilters, CAMPAIGN_PAGE)
    const { pagination, sorter } = yield select(selectUiDomainValue, [
        CAMPAIGN_PAGE,
        'productsTable',
    ])
    const currency = yield select(selectCurrencyCode)
    const params = {
        ...formatPagination(pagination),
        ...formatSorter(sorter),
        ...formatFilters(filters),
        ...formatCurrency(currency),
    }

    const response = yield call(
        cerebroApiSaga,
        downloadCampaignPageProductsTableSuccess,
        getProductsForCampaignFactAggregatesExport,
        campaignId,
        params
    )

    yield call(downloadCsv, response.data, `campaign-${campaignId}-products`)
}

function* fetchCampaignPageDataSaga() {
    const factType = yield call(selectCampaignFactTypeSaga)

    const effects = [
        call(fetchOrganizationLabelsSaga),
        call(fetchCampaignPageHourlyMultipliersSaga),
        call(fetchCampaignPageSponsoredProductTimeseriesSaga),
        call(fetchCampaignPageHeadlineSearchTimeseriesSaga),
        call(fetchCampaignPageAggregateSaga),
    ]

    if (factType.value !== HEADLINE_SEARCH) {
        effects.push(
            call(fetchCampaignPageKeywordsTableSaga),
            call(fetchCampaignPageProductsTableSaga)
        )
    }

    yield all(effects)
}

function* fetchCampaignPageFeaturePermissionsSaga() {
    const campaignId = yield select(selectUiDomainValue, [
        CAMPAIGN_PAGE,
        'campaignId',
    ])
    const campaign = yield select(selectCampaign, campaignId)

    yield call(
        cerebroApiSaga,
        fetchCampaignPageFeaturePermissionsSuccess,
        getBrandFeaturePermissions,
        campaign.profile_id
    )
}

/**
 * Attaches Keywords into Keywords table
 */
export function* attachCampaignPageKeywordsTableKeywordsWorker(action) {
    try {
        yield call(attachKeywordsSaga, action)
        yield call(fetchCampaignPageKeywordsTableSaga)
        yield put(attachCampaignPageKeywordsTableKeywordsSuccess())
    } catch (error) {
        yield put(attachCampaignPageKeywordsTableKeywordsFailure(error))
    }
}

/**
 * Updates Keyword in Keywords table
 */
export function* updateCampaignPageKeywordsTableKeywordWorker(action) {
    try {
        yield call(updateKeywordSaga, action)
        yield call(fetchCampaignPageKeywordsTableSaga)
        yield put(updateCampaignPageKeywordsTableKeywordSuccess())
    } catch (error) {
        yield put(updateCampaignPageKeywordsTableKeywordFailure(error))
    }
}

/**
 * Deletes Keyword in Keywords table
 */
export function* deleteCampaignPageKeywordsTableKeywordWorker(action) {
    try {
        yield call(deleteKeywordSaga, action)
        yield call(fetchCampaignPageKeywordsTableSaga)
        yield put(deleteCampaignPageKeywordsTableKeywordSuccess())
    } catch (error) {
        yield put(deleteCampaignPageKeywordsTableKeywordFailure(error))
    }
}

/**
 * Attaches Products into Products table
 */
export function* attachCampaignPageProductsTableProductsWorker(action) {
    try {
        yield call(attachProductsSaga, action)
        yield call(fetchCampaignPageProductsTableSaga)
        yield put(attachCampaignPageProductsTableProductsSuccess())
    } catch (error) {
        yield put(attachCampaignPageProductsTableProductsFailure(error))
    }
}

/**
 * Updates Product in Products table
 */
export function* updateCampaignPageProductsTableProductWorker(action) {
    try {
        yield call(updateProductSaga, action)
        yield call(fetchCampaignPageProductsTableSaga)
        yield put(updateCampaignPageProductsTableProductSuccess())
    } catch (error) {
        yield put(updateCampaignPageProductsTableProductFailure(error))
    }
}

/**
 * Deletes Product in Products table
 */
export function* deleteCampaignPageProductsTableProductWorker(action) {
    try {
        yield call(deleteProductSaga, action)
        yield call(fetchCampaignPageProductsTableSaga)
        yield put(deleteCampaignPageProductsTableProductSuccess())
    } catch (error) {
        yield put(deleteCampaignPageProductsTableProductFailure(error))
    }
}

/**
 * Downloads Product table for Campaign Page
 */
export function* downloadCampaignPageProductsTableWorker() {
    try {
        yield call(downloadCampaignPageProductsTableSaga)
    } catch (error) {
        yield put(downloadCampaignPageProductsTableFailure(error))
    }
}

/**
 * Downloads Keyword table for Campaign Page
 */
export function* downloadCampaignPageKeywordsTableWorker() {
    try {
        yield call(downloadCampaignPageKeywordsTableSaga)
    } catch (error) {
        yield put(downloadCampaignPageKeywordsTableFailure(error))
    }
}

/**
 * Downloads timeseries data for Campaign Page
 */
export function* downloadCampaignPageTimeseriesWorker() {
    try {
        yield call(downloadCampaignPageTimeseriesSaga)
    } catch (error) {
        yield put(downloadCampaignPageTimeseriesFailure(error))
    }
}

/**
 * Removes a label from a campaign on campaign page
 */
export function* removeCampaignPageLabelWorker(action) {
    yield call(updateCampaignSaga, action)
}

/**
 * Adds labels to a campaign on campaign page
 */
export function* addCampaignPageLabelsWorker(action) {
    try {
        yield call(updateCampaignSaga, action)
        yield put(addCampaignPageLabelsSuccess())
    } catch (error) {
        yield put(addCampaignPageLabelsFailure(error))
    }
}

/**
 * Fetches data for Campaign Page Products table
 */
export function* fetchCampaignPageProductsTableWorker() {
    try {
        yield call(fetchCampaignPageProductsTableSaga)
    } catch (error) {
        yield put(fetchCampaignPageProductsTableFailure(error))
    }
}

/**
 * Fetches data for Campaign Page Keywords table
 */
export function* fetchCampaignPageKeywordsTableWorker() {
    try {
        yield call(fetchCampaignPageKeywordsTableSaga)
    } catch (error) {
        yield put(fetchCampaignPageKeywordsTableFailure(error))
    }
}

/**
 * Fetches hourly campaign multipliers for Campaign Page
 */
export function* fetchCampaignPageHourlyMultipliersWorker() {
    try {
        yield call(fetchCampaignPageHourlyMultipliersSaga)
    } catch (error) {
        yield put(fetchCampaignPageHourlyMultipliersFailure(error))
    }
}

/**
 * Updates hourly campaign multipliers for Campaign Page
 *
 * @param action action with multipliers as a payload
 */
export function* updateCampaignPageHourlyMultipliersWorker(action) {
    try {
        yield call(updateCampaignPageHourlyMultipliersSaga, action)
    } catch (error) {
        yield put(updateCampaignPageHourlyMultipliersFailure(error))
    }
}

/**
 * Updates Campaign Details
 */
export function* updateCampaignPageCampaignDetailsWorker(action) {
    try {
        yield all([
            call(updateCampaignSaga, action),
            // update keywords table when campaign is updated
            // required because dayparting updates impact table data
            put(fetchCampaignPageKeywordsTableRequest()),
        ])
        yield put(updateCampaignPageCampaignDetailsSuccess())
    } catch (error) {
        yield put(updateCampaignPageCampaignDetailsFailure(error))
    }
}

/**
 * Fetches all data required for the Campaign Page
 *
 * Notes:
 *     Product and Keyword data is only available for Headline Search campaigns
 */
export function* fetchCampaignPageDataWorker() {
    try {
        yield call(fetchCampaignPageFeaturePermissionsSaga)
        yield call(fetchCampaignPageDataSaga)
        yield put(fetchCampaignPageDataSuccess())
    } catch (error) {
        yield put(fetchCampaignPageDataFailure(error))
    }
}

/**
 * Mounts the Campaign Page and fetches data
 */
export function* mountCampaignPageWorker() {
    try {
        yield all([
            call(fetchCampaignSaga),
            call(fetchPageFilterSettingsSaga, CAMPAIGN_PAGE),
            call(fetchTableSettingsSaga, CAMPAIGN_PAGE, 'keywordsTable'),
            call(fetchTableSettingsSaga, CAMPAIGN_PAGE, 'productsTable'),
        ])

        yield call(fetchCampaignPageDataWorker)
        yield put(mountCampaignPageSuccess())
    } catch (error) {
        yield put(mountCampaignPageFailure(error))
    }
}
