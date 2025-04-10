import { selectDomainValue } from './ui'

export const selectGlobalNotification = state =>
    selectDomainValue(state, ['app', 'globalNotification'])
