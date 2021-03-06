process.env.TZ = 'Asia/Tokyo'
const firebaseAdmin = require('./../firebase-factory')
const axios = require('axios')
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

  const checks = {}

  const res = items.reverse().filter(async item => {
    if (item.hard !== '1_HAC') {
      return false
    }

    await fetchByGameId(item.id)

    if (!checks[item.id]) {
      checks[item.id] = 1
    } else {
      checks[item.id] += 1
    }

    if (checks[item.id] > 1) {
      console.log(key)
    }

    return true
  })
  
}

const fetchByGameId = async (gameId) => {
  try {
    const snapshot = await db
      .collection('gameSales')
      .where('id', '==', gameId)
      .where('sedate', '>',  firebaseAdmin.firestore.Timestamp.now())
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
