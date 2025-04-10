import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { createStore } from 'redux'

import rootReducer from 'reducers'

import App from '../AppContainer'

test('renders without crashing', () => {
    const store = createStore(rootReducer)
    const div = document.createElement('div')
    ReactDOM.render(
        <Provider store={store}>
            <App />
        </Provider>,
        div
    )
    ReactDOM.unmountComponentAtNode(div)
})
