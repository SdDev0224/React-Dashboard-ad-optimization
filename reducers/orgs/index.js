import { handleActions, combineActions } from 'redux-actions'
import { normalize } from 'normalizr'
import mergeWith from 'lodash/fp/mergeWith'
import set from 'lodash/fp/set'

import {
    fetchOrganizationsSuccess,
    fetchOrganizationGroupSuccess,
    fetchOrganizationMembersSuccess,
    fetchOrganizationGroupMembersSuccess,
    fetchUserPermissionsSuccess,
    fetchOrganizationSuccess,
    fetchOrganizationGroupsSuccess,
} from 'actions/orgs'
import {
    createProfilePageOrganizationSuccess,
    searchOrganizationPageBrandsSuccess,
    searchOrganizationGroupPageBrandsSuccess,
    removeMemberOrganizationGroupPageSuccess,
    updateNameOrganizationGroupPageSuccess,
    updateResourcesOrganizationGroupPageSuccess,
    updatePermissionsOrganizationGroupPageSuccess,
} from 'actions/ui'
import { signInSuccess, signOutSuccess } from 'actions/auth'
import { BY_ORG_ID } from 'constants/reducerKeys'
import {
    organizationListSchema,
    organizationSchema,
    organizationGroupSchema,
    organizationGroupListSchema,
    userListSchema,
    brandListSchema,
} from 'schemas'
import { mergeArray } from 'helpers/utilities'

const defaultState = {
    organizations: {},
    groups: {},
    userPermissions: { [BY_ORG_ID]: {} },
    users: {},
}

export default handleActions(
    {
        // organizations
        [signInSuccess](state, action) {
            const {
                entities: { organizations, users },
            } = normalize(action.payload.organizations, organizationListSchema)

            return mergeWith(mergeArray, state, {
                organizations,
                users,
            })
        },
        [fetchOrganizationsSuccess](state, action) {
            const {
                entities: { organizations, users },
            } = normalize(action.payload, organizationListSchema)

            return mergeWith(mergeArray, state, {
                organizations,
                users,
            })
        },
        [combineActions(
            fetchOrganizationSuccess,
            createProfilePageOrganizationSuccess
        )](state, action) {
            const {
                entities: { organizations, users },
            } = normalize(action.payload, organizationSchema)

            return mergeWith(mergeArray, state, {
                organizations,
                users,
            })
        },

        // groups
        [combineActions(
            fetchOrganizationGroupSuccess,
            updateNameOrganizationGroupPageSuccess,
            updateResourcesOrganizationGroupPageSuccess,
            updatePermissionsOrganizationGroupPageSuccess
        )](state, action) {
            const {
                entities: { groups, organizations, users },
            } = normalize(action.payload, organizationGroupSchema)
            return mergeWith(mergeArray, state, {
                groups,
                organizations,
                users,
            })
        },
        [fetchOrganizationGroupsSuccess](state, action) {
            const {
                entities: { groups, users, organizations },
            } = normalize(action.payload.results, organizationGroupListSchema)
            return mergeWith(mergeArray, state, {
                groups,
                organizations,
                users,
            })
        },

        // members
        [fetchOrganizationMembersSuccess](state, action) {
            const { members, organizationId } = action.payload
            const {
                entities: { users },
                result,
            } = normalize(members, userListSchema)
            return mergeWith(mergeArray, state, {
                users,
                organizations: {
                    [organizationId]: {
                        members: result,
                    },
                },
            })
        },
        [fetchOrganizationGroupMembersSuccess](state, action) {
            const { members, organizationGroupId } = action.payload
            const {
                entities: { users },
                result,
            } = normalize(members, userListSchema)
            return mergeWith(mergeArray, state, {
                users,
                groups: {
                    [organizationGroupId]: {
                        members: result,
                    },
                },
            })
        },
        [removeMemberOrganizationGroupPageSuccess](state, action) {
            const { organizationGroupId, memberId } = action.payload
            return set(
                ['groups', organizationGroupId, 'members'],
                state.groups[organizationGroupId].members.filter(
                    member => member !== memberId
                ),
                state
            )
        },

        // userPermissions
        [fetchUserPermissionsSuccess](state, action) {
            const { permissions, organizationId } = action.payload
            return set(
                ['userPermissions', BY_ORG_ID, organizationId],
                permissions,
                state
            )
        },

        // brands
        [combineActions(
            searchOrganizationPageBrandsSuccess,
            searchOrganizationGroupPageBrandsSuccess
        )](state, action) {
            const { results, organizationId } = action.payload
            const { result } = normalize(results, brandListSchema)

            return mergeWith(mergeArray, state, {
                organizations: {
                    [organizationId]: {
                        brands: result,
                    },
                },
            })
        },

        // sign out
        [signOutSuccess]() {
            return defaultState
        },
    },
    defaultState
)
