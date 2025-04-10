import { call, select } from 'redux-saga/effects'

import cerebroApiSaga from 'sagas/common/cerebroApi'
import {
    fetchOrganizationsSuccess,
    fetchOrganizationSuccess,
} from 'actions/orgs'
import { getUserOrganizations, getOrganization } from 'services/cerebroApi'
import { selectOrganization } from 'selectors/orgs'

export function* fetchOrganizationsSaga() {
    return yield call(
        cerebroApiSaga,
        fetchOrganizationsSuccess,
        getUserOrganizations
    )
}

export function* fetchOrganizationSaga(organizationId) {
    const org = yield select(selectOrganization, organizationId)

    if (!org) {
        yield call(
            cerebroApiSaga,
            fetchOrganizationSuccess,
            getOrganization,
            organizationId
        )
    }
}
