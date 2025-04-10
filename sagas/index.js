/**
 * Recommendation on organizing sagas in parallel
 *
 * There are 2 ways to start saga effects in parallel:
 *
 * A)
 * const rootSaga = function * () {
 *   yield takelatest(A, Asaga);
 *   yield takelatest(B, Bsaga);
 * }
 *
 * B)
 * const rootSaga = function * () {
 *   yield [ takelatest(A, Asaga), takelatest(B, Bsaga) ]
 * }
 *
 * There is no real difference between those two snippets.
 * Subtle technicality is that first one "asks" redux-saga runtime 2x times to do something (starting a watcher in this case)
 * while the latter asks only once - holding both in a 'batch'.
 *
 * Though, yielding arrays is deprecated.
 *
 * So the recommended way is:
 *
 * const rootSaga = function * () {
 *   yield all([ takelatest(A, Asaga), takelatest(B, Bsaga) ])
 * }
 *
 * @see https://github.com/redux-saga/redux-saga/issues/1329
 */

import { all } from 'redux-saga/effects'

import authSaga from './auth'
import uiSaga from './ui'

export default function* rootSaga() {
    yield all([authSaga(), uiSaga()])
}
