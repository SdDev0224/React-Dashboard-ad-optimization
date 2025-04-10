import { deepFreeze } from 'helpers/deepFreeze'
import {
    resetAuth,
    resetAuthErrors,

    // Load auth
    loadAuthRequest,
    loadAuthFinish,

    // organization integrations
    fetchLatestOrganizationIntegrationSuccess,

    // Sign up
    signUpRequest,
    signUpSuccess,
    signUpFailure,

    // Sign in
    signInRequest,
    signInSuccess,
    signInFailure,

    // Sign out
    signOutRequest,
    signOutSuccess,
    signOutFailure,

    // Send reset email
    sendResetEmailRequest,
    sendResetEmailSuccess,
    sendResetEmailFailure,

    // Reset password
    resetPasswordRequest,
    resetPasswordSuccess,
    resetPasswordFailure,
} from 'actions/auth'

import reducer from '../auth'

const defaultState = reducer(undefined, { type: undefined })

deepFreeze(defaultState)

describe('[Reducers] auth', () => {
    describe('loadAuthRequest', () => {
        it('should set isLoadingAuth to true', () => {
            const action = loadAuthRequest()
            const nextState = reducer(defaultState, action)

            expect(nextState.isLoadingAuth).toBe(true)
        })
    })

    describe('loadAuthFinish', () => {
        it('should set isLoadingAuth to false', () => {
            const action = loadAuthFinish()
            const nextState = reducer(defaultState, action)

            expect(nextState.isLoadingAuth).toBe(false)
        })
    })

    describe('resetAuth, signOutSuccess', () => {
        let initialState
        let expectedState

        beforeAll(() => {
            // simulate signed in state
            // with dummy isFetching === true
            initialState = {
                ...defaultState,
                signedIn: true,
                isLoadingAuth: false,
                isFetching: false,
                error: null,

                username: 'jimbob',
                email: 'jimbob@bobsbonanza.gov',
                email_verified: true,
                name: 'James Boberson',
                company: 'yowza, inc.',
                phone_number: '555',
                phone_number_verified: true,
            }

            deepFreeze(initialState)

            expectedState = {
                ...defaultState,
                isLoadingAuth: false,
            }
        })

        describe('resetAuth', () => {
            it('resets auth state excluding isFetching and isLoadingAuth', () => {
                const action = resetAuth()

                const nextState = reducer(initialState, action)
                expect(nextState).toEqual(expectedState)
            })
        })

        describe('signOutSuccess', () => {
            it('resets auth state excluding isFetching and isLoadingAuth', () => {
                const action = signOutSuccess()

                const nextState = reducer(initialState, action)
                expect(nextState).toEqual(expectedState)
            })
        })
    })

    describe('resetAuthErrors', () => {
        it('clears all auth errors, setting state.errors to null', () => {
            const initialState = {
                ...defaultState,
                error: ['lots', 'of', 'errors', 'ohnoeessss'],
            }

            deepFreeze(initialState)

            const action = resetAuthErrors()
            const nextState = reducer(initialState, action)

            expect(nextState).toEqual({ ...initialState, error: null })
        })
    })

    describe('signUpRequest, signInRequest, signOutRequest, resetPasswordRequest', () => {
        let initialState
        let expectedState

        beforeAll(() => {
            initialState = {
                ...defaultState,
                isFetching: false,
                error: 'non-null',
            }

            deepFreeze(initialState)

            expectedState = {
                ...defaultState,
                isFetching: true,
                error: null,
            }
        })

        describe('signUpRequest', () => {
            it('should clear existing errors and set isFetching to true', () => {
                const action = signUpRequest()

                const nextState = reducer(initialState, action)
                expect(nextState).toEqual(expectedState)
            })
        })

        describe('signInRequest', () => {
            it('should clear existing errors and set isFetching to true', () => {
                const action = signInRequest()

                const nextState = reducer(initialState, action)
                expect(nextState).toEqual(expectedState)
            })
        })

        describe('signOutRequest', () => {
            it('should clear existing errors and set isFetching to true', () => {
                const action = signOutRequest()

                const nextState = reducer(initialState, action)
                expect(nextState).toEqual(expectedState)
            })
        })

        describe('resetPasswordRequest', () => {
            it('should clear existing errors and set isFetching to true', () => {
                const action = resetPasswordRequest()

                const nextState = reducer(initialState, action)
                expect(nextState).toEqual(expectedState)
            })
        })
    })

    describe('signUpSuccess', () => {
        it('sets isFetching to false and clears auth errors', () => {
            const action = signUpSuccess()
            const initialState = {
                ...defaultState,
                isFetching: true,
                error: ['lots', 'of', 'errors', 'ohnoeessss'],
            }

            deepFreeze(initialState)

            const nextState = reducer(initialState, action)
            expect(nextState).toEqual({
                ...initialState,
                isFetching: false,
                error: null,
            })
        })
    })

    describe('signInSuccess', () => {
        let username
        let attributes
        let optionalAttributes
        let expectedAppState
        let initialState
        let expectedState

        beforeAll(() => {
            // components of expected state
            username = 'jimbob'

            attributes = {
                email: 'jimbob@dsi.com',
                email_verified: 'true',
                name: 'Jim Bobsworth',
            }

            optionalAttributes = {
                'custom:company': "Jim's Fishing Bobs",
                phone_number: '555-555-5555',
                phone_number_verified: true,
            }

            expectedAppState = {
                signedIn: true,
                isLoadingAuth: false,
                isFetching: false,
                error: null,
                organizationId: null,
                organizationGroupId: null,
                organizationGroups: [],
            }

            // simulating state of request-in-progress
            initialState = {
                ...defaultState,
                signedIn: false,
                isLoadingAuth: false,
                isFetching: true,
                error: 'error',
            }

            deepFreeze(initialState)

            // building expected state objects with and without optional attributes
            expectedState = {
                partial: {
                    ...initialState,
                    ...expectedAppState,
                    ...attributes,
                    username,
                },
                withOptional: {
                    company: optionalAttributes['custom:company'],
                    phone_number: optionalAttributes.phone_number,
                    phone_number_verified:
                        optionalAttributes.phone_number_verified,
                },
                withoutOptional: {
                    company: null,
                    phone_number: null,
                    phone_number_verified: null,
                },
            }
        })

        it('sets expected state with optional attributes', () => {
            const action = signInSuccess({
                cognitoUser: {
                    username,
                    attributes: {
                        ...attributes,
                        ...optionalAttributes,
                    },
                },
                featurePermissions: [],
                organizationId: null,
                organizations: [],
                organizationGroupId: null,
                organizationGroups: [],
            })

            const nextState = reducer(initialState, action)
            expect(nextState).toEqual({
                ...expectedState.partial,
                ...expectedState.withOptional,
            })
        })

        it('sets expected state without optional attributes', () => {
            const action = signInSuccess({
                cognitoUser: {
                    username,
                    attributes,
                },
                featurePermissions: [],
                organizationId: null,
                organizations: [],
                organizationGroupId: null,
                organizationGroups: [],
            })

            const nextState = reducer(initialState, action)
            expect(nextState).toEqual({
                ...expectedState.partial,
                ...expectedState.withoutOptional,
            })
        })
    })

    describe('sendResetEmailRequest', () => {
        it('sets isFetching, nullifies error, stores passed email', () => {
            const email = 'dory@42wallabywaysyd.net'

            const action = sendResetEmailRequest({ email })
            const initialState = {
                ...defaultState,
                error: ['lots', 'of', 'errors', 'ohnoeessss'],
                isFetching: false,
                email: 'nothesame@email.com',
            }

            deepFreeze(initialState)

            const expectedState = {
                ...initialState,
                isFetching: true,
                error: null,
                email,
            }

            const nextState = reducer(initialState, action)
            expect(nextState).toEqual(expectedState)
        })
    })

    describe('sendResetEmailSuccess', () => {
        it('nullifies errors, ends fetch and sets passwordResetEmailSent to true', () => {
            const action = sendResetEmailSuccess()
            const initialState = {
                ...defaultState,
                passwordResetEmailSent: false,
                isFetching: true,
                error: ['lots', 'of', 'errors', 'ohnoeessss'],
            }

            deepFreeze(initialState)

            const expectedState = {
                ...initialState,
                passwordResetEmailSent: true,
                isFetching: false,
                error: null,
            }

            const nextState = reducer(initialState, action)
            expect(nextState).toEqual(expectedState)
        })
    })

    describe('resetPasswordSuccess', () => {
        it('nullifies errors, ends fetch and sets resetPasswordSuccess to true', () => {
            const action = resetPasswordSuccess()
            const initialState = {
                ...defaultState,
                passwordResetSuccess: false,
                isFetching: true,
                error: ['lots', 'of', 'errors', 'ohnoeessss'],
            }

            deepFreeze(initialState)

            const expectedState = {
                ...initialState,
                passwordResetSuccess: true,
                isFetching: false,
                error: null,
            }

            const nextState = reducer(initialState, action)
            expect(nextState).toEqual(expectedState)
        })
    })

    describe('fetchLatestOrganizationIntegrationSuccess', () => {
        it('sets state correctly', () => {
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
            const initialState = { ...defaultState }

            deepFreeze(initialState)

            const expectedState = {
                ...initialState,
                latestOrganizationIntegration: '2019-01-31T14:05:54.645000Z',
            }

            const nextState = reducer(initialState, action)
            expect(nextState).toEqual(expectedState)
        })
    })

    describe('{signUpFailure, signOutFailure, signInFailure, sendResetEmailFailure, resetPasswordFailure', () => {
        let initialState
        let expectedState
        let error

        beforeAll(() => {
            error = 'error'

            initialState = {
                ...defaultState,
                isFetching: true,
                error: null,
            }

            deepFreeze(initialState)

            expectedState = {
                ...defaultState,
                isFetching: false,
                error,
            }
        })

        describe('signUpFailure', () => {
            it('sets isFetching to false and records passed error', () => {
                const action = signUpFailure({ error })

                const nextState = reducer(initialState, action)
                expect(nextState).toEqual(expectedState)
            })
        })

        describe('signOutFailure', () => {
            it('sets isFetching to false and records passed error', () => {
                const action = signOutFailure({ error })

                const nextState = reducer(initialState, action)
                expect(nextState).toEqual(expectedState)
            })
        })

        describe('signInFailure', () => {
            it('sets isFetching to false and records passed error', () => {
                const action = signInFailure({ error })

                const nextState = reducer(initialState, action)
                expect(nextState).toEqual(expectedState)
            })
        })

        describe('sendResetEmailFailure', () => {
            it('sets isFetching to false and records passed error', () => {
                const action = sendResetEmailFailure({ error })

                const nextState = reducer(initialState, action)
                expect(nextState).toEqual(expectedState)
            })
        })

        describe('resetPasswordFailure', () => {
            it('sets isFetching to false and records passed error', () => {
                const action = resetPasswordFailure({ error })

                const nextState = reducer(initialState, action)
                expect(nextState).toEqual(expectedState)
            })
        })
    })
})
