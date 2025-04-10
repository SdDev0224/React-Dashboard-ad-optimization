import { configureScope, addBreadcrumb } from '@sentry/browser'

const sentry = store => {
    configureScope(scope => {
        scope.addEventProcessor(event => {
            const state = store.getState()
            return {
                ...event,
                extra: {
                    ...event.extra,
                    'redux:state': state,
                },
            }
        })
    })

    return next => action => {
        addBreadcrumb({
            category: 'redux-action',
            message: action.type,
        })
        return next(action)
    }
}

export default sentry
