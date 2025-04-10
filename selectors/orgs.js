import { createSelector } from 'reselect'
import createCachedSelector from 're-reselect'
import values from 'lodash/values'
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'

import { formatBrandName } from 'helpers/formatting'
import { BY_ID, BY_ORG_ID } from 'constants/reducerKeys'

const getOrganizations = state => state.orgs.organizations
const getOrganizationGroups = state => state.orgs.groups
const getUsers = state => state.orgs.users
const getUserPermissions = state => state.orgs.userPermissions

// organizations
export const selectOrganizations = createSelector(
    getOrganizations,
    orgs => values(orgs)
)

export const selectOrganization = createCachedSelector(
    getOrganizations,
    (state, orgId) => orgId,
    (orgs, orgId) => get(orgs, [orgId])
)((state, orgId) => orgId)

export const selectCurrentOrganization = createSelector(
    state => get(state, ['auth', 'organizationId']),
    getOrganizations,
    (orgId, orgs) => get(orgs, [orgId])
)

// org groups
export const selectOrganizationGroup = createCachedSelector(
    getOrganizationGroups,
    (state, groupId) => groupId,
    (groups, groupId) => get(groups, [groupId])
)((state, groupId) => groupId)

export const selectOrganizationGroups = createCachedSelector(
    getOrganizationGroups,
    (state, orgId) => orgId,
    (groups, orgId) =>
        values(groups).filter(group => group.organization === orgId)
)((state, orgId) => orgId)

// org members
export const selectOrganizationMembers = createCachedSelector(
    getUsers,
    selectOrganization,
    (users, org) =>
        org && org.members ? org.members.map(userId => users[userId]) : []
)((state, orgId) => orgId)

export const selectOrganizationGroupMembers = createCachedSelector(
    getUsers,
    selectOrganizationGroup,
    (users, group) =>
        group && group.members ? group.members.map(userId => users[userId]) : []
)((state, groupId) => groupId)

// user permissions
export const selectOrganizationUserPermissions = createCachedSelector(
    getUserPermissions,
    (state, orgId) => orgId,
    (permissions, orgId) => get(permissions, [BY_ORG_ID, orgId])
)((state, orgId) => orgId)

// owner
export const selectOrganizationOwner = createCachedSelector(
    getUsers,
    selectOrganization,
    (users, org) => users[org.owner]
)((state, orgId) => orgId)

// search brands that can be used in permissions for an organization
export const selectOrganizationBrandsForSearch = createCachedSelector(
    state => state.entities.brands,
    selectOrganization,
    (brands, org) => {
        if (org.brands) {
            const options = org.brands.map(brandId => ({
                value: brandId,
                label: formatBrandName(brands[BY_ID][brandId]),
            }))
            return sortBy(options, 'label')
        }
        return []
    }
)((state, orgId) => orgId)
