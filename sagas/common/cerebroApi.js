import { captureException } from '@sentry/browser'
import { call, put } from 'redux-saga/effects'

import message from 'utilities/message'

import { signOutWorker } from '../auth/workers'

export default function* cerebroApiSaga(
    successActionFunc,
    apiFunc,
    ...apiParams
) {
    let response
    let error

    try {
        response = yield call(apiFunc, ...apiParams)
        const { status, data } = response

        if (status >= 200 && status < 300) {
            if (successActionFunc) {
                yield put(successActionFunc(data))
            }
        } else if (status === 401) {
            // sign out the user if their tokens are expired
            yield call(signOutWorker)
        } else if (status === 429 || status === 404) {
            // Do nothing if api is throttled or resource not found
        } else if (status === 403) {
            error = new Error(`Not authorized (status code ${status})!`)
            // Stringify the error so that we can display to the user
        } else if (status === 400) {
            error = new Error(JSON.stringify(data))
        } else {
            error = new Error(`Request failed (status code ${status})!`)
        }
    } catch (err) {
        // handle 5XX errors
        error = err
    }

    if (error) {
        yield call(captureException, error)

        message.error(error.message)

        // Propagate error so that following sagas can be cancelled
        throw error
    }

    return response
}
