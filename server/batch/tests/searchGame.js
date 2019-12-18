const firebaseAdmin = require('../firebase-factory')
const nGram = require('n-gram')

const db = firebaseAdmin.firestore()

const search = async (searchWords) => {
  let query = db.collection('games').limit(30)
  searchWords.forEach(word => {
    query = query.where(`titleBigram.${word}`, '==', true)
  })

  const snapshot = await query.get()
  const items = []
  snapshot.forEach(doc => {
    items.push(doc.data())
  })
  return items
}

const str = process.argv[2] || null
if (!str) {
  return
}

const searchWords = nGram.bigram(str)
search(searchWords)
  .then(items => {
    console.log(items)
  })