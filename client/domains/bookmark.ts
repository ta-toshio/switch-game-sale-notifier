import firebase, { firestore } from '../config/firebase'
import { toGame } from './game'

export const add = async ({ userId, gameId }) => {
  await firestore
    .collection(`users/${userId}/bookmarks`)
    .doc(gameId)
    .set({
      id: gameId,
      userId,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    })
}

export const remove = async ({ userId, gameId }) => {
  await firestore
    .collection(`users/${userId}/bookmarks`)
    .doc(gameId)
    .delete()
}

export const fetch = async (userId, lastBookmark = null) => {
  let bookmarkQuery = firestore
    .collection(`users/${userId}/bookmarks`)
    .orderBy('createdAt', 'desc')
    .limit(10)

  if (lastBookmark) {
    bookmarkQuery = bookmarkQuery.startAfter(lastBookmark.createdAt)
  }

  const bookmarkSnapshot = await bookmarkQuery.get()
  
  const gameIds = []
  const bookmarks = []
  bookmarkSnapshot.forEach(doc => {
    const data = doc.data()
    gameIds.push(data.id)
    bookmarks.push(data)
  })

  if (!gameIds.length) {
    return []
  }

  const gameSnapshot = await firestore
    .collection(`games`)
    .where('id', 'in', gameIds)
    .get()

  const games = []
  gameSnapshot.forEach(doc => {
    games.push(toGame(doc.data()))
  })
  return [ games, bookmarks ]
}