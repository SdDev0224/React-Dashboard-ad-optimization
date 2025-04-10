import get from 'lodash/get'

import {
    SOV_READ,
    SOV_WRITE,
    ASSUME_ANY_ORGANIZATION_GROUP,
    FEATURE_PERMISSIONS_KEYS,
    ORGANIZATION_ADMIN,
    AUTOMATION,
    MANAGE_LABELS,
    MANAGE_CAMPAIGN_AUTOMATION,
} from 'constants/featurePermissions'
import { FEATURE_METADATA } from 'configuration/featurePermissions'

export const hasPermissions = (userFeaturePermissions, permission) =>
    userFeaturePermissions.includes(permission)

export const hasSovPermissions = userFeaturePermissions =>
    hasPermissions(userFeaturePermissions, SOV_READ) ||
    hasPermissions(userFeaturePermissions, SOV_WRITE)

export const hasCustomerServicePermissions = userFeaturePermissions =>
    hasPermissions(userFeaturePermissions, ASSUME_ANY_ORGANIZATION_GROUP)

export const hasOrgAdminPermissions = userFeaturePermissions =>
    hasPermissions(userFeaturePermissions, ORGANIZATION_ADMIN)

export const hasAutomationPermissions = userFeaturePermissions =>
    hasPermissions(userFeaturePermissions, AUTOMATION)

export const hasManageLabelsPermissions = userFeaturePermissions =>
    hasPermissions(userFeaturePermissions, MANAGE_LABELS)

export const hasManageCampaignAutomationPermissions = userFeaturePermissions =>
    hasPermissions(userFeaturePermissions, MANAGE_CAMPAIGN_AUTOMATION)

/**
 * Generates array of permissions that are displayed to the User
 *
 * @param userPermissions
 * @returns {Array}
 */
export const getFeaturePermissionsData = userPermissions =>
    FEATURE_PERMISSIONS_KEYS.reduce((accumulator, key) => {
        const { title, description, condition } = FEATURE_METADATA[key]
        if (condition(userPermissions)) {
            accumulator.push({
                title,
                description,
                hasPermissions: hasPermissions(userPermissions, key),
            })
        }
        return accumulator
    }, [])

export function getPermissionOption(permission) {
    return {
        label: get(FEATURE_METADATA[permission], 'title', ''),
        value: permission,
    }
}
