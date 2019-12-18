import * as functions from 'firebase-functions'
import admin from './firebase'
import nGram from 'n-gram'

const moment = require('moment')
const uuidv4 = require('uuid/v4')
const db = admin.firestore()

const registerEvent = () => {
  return functions.firestore
  .document('gameSaleRaws/{id}')
  .onCreate(async (snap: any, context: any) => {

    let items

    try {
      items = JSON.parse(snap.data())
    } catch (e) {
      return true
    }
  
    items.forEach(async item => {

      if (item.hard !== '1_HAC') {
        return
      }
  
      const titleBigram = {}
      const bigram = nGram.bigram(item.title)
      bigram.forEach(word => {
        titleBigram[word] = true
      })
  
      const sales = await fetchByGameId(item.id)
  
      const saleStartDateUnix = moment(item.ssdate).unix()
      const saleEndDateUnix = moment(item.sedate).unix()
  
      let id = null
      for (const sale of sales) {
        if (sale.sedate && sale.ssdate) {
          const startUnix = sale.ssdate._seconds
          if (saleStartDateUnix <= startUnix && startUnix <= saleEndDateUnix) {
            id = sale.uuid
            break
          }
        }
      }
  
      id = id || uuidv4()
  
      try {
        await db.collection('gameSales')
        .doc(id)
        .set({
          ...item,
          ssdate: new Date(item.ssdate),
          sedate: new Date(item.sedate),
          uuid: id,
          titleBigram,
        })
      } catch(e) {
        console.log(e)
      }
    })

    return true
  })
}

const fetchByGameId = async (gameId) => {
  try {
    const snapshot = await db
      .collection('gameSales')
      .where('id', '==', gameId)
      .get()

    const items = []
    if (snapshot.empty) {
      return items
    }

    snapshot.forEach(doc => {
      items.push(doc.data())
    })

    return items

  } catch(e) {
    console.log(e)
    return []
  }
}

export default registerEvent