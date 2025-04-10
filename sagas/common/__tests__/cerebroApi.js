import { runSaga } from 'redux-saga'
import ReactGA from 'react-ga'
import { configureScope } from '@sentry/browser'

import {
    DIMENSIONS,
    CUSTOM_DIMENSIONS,
    UNAUTHENTICATED_USER_ID,
    UNAUTHENTICATED_CUSTOMER_ID,
} from 'constants/googleAnalytics'

import cerebroApiSaga from '../cerebroApi'

describe('[Sagas] cerebroApiSaga', () => {
    let params
    let dispatched

    beforeEach(() => {
        dispatched = []
        params = { brand: 10 }
    })

    it('works correctly when api call returns 200 status code', async () => {
        const successAction = jest.fn(payload => ({
            type: 'FAKE_SUCCESS',
            payload,
        }))

        const returnData = {
            data: [1, 2, 3],
            status: 200,
        }

        const apiFun = jest.fn(
            () => new Promise(resolve => resolve(returnData))
        )

        const task = await runSaga(
            {
                dispatch: action => dispatched.push(action),
                getState: () => ({}),
            },
            cerebroApiSaga,
            successAction,
            apiFun,
            params
        )
        const result = await task.toPromise()

        expect(result).toEqual(returnData)

        expect(apiFun).toHaveBeenCalledTimes(1)
        expect(apiFun).toHaveBeenCalledWith(params)

        expect(successAction).toHaveBeenCalledTimes(1)
        expect(successAction).toHaveBeenCalledWith(returnData.data)
    })

    it('signs out the user when api call returns 401 status code', async () => {
        const successAction = jest.fn(payload => ({
            type: 'FAKE_SUCCESS',
            payload,
        }))

        const returnData = {
            data: null,
            status: 401,
        }

        const apiFun = jest.fn(
            () => new Promise(resolve => resolve(returnData))
        )

        const task = await runSaga(
            {
                dispatch: action => dispatched.push(action),
                getState: () => ({}),
            },
            cerebroApiSaga,
            successAction,
            apiFun,
            params
        )
        const result = await task.toPromise()

        expect(result).toEqual(returnData)

        expect(apiFun).toHaveBeenCalledTimes(1)
        expect(apiFun).toHaveBeenCalledWith(params)

        expect(successAction).toHaveBeenCalledTimes(0)

        // unset sentry user context on sign out
        expect(configureScope).toHaveBeenCalledTimes(1)

        // unset Google Analytics context on sign out
        expect(ReactGA.set).toHaveBeenCalledTimes(2)
        expect(ReactGA.set.mock.calls).toEqual([
            [{ [DIMENSIONS.userId]: UNAUTHENTICATED_USER_ID }],
            [{ [CUSTOM_DIMENSIONS.customerId]: UNAUTHENTICATED_CUSTOMER_ID }],
        ])
    })
})
