import { all, takeLatest } from 'redux-saga/effects'

import {
    loadAuthRequest,
    signUpRequest,
    signInRequest,
    signOutRequest,
    sendResetEmailRequest,
    resetPasswordRequest,
    changeOrganizationRequest,
    changeOrganizationGroupRequest,
} from 'actions/auth'

import {
    loadAuthWorker,
    signUpWorker,
    signInWorker,
    signOutWorker,
    sendResetEmailWorker,
    resetPasswordWorker,
    changeOrganizationWorker,
    changeOrganizationGroupWorker,
} from './workers'

export default function* authSaga() {
    yield all([
        takeLatest(loadAuthRequest.toString(), loadAuthWorker),

        takeLatest(signUpRequest.toString(), signUpWorker),
        takeLatest(signInRequest.toString(), signInWorker),
        takeLatest(signOutRequest.toString(), signOutWorker),

        takeLatest(sendResetEmailRequest.toString(), sendResetEmailWorker),
        takeLatest(resetPasswordRequest.toString(), resetPasswordWorker),

        takeLatest(
            changeOrganizationRequest.toString(),
            changeOrganizationWorker
        ),
        takeLatest(
            changeOrganizationGroupRequest.toString(),
            changeOrganizationGroupWorker
        ),
    ])
}
