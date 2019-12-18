const axios = require('axios')
const uuidv4 = require('uuid/v4')
const firebaseAdmin = require('./firebaseFactory').default

const db = firebaseAdmin.firestore()

const fetchGameMaster = async page => {
  const url = 'https://search.nintendo.jp/nintendo_soft/search.json'
      + '?opt_sshow=1&fq=ssitu_s%3Aonsale%20OR%20ssitu_s%3Apreorder&' 
      + `limit=24&page=${page}&c=46313580867097019&opt_osale=1&opt_hard=1_HAC&`
      + 'sort=sodate%20asc%2Cscore'

  console.log(`dispatch page: ${page}`)

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

const storeGame = (games) => {
  const items = splitData(games)
  return items.map(async item => {
    try {
      return db.collection('gameRaws')
        .doc(uuidv4())
        .set({
          data: JSON.stringify(item)
        })
    } catch (e) {
      console.log(e)
    }
  })
}

const range = (start, stop) => 
  Array.from({ length: (stop - start) + 1}, (_, i) => start + i)

const dispatch = () => {

  const pages = range(1, 75).reverse()

  const promises = pages.map(async page => {

    try {
      const response = await fetchGameMaster(page)
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

      return response.data.result.items

    } catch (e) {
      console.log(e)
    }
  })

  return Promise.all(promises)
  .then(async items => {
    const ensureItems = items.filter(item => {
      return item.length !== 0
    })

    const games = []
    ensureItems.forEach(item => {
      item.forEach(game => {
        games.push(game)
      })
    })

    const storeGamePromises = storeGame(games)
    return Promise.all(storeGamePromises)
  }).catch(e => {
    console.log(e)
    return false
  })
}

export default dispatch