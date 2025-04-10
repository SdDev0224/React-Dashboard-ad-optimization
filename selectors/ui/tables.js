import createCachedSelector from 're-reselect'

import { METRIC_COLUMNS_ORDER } from 'configuration/tables'

import { selectDomainValue } from './ui'

export const selectTableSelectedMetrics = createCachedSelector(
    (state, pageName, tableName) =>
        selectDomainValue(state, [
            pageName,
            tableName,
            'columnSettings',
            'displayState',
        ]),
    displayState => METRIC_COLUMNS_ORDER.filter(metric => displayState[metric])
)((state, pageName, tableName) => `${pageName}|${tableName}`)
