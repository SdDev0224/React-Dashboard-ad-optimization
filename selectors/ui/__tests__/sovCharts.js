import { SOV_KEYWORD_PAGE } from 'constants/pages'
import { SOV_AGGREGATION_UNIT } from 'constants/reducerKeys'
import { AGGREGATION } from 'constants/filters'
import {
    fetchSovKeywordPageSovChartSuccess,
    updatePageFilter,
} from 'actions/ui'
import reducer from 'reducers'

import { selectDataForSovChart } from '../sovCharts'
import { sovKeywordData } from '../__data__/sovKeywordData'

describe('[Selectors] ui/sovCharts', () => {
    let state

    describe('selectDataForSovChart', () => {
        const pageName = SOV_KEYWORD_PAGE

        beforeEach(() => {
            // action to update sov data
            state = reducer(
                state,
                fetchSovKeywordPageSovChartSuccess(sovKeywordData)
            )
        })

        it('selects chart data correctly', () => {
            const { series } = selectDataForSovChart(state, pageName)
            expect(series).toMatchSnapshot()
        })

        it('memoizes chart settings', () => {
            // call the selector
            selectDataForSovChart(state, pageName)

            // get the actual selector that was used
            const selector = selectDataForSovChart.getMatchingSelector(
                state,
                pageName
            )

            // Reset computations to 0
            selector.resetRecomputations()

            // Call selector without state change and expect no new computations
            selectDataForSovChart(state, pageName)
            selectDataForSovChart(state, pageName)
            expect(selector.recomputations()).toEqual(0)

            // Update state with new aggregation
            state = reducer(
                state,
                updatePageFilter({
                    pageName,
                    data: {
                        key: AGGREGATION,
                        value: SOV_AGGREGATION_UNIT.MONTH,
                    },
                })
            )

            // Call selector after state change and expect a new computation
            selectDataForSovChart(state, pageName)
            selectDataForSovChart(state, pageName)
            expect(selector.recomputations()).toEqual(1)
        })
    })
})
