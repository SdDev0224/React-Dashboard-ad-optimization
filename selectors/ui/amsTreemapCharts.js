import { createSelector } from 'reselect'
import get from 'lodash/get'
import flow from 'lodash/fp/flow'
import filter from 'lodash/fp/filter'
import orderBy from 'lodash/fp/orderBy'
import map from 'lodash/fp/map'

import { formatNumber } from 'helpers/formatting'
import { metrics } from 'configuration/metrics'

import { selectDomainValue } from './ui'

export const selectTreemapSelectedMetric = (state, pageName, treemapName) =>
    selectDomainValue(state, [pageName, treemapName, 'sorter', 'field'])

export const selectTreemap = (state, pageName, treemapName) =>
    selectDomainValue(state, [pageName, treemapName])

export const selectTreemapChartData = createSelector(
    selectTreemap,
    ({ data, sorter }) =>
        flow(
            filter(row => get(row, sorter.field, 0) > 0),
            orderBy([sorter.field], ['desc']), // Always order in descending order
            map(row => {
                const metricMetadata = metrics[sorter.field]
                const value = row[sorter.field]

                return {
                    metric: {
                        nativeValue: value,
                        formattedValue: formatNumber(
                            value,
                            metricMetadata.format
                        ),
                    },
                    metricMetadata,
                    resourceData: row,
                }
            })
        )(data)
)
