import nGram from 'n-gram'
import { firestore } from '../config/firebase'

export const toGame = data => ({
  id: data.id,
  game_id: data.id,
  title: data.title,
  // desc: data.text,
  sale_start_date: data.ssdate,
  sale_end_date: data.sedate,
  rate: data.drate[0],
  list_price: data.price,
  sale_price: data.sprice,
  maker: data.maker,
  dsdate: data.dsdate,
  thumbnail: data.iurl,
})

export const fetchGame = async({ lastGame = null }) => {
  try {
    let query = firestore
      .collection('games')
      .orderBy('dsdate', 'desc')
      .orderBy('id', 'desc')     
      .limit(30) 

    if (lastGame) {
      query = query.startAfter(lastGame.dsdate, lastGame.id)
    }

    const snapshot = await query.get()

    const games = []
    snapshot.forEach(function(doc) {
      games.push(toGame(doc.data()))
    });

    return games
  
  } catch(e) {console.log(e)}
}

export const searchGame = async (searchText: string) => {
  const searchWords = nGram.bigram(searchText)

  let query = firestore.collection('games').limit(30)
  searchWords.forEach(word => {
    query = query.where(`titleBigram.${word}`, '==', true)
  })
  const snapshot = await query.get()

  const items = []
  snapshot.forEach(doc => {
    items.push(toGame(doc.data()))
  })
  return items
}

export const addUser = async ({ gameId, userId }) => {
  await firestore
    .collection(`games/${gameId}/users`)
    .doc(userId)
    .set({
      id: userId
    })
}

export const removeUser = async ({ gameId, userId }) => {
  await firestore
    .collection(`games/${gameId}/users`)
    .doc(userId)
    .delete()
}