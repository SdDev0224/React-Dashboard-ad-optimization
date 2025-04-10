import createCachedSelector from 're-reselect'
import map from 'lodash/fp/map'
import flow from 'lodash/flow'
import orderBy from 'lodash/fp/orderBy'
import moment from 'utilities/moment'

import { ORGANIC_SEARCH_POSITION_CHART } from 'constants/reducerKeys'
import { SOV_KEYWORD_ORGANIC_SEARCH_POSITION_KEY } from 'constants/sovKeywords'
import { SOV_AGGREGATION } from 'constants/filters'

import { selectDomainValue } from './ui'
import { selectPageFilters } from './filters'

const selectPageOrganicSearchPositionChartData = (state, pageName) =>
    selectDomainValue(state, [pageName, ORGANIC_SEARCH_POSITION_CHART, 'data'])

export const selectDataForOrganicSearchPositionChart = createCachedSelector(
    selectPageOrganicSearchPositionChartData,
    selectPageFilters,
    (chartData, filters) => {
        const aggregate = filters[SOV_AGGREGATION]
        const points = flow(
            map(result => {
                const yValue = result[SOV_KEYWORD_ORGANIC_SEARCH_POSITION_KEY]
                return {
                    x: moment(result[aggregate]).valueOf(),
                    y: yValue !== -1 ? yValue + 1 : null,
                }
            }),
            orderBy(point => point.x, 'asc')
        )(chartData)
        const series = [
            {
                name: 'Organic Search Position',
                data: points,
            },
        ]

        return { series }
    }
)((state, pageName) => pageName)

export const selectSelectedAsinForOrganicSearchPositionChart = (
    state,
    pageName
) =>
    selectDomainValue(state, [
        pageName,
        ORGANIC_SEARCH_POSITION_CHART,
        'selectedAsin',
    ])

export const selectLoadingForOrganicSearchPositionChart = (state, pageName) =>
    selectDomainValue(state, [
        pageName,
        ORGANIC_SEARCH_POSITION_CHART,
        'loading',
    ])
