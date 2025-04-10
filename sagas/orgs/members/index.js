import { call, put } from 'redux-saga/effects'

import cerebroApiSaga from 'sagas/common/cerebroApi'
import {
    fetchOrganizationMembersSuccess,
    fetchOrganizationGroupMembersSuccess,
} from 'actions/orgs'
import {
    getOrganizationMembers,
    getOrganizationGroupMembers,
} from 'services/cerebroApi'

export function* fetchOrganizationMembersSaga(organizationId) {
    const {
        data: { results: members },
    } = yield call(cerebroApiSaga, null, getOrganizationMembers, organizationId)
    yield put(fetchOrganizationMembersSuccess({ members, organizationId }))
}

export function* fetchOrganizationGroupMembersSaga(organizationGroupId) {
    const {
        data: { results: members },
    } = yield call(
        cerebroApiSaga,
        null,
        getOrganizationGroupMembers,
        organizationGroupId
    )
    yield put(
        fetchOrganizationGroupMembersSuccess({ members, organizationGroupId })
    )
}
