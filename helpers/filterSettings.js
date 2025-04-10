import isArray from 'lodash/isArray'
import isString from 'lodash/isString'
import isPlainObject from 'lodash/isPlainObject'
import reduce from 'lodash/reduce'
import identity from 'lodash/identity'
import sortBy from 'lodash/fp/sortBy'

/**
 * Represents the schema for filter settings which are stored
 * in DynamoDB.
 *
 * This object is should be updated when the schema changes.
 */
const FILTERS_DISPLAY_STATE_SCHEMA = {
    Domain: isString,
    UserId: isString,
    order: isArray,
    displayState: isPlainObject,
    anchored: isArray,
}

const sameKeys = persisted =>
    JSON.stringify(Object.keys(FILTERS_DISPLAY_STATE_SCHEMA).sort()) ===
    JSON.stringify(Object.keys(persisted).sort())

const sameTypes = persisted =>
    reduce(
        FILTERS_DISPLAY_STATE_SCHEMA,
        (count, typeCheckFun, key) => {
            if (!typeCheckFun(persisted[key])) {
                return count + 1
            }
            return count
        },
        0
    ) === 0

const sameFilters = (persisted, other) => {
    const immutableSort = sortBy(identity)
    return (
        JSON.stringify(immutableSort(persisted.order)) ===
        JSON.stringify(immutableSort(other.order))
    )
}

/**
 * Check if a settings schema matches the current settings schema
 *
 * @param persisted the persisted settings from DynamoDB
 * @param other the settings to compare against
 * @returns {boolean} true if the persisted schema matches the current schema
 */
export const isCurrentSchema = (persisted, other) =>
    sameKeys(persisted) && sameTypes(persisted) && sameFilters(persisted, other)

/**
 * Create a settings object for persisting in DynamoDB
 *
 * @param userId
 * @param page
 * @param anchored
 * @param order
 * @param displayState
 * @returns {{UserId: *, Domain: string, order: *, displayState: *}}
 */
export const createFilterSettingsItem = ({
    userId,
    page,
    anchored,
    order,
    displayState,
}) => ({
    UserId: userId,
    Domain: `${page}-filterSettings`,
    anchored,
    order,
    displayState,
})

/**
 * Create a key that can be used to fetch settings from DynamoDB
 *
 * @param userId
 * @param page
 *
 * @returns {{UserId: *, Domain: string}}
 */
export const createFilterSettingsKey = ({ userId, page }) => ({
    UserId: userId,
    Domain: `${page}-filterSettings`,
})
