process.env.TZ = 'Asia/Tokyo'
const firebaseAdmin = require('./../firebase-factory')
const uuidv4 = require('uuid/v4')
const axios = require('axios')

const db = firebaseAdmin.firestore()

const fetchGameSaleInfo = async url => {
  try {
    return await axios.get(url)
  } catch (e) {
    console.log(e)
  }
}

const splitData = items => {
  const splitArray = []
  let splitChildArray = []
  let index = 0
  items.forEach(item => {
    splitChildArray.push(item)

    if (index === 100) {
      splitArray.push(splitChildArray)
      splitChildArray = []
      index = 0
    } else {
      index += 1
    }
  })

  if (index !== 0) {
    splitArray.push(splitChildArray)
  }

  return splitArray
}

const storeGameSale = gameSales => {
  const items = splitData(gameSales)
  items.forEach(async item => {
    await db.collection('gameSaleRaws')
      .doc(uuidv4())
      .set({
        data: JSON.stringify(item)
      })
  })
}

const dispatch = async () => {
  const url = 'https://search.nintendo.jp/nintendo_soft/search.json'
    + '?opt_sshow=1&xopt_ssitu[]=sales_termination&xopt_ssitu[]=not_found'
    + '&limit=300&page=1&c=46313580867097019&opt_sale_flg=1'
    + '&sort=sodate%20desc%2Cscore&opt_search=1'

  try {
    const response = await fetchGameSaleInfo(url)
    if (!response) {
      console.log(`Could not get response`)
      return
    }

    if (!response.data) {
      console.log(`Could not get data`)
      return
    }

    if (!response.data.result) {
      console.log(`Could not get result`)
      return
    }

    storeGameSale(response.data.result.items)

  } catch (e) {
    console.log(e)
  }
}

dispatch()