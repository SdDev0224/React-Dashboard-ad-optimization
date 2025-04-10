import { createSelector } from 'reselect'

import { selectDomainValue, selectDomainState } from './ui'

export const selectPageDownloading = (state, pageName) =>
    selectDomainValue(state, [pageName, 'downloading'])

export const selectCurrencyCode = createSelector(
    selectDomainState,
    uiState => uiState.app.currencyCode
)
