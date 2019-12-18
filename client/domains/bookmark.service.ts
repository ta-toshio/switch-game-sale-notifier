import {
  add as addBookmark,
  remove as removeBookmark,
  fetch as fetchBookmark,
} from './bookmark'
import {
  addUser as addUserToGame,
  removeUser as removeUserFromGame
} from './game'
import { getUserId } from './user'
import { setBookmarks, setHasMore } from '../actions/bookmark.action'

export const register = async ({ userId, gameId }) => {
  await addBookmark({ userId, gameId })
  await addUserToGame({ userId, gameId })
}

export const release = async ({ userId, gameId }) => {
  await removeBookmark({ userId, gameId })
  await removeUserFromGame({ userId, gameId })
}

export const fetch = async ({ dispatch }) => {
  const userId = await getUserId()
  const [ games, bookmarks ] = await fetchBookmark(userId)
  dispatch(setBookmarks(games))

  // next page
  if (bookmarks && bookmarks.length) {
    const nextGames = await fetchBookmark(userId, bookmarks[bookmarks.length - 1])
    if (nextGames && nextGames.length) {
      dispatch(setHasMore(true))
    } else {
      dispatch(setHasMore(false))
    }
  }
  return true
}

export const fetchAll = async () => {
  const userId = await getUserId()
  const allGames = []
  let lastBookmark = null

  while(true) {
    const [ games, bookmarks ] = await fetchBookmark(userId, lastBookmark)

    if (games && games.length) {
      games.forEach(game => {
        allGames.push(game)
      })
    } else {
      break
    }

    // next page
    lastBookmark = bookmarks[bookmarks.length - 1]
  }

  return allGames
}