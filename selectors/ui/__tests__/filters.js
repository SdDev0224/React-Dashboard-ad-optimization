import { HOME_PAGE } from 'constants/pages'
import reducer from 'reducers'
import { updatePageFilter, updatePageFilterSettings } from 'actions/ui'

import {
    selectPageFilters,
    selectPageFilterSettings,
    selectVisiblePageFilters,
} from '../filters'

describe('[Selectors] ui/filters', () => {
    const pageName = HOME_PAGE
    let state

    beforeEach(() => {
        const initActions = [
            updatePageFilter({
                pageName,
                data: {
                    key: 'countries',
                    value: ['US', 'CA'],
                },
            }),
            updatePageFilter({
                pageName,
                data: {
                    key: 'regions',
                    value: ['EU'],
                },
            }),
            updatePageFilterSettings({
                pageName,
                data: {
                    displayState: {
                        countries: true,
                        regions: true,
                    },
                },
            }),
        ]

        state = initActions.reduce(
            (tempState, action) => reducer(tempState, action),
            undefined
        )
    })

    describe('selectPageFilters', () => {
        it('selects page filters by page name', () => {
            const filters = selectPageFilters(state, pageName)

            expect(filters).toMatchObject({
                countries: ['US', 'CA'],
                regions: ['EU'],
            })
        })

        it('memoizes page filters by page name', () => {
            const selector = selectPageFilters.getMatchingSelector(
                state,
                pageName
            )

            // Reset computations
            selector.resetRecomputations()

            // Repeat computations without state change
            selectPageFilters(state, pageName)
            selectPageFilters(state, pageName)
            expect(selector.recomputations()).toEqual(1)

            // Update state
            state = reducer(
                state,
                updatePageFilter({
                    pageName: HOME_PAGE,
                    data: {
                        key: 'regions',
                        value: ['NA'],
                    },
                })
            )

            // Trigger computation after state change
            selectPageFilters(state, pageName)
            expect(selector.recomputations()).toEqual(2)
        })
    })

    describe('selectPageFilterSettings', () => {
        it('selects page filter settings by page name', () => {
            const filterSettings = selectPageFilterSettings(state, pageName)

            expect(filterSettings).toMatchSnapshot()
        })

        it('memoizes page filter settings by page name', () => {
            const selector = selectPageFilterSettings.getMatchingSelector(
                state,
                pageName
            )

            // Reset computations
            selector.resetRecomputations()

            // Repeat computations without state change
            selectPageFilterSettings(state, pageName)
            selectPageFilterSettings(state, pageName)
            expect(selector.recomputations()).toEqual(1)

            // Update state
            state = reducer(
                state,
                updatePageFilterSettings({
                    pageName: HOME_PAGE,
                    data: {
                        displayState: {
                            regions: false,
                        },
                    },
                })
            )

            // Trigger computation after state change
            selectPageFilterSettings(state, pageName)
            expect(selector.recomputations()).toEqual(2)
        })
    })

    describe('selectVisiblePageFilters', () => {
        it('selects visible page filters by page name', () => {
            const visibleFilters = selectVisiblePageFilters(state, pageName)

            expect(visibleFilters).toMatchObject({
                countries: ['US', 'CA'],
                regions: ['EU'],
            })
        })

        it('memoizes visible page filters by page name', () => {
            const selector = selectVisiblePageFilters.getMatchingSelector(
                state,
                pageName
            )

            // Reset computations
            selector.resetRecomputations()

            // Repeat computations without state change
            selectVisiblePageFilters(state, pageName)
            selectVisiblePageFilters(state, pageName)
            expect(selector.recomputations()).toEqual(1)

            // Update state
            state = reducer(
                state,
                updatePageFilter({
                    pageName: HOME_PAGE,
                    data: {
                        key: 'regions',
                        value: ['NA'],
                    },
                })
            )

            // Trigger computation after state change
            selectVisiblePageFilters(state, pageName)
            expect(selector.recomputations()).toEqual(2)
        })

        describe('when fiters are hidden', () => {
            beforeEach(() => {
                state = reducer(
                    state,
                    updatePageFilterSettings({
                        pageName,
                        data: {
                            displayState: {
                                regions: false,
                            },
                        },
                    })
                )
            })

            it('omits hidden filters', () => {
                const visibleFilters = selectVisiblePageFilters(state, pageName)

                expect(visibleFilters).not.toHaveProperty('regions')
            })
        })
    })
})
