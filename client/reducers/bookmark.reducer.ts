import { types } from '../actions/bookmark.action'

const initialState = {
  bookmarks: [],
  bookmarkIds: {},
  hasMore: false,
}

const reducer = (state = initialState, action) => {  
  switch (action.type) {
    case types.SET_BOOKMARKS:
      const bookmarkIds = {}
      action.payload.bookmarks.forEach(bookmark => {
        bookmarkIds[bookmark.id] = true
      })
      return {
        ...state,
        bookmarks: action.payload.bookmarks,
        bookmarkIds,
      }
    case types.SET_HAS_MORE:
      return {
        ...state,
        hasMore: action.payload.hasMore,
      }
    case types.ADD_BOOKMARK:
      {
        const gameId = action.payload.bookmark.game_id
        const bookmarks = state.bookmarks.filter(bookmark => {
          return bookmark.game_id != gameId
        })
        const bookmarkIds = {
          ...state.bookmarkIds,
          [action.payload.bookmark.game_id]: true
        }
        return {
          ...state,
          bookmarks: [
            action.payload.bookmark,
            ...bookmarks,
          ],
          bookmarkIds,
        }
      }
    case types.DELETE_BOOKMARK:
      {
        const gameId = action.payload.id
        const bookmarks = state.bookmarks.filter(bookmark => {
          return bookmark.game_id != gameId
        })

        const bookmarkIds = { ...state.bookmarkIds }
        delete(bookmarkIds[action.payload.id])
        return { 
          ...state,
          bookmarks,
          bookmarkIds,
        }
      }
    default:
      return state;
  }
}

export default reducer