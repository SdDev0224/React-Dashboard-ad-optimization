import { createSelector } from 'reselect'
import map from 'lodash/fp/map'
import flow from 'lodash/flow'
import orderBy from 'lodash/fp/orderBy'
import { selectDomainValue } from './ui'

const selectLabels = state =>
    selectDomainValue(state, ['app', 'organizationLabels'])

export const selectLabelsForFilters = createSelector(
    selectLabels,
    labels =>
        flow(
            map(label => ({
                label: label.name,
                value: label.id,
            })),
            orderBy(label => label.name, 'asc')
        )(labels)
)
