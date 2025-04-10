import createCachedSelector from 're-reselect'
import get from 'lodash/get'
import groupBy from 'lodash/groupBy'
import last from 'lodash/last'
import isEmpty from 'lodash/isEmpty'
import flow from 'lodash/flow'
import map from 'lodash/fp/map'
import orderBy from 'lodash/fp/orderBy'

import moment from 'utilities/moment'
import { SOV_CHART } from 'constants/reducerKeys'
import { SOV_AGGREGATION, SOV_BRANDS } from 'constants/filters'
import { UNDEFINED_BRAND } from 'constants/formatting'

import { selectDomainValue } from './ui'
import { selectPageFilters } from './filters'

const mapWithKey = map.convert({ cap: false })

const selectPageSovChartData = (state, pageName) =>
    selectDomainValue(state, [pageName, SOV_CHART, 'data'])

export const selectPageSovChartWeight = (state, pageName) =>
    selectDomainValue(state, [pageName, SOV_CHART, 'weight'])

export const selectDataForSovChart = createCachedSelector(
    selectPageSovChartData,
    selectPageSovChartWeight,
    selectPageFilters,
    (chartData, weightKey, filters) => {
        // format data as a highcharts series
        const aggregate = filters[SOV_AGGREGATION]
        const filteredBrands = get(filters, SOV_BRANDS, [])
        const lowerCaseFilteredBrandNames = filteredBrands.map(brandFilter =>
            brandFilter.value.toLowerCase()
        )

        // group data by brands
        const brandGroups = groupBy(
            chartData,
            result => result.metadata__brand || UNDEFINED_BRAND
        )

        // used to calculate group with most data points
        const maxDataPoints = Math.max(
            ...Object.values(brandGroups).map(brandData => brandData.length)
        )

        const series = flow(
            mapWithKey((brandData, brandName) => {
                const selected = lowerCaseFilteredBrandNames.includes(
                    brandName.toLowerCase()
                )
                const points = flow(
                    map(result => ({
                        x: moment(result[aggregate]).valueOf(),
                        y: result[weightKey],
                    })),

                    // Sort in ascending X order
                    orderBy(point => point.x, 'asc')
                )(brandData)

                return {
                    name: brandName,
                    data: points,
                    selected,

                    // If brands filter is not empty, show areas in transparency by default
                    fillOpacity: isEmpty(filteredBrands) ? null : 0.3,

                    // Style for brands selected in filter
                    ...(selected && {
                        fillOpacity: 1, // Fill area with solid color
                        lineColor: '#ffffff', // Highlight area line with white color
                        marker: {
                            symbol: 'diamond', // Show marker in diamond
                            radius: 8, // Enlarge marker
                        },
                    }),
                }
            }),

            orderBy(
                [
                    // Place brands selected in filter on top
                    brandSeries => (brandSeries.selected ? 1 : 0),

                    // Sort in desc order of y-axis, using most recent data point
                    brandSeries => last(brandSeries.data).y,
                ],
                ['desc', 'desc']
            )
        )(brandGroups)

        return { series, maxDataPoints }
    }
)((state, pageName) => pageName)

export const selectLoadingForSovChart = (state, pageName) =>
    selectDomainValue(state, [pageName, SOV_CHART, 'loading'])
