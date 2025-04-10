import { HOME_PAGE } from 'constants/pages'
import reducer from 'reducers'
import {
    updateChartMetrics,
    fetchHomePageHeadlineSearchTimeseriesSuccess,
    fetchHomePageSponsoredProductTimeseriesSuccess,
} from 'actions/ui'
import { LEFT_AXIS_FIRST, LEFT_AXIS_SECOND, RIGHT_AXIS } from 'constants/charts'

import {
    selectChartMetrics,
    selectDataForStackedBarChart,
} from '../amsTimeseriesCharts'
import {
    headlineSearchTimeseriesData,
    sponsoredProductTimeseriesData,
} from '../__data__/amsTimeseriesData'

describe('[Selectors] ui/amsTimeseriesCharts', () => {
    let state

    describe('selectChartMetrics', () => {
        const pageName = HOME_PAGE
        const chartName = 'timeseries'
        const metricName = 'metric'

        beforeEach(() => {
            state = reducer(
                undefined,
                updateChartMetrics({
                    pageName,
                    chartName,
                    key: metricName,
                    value: 'attributed_sales_14_day__sum',
                })
            )
        })

        it('selects chart settings by page name and chart name', () => {
            expect(selectChartMetrics(state, pageName, chartName)).toEqual({
                [metricName]: 'attributed_sales_14_day__sum',
            })
        })

        it('memoizes chart settings by page name and chart name', () => {
            const selector = selectChartMetrics.getMatchingSelector(
                state,
                pageName,
                chartName
            )

            // Reset computations
            selector.resetRecomputations()

            // Repeat computations without state change
            selectChartMetrics(state, pageName, chartName)
            selectChartMetrics(state, pageName, chartName)
            expect(selector.recomputations()).toEqual(1)

            // Update state
            state = reducer(
                state,
                updateChartMetrics({
                    pageName,
                    chartName,
                    key: metricName,
                    value: 'attributed_sales_30_day__sum',
                })
            )

            // Trigger computation after state change
            selectChartMetrics(state, pageName, chartName)
            expect(selector.recomputations()).toEqual(2)
        })
    })

    describe('selectDataForStackedBarChart', () => {
        const pageName = HOME_PAGE
        const chartName = 'timeseries'

        beforeEach(() => {
            // action to change right axis metric
            state = reducer(
                undefined,
                updateChartMetrics({
                    pageName,
                    chartName,
                    key: RIGHT_AXIS,
                    value: 'ctr',
                })
            )

            // action to change left axis first metric
            state = reducer(
                state,
                updateChartMetrics({
                    pageName,
                    chartName,
                    key: LEFT_AXIS_FIRST,
                    value: 'clicks__sum',
                })
            )

            // action to change left axis second metric
            state = reducer(
                state,
                updateChartMetrics({
                    pageName,
                    chartName,
                    key: LEFT_AXIS_SECOND,
                    value: 'impressions__sum',
                })
            )

            // action to update headline search data
            state = reducer(
                state,
                fetchHomePageHeadlineSearchTimeseriesSuccess(
                    headlineSearchTimeseriesData
                )
            )

            // action to update sponsored products data
            state = reducer(
                state,
                fetchHomePageSponsoredProductTimeseriesSuccess(
                    sponsoredProductTimeseriesData
                )
            )
        })

        it('selects chart data correctly', () => {
            const { axes, series } = selectDataForStackedBarChart(
                state,
                pageName,
                chartName
            )

            expect(axes).toHaveProperty('date')
            expect(axes).toHaveProperty('left')
            expect(axes).toHaveProperty('right')
            expect(series).toMatchSnapshot()
        })

        it('memoizes chart settings by page name and chart name', () => {
            const selector = selectDataForStackedBarChart.getMatchingSelector(
                state,
                pageName,
                chartName
            )

            // Reset computations
            selector.resetRecomputations()

            // Repeat computations without state change
            selectDataForStackedBarChart(state, pageName, chartName)
            selectDataForStackedBarChart(state, pageName, chartName)
            expect(selector.recomputations()).toEqual(1)

            // Update state
            state = reducer(
                state,
                updateChartMetrics({
                    pageName,
                    chartName,
                    key: RIGHT_AXIS,
                    value: 'ctr',
                })
            )

            // Trigger computations after state change
            selectDataForStackedBarChart(state, pageName, chartName)
            selectDataForStackedBarChart(state, pageName, chartName)
            expect(selector.recomputations()).toEqual(2)
        })
    })
})
