import { createAction } from 'redux-actions'

// fetch organization members
export const fetchOrganizationMembersSuccess = createAction(
    'FETCH_ORGANIZATION_MEMBERS_SUCCESS'
)

// fetch organization group members
export const fetchOrganizationGroupMembersSuccess = createAction(
    'FETCH_ORGANIZATION_GROUP_MEMBERS_SUCCESS'
)
