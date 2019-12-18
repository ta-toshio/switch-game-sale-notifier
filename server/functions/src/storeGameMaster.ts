import * as functions from 'firebase-functions'
import admin from './firebase'
import nGram from 'n-gram'

const db = admin.firestore()

const registerEvent = () => {
  return functions.firestore
  .document('gameRaws/{id}')
  .onCreate(async (snap: any, context: any) => {

    let items

    try {
      items = JSON.parse(snap.data())
    } catch (e) {
      return true
    }
  
    items.forEach(async item => {

      const titleBigram = {}
      const bigram = nGram.bigram(item.title)
      bigram.forEach(word => {
        titleBigram[word] = true
      })

      try {
        await db.collection('games')
        .doc(item.id)
        .set({
          ...item,
          titleBigram
        })
      } catch(e) {
        console.log(e)
      }
    })

    return true
  })
}

export default registerEvent