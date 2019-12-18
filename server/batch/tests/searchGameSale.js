process.env.TZ = 'Asia/Tokyo'
const firebaseAdmin = require('../firebase-factory')

const db = firebaseAdmin.firestore()

const search = async (date) => {
  let query = db.collection('gameSales')
    .where('id', '==', '70010000016519')
    // .where('ssdate', '<', '2019-12-01')
    // .where('sedate', '>', '2019-12-01')
    // .where('sedate', '>', date)
    .orderBy('sedate', 'asc')

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

search(new Date(str))
  .then(items => {
    items.forEach(item => {
      console.log('-----------------')
      console.log(item.title)
      console.log(item.sedate)
      console.log('')
    })
  })