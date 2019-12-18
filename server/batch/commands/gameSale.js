process.env.TZ = 'Asia/Tokyo'
const firebaseAdmin = require('./../firebase-factory')
const uuidv4 = require('uuid/v4')
const axios = require('axios')
const nGram = require('n-gram')
const moment = require('moment')

const db = firebaseAdmin.firestore()

const fetch = async url => {
  try {
    return await axios.get(url)
  } catch (e) {
    console.log(e)
  }
}

const handleStore = items => {
  items.reverse().filter(async item => {
    if (item.hard !== '1_HAC') {
      return false
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

    console.log(`save id: ${id}`)

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

const fetchAndStore = async () => {
  const url = 'https://search.nintendo.jp/nintendo_soft/search.json'
    + '?opt_sshow=1&xopt_ssitu[]=sales_termination&xopt_ssitu[]=not_found'
    + '&limit=300&page=1&c=46313580867097019&opt_sale_flg=1'
    + '&sort=sodate%20desc%2Cscore&opt_search=1'

  try {
    const response = await fetch(url)
    if (!response) {
      console.log(`Could not get response at page: ${page}`)
      return
    }

    if (!response.data) {
      console.log(`Could not get data at page: ${page}`)
      return
    }

    if (!response.data.result) {
      console.log(`Could not get result at page: ${page}`)
      return
    }

    const items = response.data.result.items
    handleStore(items)
  } catch (e) {
    console.log(e)
  }
}

fetchAndStore()

// const data = require('./games.json')
// const items = data.result.items
// handleStore(items)
