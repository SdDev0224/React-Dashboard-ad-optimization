import { combineReducers } from 'redux'

import auth from './auth'
import entities from './entities'
import orgs from './orgs'
import ui from './ui'

const rootReducer = combineReducers({
    auth,
    entities,
    orgs,
    ui,
})

export default rootReducer
