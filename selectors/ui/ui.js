import createCachedSelector from 're-reselect'
import get from 'lodash/get'

export const selectDomainState = state => state.ui

export const selectDomainValue = createCachedSelector(
    selectDomainState,
    (state, path) => path,
    (domainState, path) => get(domainState, path)
)((state, path) => JSON.stringify(path))
