import { deepFreeze } from 'helpers/deepFreeze'
import { fetchCurrencySettingsSuccess } from 'actions/ui'

import reducer from '../index'

const defaultState = reducer(undefined, { type: undefined })

deepFreeze(defaultState)

describe('[Reducers] app', () => {
    describe('fetchCurrencySettingsSuccess', () => {
        it('reducer can handle null payload', () => {
            const action = fetchCurrencySettingsSuccess(null)

            expect(action).toEqual({
                payload: null,
                type: 'FETCH_CURRENCY_SETTINGS_SUCCESS',
            })

            const nextState = reducer(defaultState, action)
            const expectedState = {
                currencyCode: 'USD',
                brandsFilterLoading: false,
                campaignsFilterLoading: false,
                organizationLabels: [],
                globalNotification: null,
            }

            expect(nextState).toEqual(expectedState)
        })
    })
})
