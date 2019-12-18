import { combineReducers } from 'redux'
import bookmarkReducer from './bookmark.reducer'

const rootReducer = combineReducers({  
  bookmark: bookmarkReducer
})

export default rootReducer