import set from 'lodash/fp/set'

import {
    HOME_PAGE,
    BRANDS_SUMMARY_PAGE,
    BRAND_PAGE,
    CAMPAIGN_PAGE,
    PRODUCTS_SUMMARY_PAGE,
    KEYWORDS_SUMMARY_PAGE,
} from 'constants/pages'
import { deepFreeze } from 'helpers/deepFreeze'
import { FILTERS, CHARTS } from 'constants/reducerKeys'
import { updatePageFilter, updateChartMetrics } from 'actions/ui'

import reducer from '../ui'

const defaultState = reducer(undefined, { type: undefined })

deepFreeze(defaultState)

describe('[Reducers] ui', () => {
    describe('updatePageFilter', () => {
        it('sets UI filters for each page', () => {
            const pages = [
                HOME_PAGE,
                BRANDS_SUMMARY_PAGE,
                BRAND_PAGE,
                CAMPAIGN_PAGE,
                PRODUCTS_SUMMARY_PAGE,
                KEYWORDS_SUMMARY_PAGE,
            ]

            const filterKey = 'metricName'

            const filterValue = ['filterA', 'filterB']

            pages.forEach(page => {
                const action = updatePageFilter({
                    pageName: page,
                    data: {
                        key: filterKey,
                        value: filterValue,
                    },
                })

                const nextState = reducer(defaultState, action)

                expect(nextState[page][FILTERS][filterKey]).toEqual(filterValue)
            })
        })
    })

    describe('updateChartMetrics', () => {
        const pageName = HOME_PAGE
        const chartName = 'reachAllFacts'
        const key = 'aggregateBy'
        const value = 'day'

        const expectedState = set(
            [pageName, CHARTS, chartName, key],
            value,
            defaultState
        )

        it('sets a non-existing settings key to passed value', () => {
            const action = updateChartMetrics({
                pageName,
                chartName,
                key,
                value,
            })

            const nextState = reducer(defaultState, action)

            expect(nextState).toEqual(expectedState)
        })

        it('updates an existing settings key to passed value', () => {
            const firstAction = updateChartMetrics({
                pageName,
                chartName,
                key,
                value: 'week',
            })

            const intermediateState = reducer(defaultState, firstAction)
            deepFreeze(intermediateState)

            const secondAction = updateChartMetrics({
                pageName,
                chartName,
                key,
                value,
            })

            const nextState = reducer(intermediateState, secondAction)

            expect(nextState).toEqual(expectedState)
        })
    })
})
