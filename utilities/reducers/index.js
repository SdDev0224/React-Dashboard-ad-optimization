import { combineReducers } from 'redux'
import pick from 'lodash/pick'

/**
 * Combine parent reducer and children reducers
 *
 * @param {function} parentReducer - Parent reducer
 * @param {object} childrenReducers - Children reducers map
 *
 * @returns {function} - Combined reducer
 */
export const combineChildrenReducers = (parentReducer, childrenReducers) => (
    state,
    action
) => {
    const nextParentState = parentReducer(state, action)

    // reducer combined by `combineReducers()` expects the state to have
    // only the keys that belongs to sub reducers.
    // So, it filters out data for children combined reducer only from the state
    //
    // @see https://github.com/reduxjs/redux/blob/master/src/combineReducers.js#L57
    const childrenReducer = combineReducers(childrenReducers)
    const childrenState = pick(nextParentState, Object.keys(childrenReducers))
    const nextChildrenState = childrenReducer(childrenState, action)

    return {
        ...nextParentState,
        ...nextChildrenState,
    }
}
