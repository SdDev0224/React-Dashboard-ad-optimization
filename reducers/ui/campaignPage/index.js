import { combineChildrenReducers } from 'utilities/reducers'

// Reducer that handles page level data, that is, parent reducer
import pageReducer from './page'

// Children reducers
import automationReducer from './automation'

export default combineChildrenReducers(pageReducer, {
    automation: automationReducer,
})
