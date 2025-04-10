import rootReducer from 'reducers'
import { fetchLatestOrganizationIntegrationSuccess } from 'actions/auth'
import moment from 'utilities/moment'

import { selectHasRecentIntegration, selectHasIntegration } from '../auth'

describe('[selectors ams]', () => {
    describe('selectHasRecentIntegration', () => {
        it('returns false when latestOrganizationIntegration is null', () => {
            const defaultState = rootReducer(undefined, {})
            expect(selectHasRecentIntegration(defaultState)).toEqual(false)
        })

        it('returns false when date is a long time again', () => {
            const action = fetchLatestOrganizationIntegrationSuccess({
                count: 3,
                next: 'http://url-for-next-data.org',
                previous: null,
                results: [
                    {
                        id: 3,
                        alias: 'CCI',
                        active: true,
                        created_at: '2019-01-31T14:05:54.645000Z',
                        updated_at: '2019-02-04T18:27:51.986564Z',
                    },
                ],
            })
            const nextState = rootReducer(undefined, action)
            expect(selectHasRecentIntegration(nextState)).toEqual(false)
        })

        it('returns true when date is now', () => {
            const now = moment().toISOString()
            const action = fetchLatestOrganizationIntegrationSuccess({
                count: 3,
                next: 'http://url-for-next-data.org',
                previous: null,
                results: [
                    {
                        id: 3,
                        alias: 'CCI',
                        active: true,
                        created_at: now,
                        updated_at: now,
                    },
                ],
            })
            const nextState = rootReducer(undefined, action)
            expect(selectHasRecentIntegration(nextState)).toEqual(true)
        })
    })

    describe('selectHasIntegration', () => {
        it('returns false when user does not have an integration', () => {
            const defaultState = rootReducer(undefined, {})
            expect(selectHasIntegration(defaultState)).toEqual(false)
        })
    })
})
