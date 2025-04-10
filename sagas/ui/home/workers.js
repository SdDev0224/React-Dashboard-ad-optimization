import { all, select, put, call } from 'redux-saga/effects'

import { HOME_PAGE } from 'constants/pages'
import { SPONSORED_PRODUCT, HEADLINE_SEARCH } from 'constants/factTypes'
import { formatFilters } from 'helpers/ui/homePage'
import { downloadCsv } from 'helpers/downloads'
import {
    getAllFactAggregate,
    getSponsoredProductFactAggregate,
    getHeadlineSearchFactAggregate,
    getSponsoredProductFactTimeseries,
    getHeadlineSearchFactTimeseries,
    getAllFactTimeseriesExport,
} from 'services/cerebroApi'
import {
    mountHomePageSuccess,
    mountHomePageFailure,
    fetchHomePageDataSuccess,
    fetchHomePageDataFailure,
    fetchHomePageSponsoredProductTimeseriesSuccess,
    fetchHomePageHeadlineSearchTimeseriesSuccess,
    fetchHomePageAggregateSuccess,
    downloadHomePageTimeseriesSuccess,
    downloadHomePageTimeseriesFailure,
} from 'actions/ui'
import {
    selectVisiblePageFilters,
    selectPageFactTypes,
    selectCurrencyCode,
} from 'selectors/ui'

import cerebroApiSaga from 'sagas/common/cerebroApi'
import { fetchPageFilterSettingsSaga } from '../shared/workers'

const getAggregateApi = factTypes => {
    if (factTypes.length === 2) {
        return getAllFactAggregate
    }

    if (factTypes[0].value === SPONSORED_PRODUCT) {
        return getSponsoredProductFactAggregate
    }

    if (factTypes[0].value === HEADLINE_SEARCH) {
        return getHeadlineSearchFactAggregate
    }

    return null
}

function* fetchHomeSponsoredProductFactsTimeseriesSaga() {
    const factTypes = yield select(selectPageFactTypes, HOME_PAGE)
    if (factTypes.length === 2 || factTypes[0].value === SPONSORED_PRODUCT) {
        const filters = yield select(selectVisiblePageFilters, HOME_PAGE)
        const currency = yield select(selectCurrencyCode)
        const params = {
            ...formatFilters(filters),
            currency,
        }
        params.currency = currency
        yield call(
            cerebroApiSaga,
            fetchHomePageSponsoredProductTimeseriesSuccess,
            getSponsoredProductFactTimeseries,
            params
        )
    } else {
        yield put(fetchHomePageSponsoredProductTimeseriesSuccess([]))
    }
}

function* fetchHomeHeadlineSearchFactsTimeseriesSaga() {
    const factTypes = yield select(selectPageFactTypes, HOME_PAGE)
    if (factTypes.length === 2 || factTypes[0].value === HEADLINE_SEARCH) {
        const filters = yield select(selectVisiblePageFilters, HOME_PAGE)
        const currency = yield select(selectCurrencyCode)
        const params = {
            ...formatFilters(filters),
            currency,
        }
        params.currency = currency
        yield call(
            cerebroApiSaga,
            fetchHomePageHeadlineSearchTimeseriesSuccess,
            getHeadlineSearchFactTimeseries,
            params
        )
    } else {
        yield put(fetchHomePageHeadlineSearchTimeseriesSuccess([]))
    }
}

function* fetchHomeFactAggregateSaga() {
    const filters = yield select(selectVisiblePageFilters, HOME_PAGE)
    const factTypes = yield select(selectPageFactTypes, HOME_PAGE)
    const currency = yield select(selectCurrencyCode)
    const params = {
        ...formatFilters(filters),
        currency,
    }
    params.currency = currency
    const aggregateApi = getAggregateApi(factTypes)
    yield call(
        cerebroApiSaga,
        fetchHomePageAggregateSuccess,
        aggregateApi,
        params
    )
}

function* downloadHomePageTimeseriesSaga() {
    const filters = yield select(selectVisiblePageFilters, HOME_PAGE)
    const currency = yield select(selectCurrencyCode)
    const params = {
        ...formatFilters(filters),
        currency,
    }

    const response = yield call(
        cerebroApiSaga,
        downloadHomePageTimeseriesSuccess,
        getAllFactTimeseriesExport,
        params
    )

    yield call(downloadCsv, response.data, 'home-timeseries')
}

function* fetchHomePageDataSaga() {
    yield all([
        call(fetchHomeSponsoredProductFactsTimeseriesSaga),
        call(fetchHomeHeadlineSearchFactsTimeseriesSaga),
        call(fetchHomeFactAggregateSaga),
    ])
}

/**
 * Downloads timeseries data for the Home Page
 */
export function* downloadHomePageTimeseriesWorker() {
    try {
        yield call(downloadHomePageTimeseriesSaga)
    } catch (error) {
        yield put(downloadHomePageTimeseriesFailure(error))
    }
}

/**
 * Fetches all data required for the Home Page
 */
export function* fetchHomePageDataWorker() {
    try {
        yield call(fetchHomePageDataSaga)
        yield put(fetchHomePageDataSuccess())
    } catch (error) {
        yield put(fetchHomePageDataFailure(error))
    }
}

/**
 * Mounts the Home Page and fetches data
 */
export function* mountHomePageWorker() {
    try {
        yield call(fetchPageFilterSettingsSaga, HOME_PAGE)
        yield call(fetchHomePageDataSaga)
        yield put(mountHomePageSuccess())
    } catch (error) {
        yield put(mountHomePageFailure(error))
    }
}
