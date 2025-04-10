import ReactGA from 'react-ga'
import { call } from 'redux-saga/effects'

import {
  setSentryUserContext,
  unsetSentryUserContext,
  setSentryUserContextSaga,
  setGoogleUserContextSaga,
  unsetSentryUserContextSaga,
  unsetGoogleUserContextSaga,
} from '../workers'

test('setSentryUserContextSaga saga can parse userAttributes', () => {
  const userAttributes = {
    id: 'us-west-2:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    username: 'f2e9eb3a-a89d-4753-9857-1c8177558ba6',
    attributes: {
      email: 'test@test.com',
      email_verified: true,
      name: 'tester',
    },
  }

  const generator = setSentryUserContextSaga(userAttributes)

  expect(generator.next().value).toEqual(
    call(setSentryUserContext, {
      id: 'f2e9eb3a-a89d-4753-9857-1c8177558ba6',
      email: 'test@test.com',
    })
  )
})

test('unsetSentryUserContextSaga saga can unset user context', () => {
  const generator = unsetSentryUserContextSaga()

  expect(generator.next().value).toEqual(call(unsetSentryUserContext))
})

test('setGoogleUserContext saga can parse userAttributes', () => {
  const userAttributes = {
    id: 'us-west-2:xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    username: 'f2e9eb3a-a89d-4753-9857-1c8177558ba6',
    attributes: {
      'custom:company': '',
      email: 'test@test.com',
      email_verified: true,
      name: 'tester',
    },
  }

  const generator = setGoogleUserContextSaga(userAttributes)

  expect(generator.next().value).toEqual(
    call([ReactGA, 'set'], {
      userId: 'f2e9eb3a-a89d-4753-9857-1c8177558ba6',
    })
  )
  expect(generator.next().value).toEqual(
    call([ReactGA, 'set'], {
      dimension1: 'f2e9eb3a-a89d-4753-9857-1c8177558ba6',
    })
  )
})

test('unsetGoogleUserContext saga can unset user context', () => {
  const generator = unsetGoogleUserContextSaga()

  expect(generator.next().value).toEqual(
    call([ReactGA, 'set'], {
      userId: 'unauthenticated-user-id',
    })
  )

  expect(generator.next().value).toEqual(
    call([ReactGA, 'set'], {
      dimension1: 'unauthenticated-customer-id',
    })
  )
})
