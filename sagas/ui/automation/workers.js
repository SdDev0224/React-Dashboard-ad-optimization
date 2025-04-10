import { call, put, all, select } from 'redux-saga/effects'

import {
    getAutomationDescription,
    getChangelog,
    getRecommendations,
} from 'services/cerebroApi'
import {
    // mounting
    mountAutomationPageSuccess,
    mountAutomationPageFailure,

    // description
    fetchAutomationPageDescriptionSuccess,

    // page data
    fetchAutomationPageDataSuccess,
    fetchAutomationPageDataFailure,

    // table data
    fetchAutomationPageChangelogTableFailure,
    fetchAutomationPageChangelogTableSuccess,
    fetchAutomationPageRecommendationsTableFailure,
    fetchAutomationPageRecommendationsTableSuccess,
} from 'actions/ui'
import cerebroApiSaga from 'sagas/common/cerebroApi'
import { AUTOMATION_PAGE } from 'constants/pages'
import {
    selectDomainValue as selectUiDomainValue,
    selectVisiblePageFilters,
} from 'selectors/ui'
import { selectDomainValue as selectAuthDomainValue } from 'selectors/auth'
import { formatPagination, formatSorter } from 'helpers/params'
import { formatFilters } from 'helpers/ui/automationPage'
import { hasPermissions } from 'helpers/featurePermissions'
import { AUTOMATION } from 'constants/featurePermissions'
import {
    fetchPageFilterSettingsSaga,
    fetchTableSettingsSaga,
} from '../shared/workers'

function* fetchAutomationPageChangelogTableSaga() {
    const filters = yield select(selectVisiblePageFilters, AUTOMATION_PAGE)
    const { pagination, sorter } = yield select(selectUiDomainValue, [
        AUTOMATION_PAGE,
        'changelogTable',
    ])
    const params = {
        ...formatPagination(pagination),
        ...formatSorter(sorter),
        ...formatFilters(filters),
    }

    yield call(
        cerebroApiSaga,
        fetchAutomationPageChangelogTableSuccess,
        getChangelog,
        params
    )
}

function* fetchAutomationPageRecommendationsTableSaga() {
    const { pagination, sorter } = yield select(selectUiDomainValue, [
        AUTOMATION_PAGE,
        'recommendationsTable',
    ])
    const params = {
        ...formatPagination(pagination),
        ...formatSorter(sorter),
    }

    yield call(
        cerebroApiSaga,
        fetchAutomationPageRecommendationsTableSuccess,
        getRecommendations,
        params
    )
}

function* fetchAutomationDescriptionSaga() {
    yield call(
        cerebroApiSaga,
        fetchAutomationPageDescriptionSuccess,
        getAutomationDescription
    )
}

function* fetchAutomationPageDataSaga() {
    const featurePermissions = yield select(
        selectAuthDomainValue,
        'featurePermissions'
    )

    if (hasPermissions(featurePermissions, AUTOMATION)) {
        yield all([
            call(fetchAutomationDescriptionSaga),
            call(fetchAutomationPageChangelogTableSaga),
            call(fetchAutomationPageRecommendationsTableSaga),
        ])
    }
}

/**
 * Fetches data for Automation Page Recommendations Table
 */
export function* fetchAutomationPageRecommendationsTableWorker() {
    try {
        yield call(fetchAutomationPageRecommendationsTableSaga)
    } catch (error) {
        yield put(fetchAutomationPageRecommendationsTableFailure(error))
    }
}

/**
 * Fetches data for Automation Page Changelog Table
 */
export function* fetchAutomationPageChangelogTableWorker() {
    try {
        yield call(fetchAutomationPageChangelogTableSaga)
    } catch (error) {
        yield put(fetchAutomationPageChangelogTableFailure(error))
    }
}

/**
 * Fetches all data required for the Automation Page
 */
export function* fetchAutomationPageDataWorker() {
    try {
        yield call(fetchAutomationPageDataSaga)
        yield put(fetchAutomationPageDataSuccess())
    } catch (error) {
        yield put(fetchAutomationPageDataFailure(error))
    }
}

/**
 * Mounts the Automation Page and fetches data
 */
export function* mountAutomationPageWorker() {
    try {
        yield call(fetchPageFilterSettingsSaga, AUTOMATION_PAGE)
        yield call(fetchTableSettingsSaga, AUTOMATION_PAGE, 'changelogTable')
        yield call(
            fetchTableSettingsSaga,
            AUTOMATION_PAGE,
            'recommendationsTable'
        )
        yield call(fetchAutomationPageDataSaga)
        yield put(mountAutomationPageSuccess())
    } catch (error) {
        yield put(mountAutomationPageFailure(error))
    }
}
