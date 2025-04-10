import reduceReducers from 'reduce-reducers'

import uiReducer from './ui'

// Reducer that handles shared actions that applies to all pages
import sharedReducer from './shared'

export default reduceReducers(uiReducer, sharedReducer)
