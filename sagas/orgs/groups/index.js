import { call, select } from 'redux-saga/effects'

import cerebroApiSaga from 'sagas/common/cerebroApi'
import {
    fetchOrganizationGroupSuccess,
    fetchOrganizationGroupsSuccess,
} from 'actions/orgs'
import {
    getOrganizationGroup,
    getOrganizationGroups,
} from 'services/cerebroApi'
import { selectOrganizationGroup } from 'selectors/orgs'

export function* fetchOrganizationGroupSaga(organizationGroupId) {
    const group = yield select(selectOrganizationGroup, organizationGroupId)

    if (!group) {
        yield call(
            cerebroApiSaga,
            fetchOrganizationGroupSuccess,
            getOrganizationGroup,
            organizationGroupId
        )
    }
}

export function* fetchOrganizationGroupsSaga(organizationId) {
    yield call(
        cerebroApiSaga,
        fetchOrganizationGroupsSuccess,
        getOrganizationGroups,
        organizationId
    )
}
