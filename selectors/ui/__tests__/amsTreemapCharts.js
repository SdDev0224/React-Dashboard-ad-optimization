import { BRANDS_SUMMARY_PAGE } from 'constants/pages'
import reducer from 'reducers'
import {
    fetchBrandsSummaryPageTreemapSuccess,
    updateTreemapSorterForPageTreemap,
} from 'actions/ui'

import { selectTreemapChartData } from '../amsTreemapCharts'
import { amsAggregateData } from '../__data__/amsAggregateData'

describe('[Selectors] ui/amsTreemapCharts', () => {
    let state

    describe('selectTreemapChartData', () => {
        const pageName = BRANDS_SUMMARY_PAGE
        const chartName = 'treemap'

        beforeEach(() => {
            // save api data to state
            state = reducer(
                undefined,
                fetchBrandsSummaryPageTreemapSuccess(amsAggregateData)
            )
        })

        it('selects data correctly', () => {
            const data1 = selectTreemapChartData(state, pageName, chartName)

            expect(data1).toMatchSnapshot()

            // Change the selected sort field
            state = reducer(
                state,
                updateTreemapSorterForPageTreemap({
                    pageName: BRANDS_SUMMARY_PAGE,
                })({
                    field: 'ctr',
                    order: 'descend',
                    filterPositiveValues: true,
                })
            )

            const data2 = selectTreemapChartData(state, pageName, chartName)

            expect(data2).toMatchSnapshot()
        })

        it('memoizes correctly', () => {
            // Reset computations
            selectTreemapChartData.resetRecomputations()

            // Repeat computations without state change
            selectTreemapChartData(state, pageName, chartName)
            selectTreemapChartData(state, pageName, chartName)
            expect(selectTreemapChartData.recomputations()).toEqual(1)

            // Update state
            state = reducer(
                state,
                updateTreemapSorterForPageTreemap({
                    pageName: BRANDS_SUMMARY_PAGE,
                })({
                    field: 'ctr',
                    order: 'descend',
                    filterPositiveValues: true,
                })
            )

            // Trigger computations after state change
            selectTreemapChartData(state, pageName, chartName)
            selectTreemapChartData(state, pageName, chartName)
            expect(selectTreemapChartData.recomputations()).toEqual(2)
        })
    })
})
