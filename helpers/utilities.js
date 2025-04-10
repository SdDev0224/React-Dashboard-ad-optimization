import isArray from 'lodash/isArray'
import union from 'lodash/union'
import { ALL_IDS } from 'constants/reducerKeys'

/**
 * Customizer function used in conjuction with lodash mergeWith
 * to handle the use case of merging two arrays.
 *
 * Lodash merge by default always replaces objValue with srcValue,
 * but we have a special case in our entities ALL_IDS property
 * where we want the union of the two arrays returned from merge.
 *
 * @param {*} objValue The destination value
 * @param {*} srcValue The source value
 * @param {*} key The key of the values being merged
 */
export const mergeArray = (objValue, srcValue, key) => {
    if (isArray(objValue)) {
        if (key === ALL_IDS) {
            return union(objValue, srcValue)
        }
        return srcValue
    }

    return undefined
}
