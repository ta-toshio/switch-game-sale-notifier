
export const types = {
  SET_BOOKMARKS: 'BOOKMARK/SET_BOOKMARKS',
  ADD_BOOKMARK: 'BOOKMARK/ADD_BOOKMARK',
  DELETE_BOOKMARK: 'BOOKMARK/DELETE_BOOKMARK',
  SET_HAS_MORE: 'BOOKMARK/SET_HAS_MORE'
}

export const addBookmark = bookmark => ({
  type: types.ADD_BOOKMARK,
  payload: {
    bookmark
  }
})

export const deleteBookmark = id => ({
  type: types.DELETE_BOOKMARK,
  payload: {
    id
  }
})

export const setBookmarks = bookmarks => ({
  type: types.SET_BOOKMARKS,
  payload: {
    bookmarks,
  },
})

export const setHasMore = hasMore => ({
  type: types.SET_HAS_MORE,
  payload: { hasMore }
})