const firebaseAdmin = require('./../firebase-factory')
const axios = require('axios')
const nGram = require('n-gram')

const db = firebaseAdmin.firestore()

const fetch = async url => {
  try {
    return await axios.get(url)
  } catch (e) {
    console.log(e)
  }
}

const handleStore = items => {
  items.reverse().map(async item => {
    const titleBigram = {}
    const bigram = nGram.bigram(item.title)
    bigram.forEach(word => {
      titleBigram[word] = true
    })

    console.log(`save id: ${item.id}`)

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

    return item
  })
}

const range = (start, stop) => 
  Array.from({ length: (stop - start) + 1}, (_, i) => start + i)

const pages = range(1, 69).reverse()

pages.map(async page => {
  const url = 'https://search.nintendo.jp/nintendo_soft/search.json'
    + '?opt_sshow=1&fq=ssitu_s%3Aonsale%20OR%20ssitu_s%3Apreorder&' 
    + `limit=24&page=${page}&c=46313580867097019&opt_osale=1&opt_hard=1_HAC&`
    + 'sort=sodate%20desc%2Cscore'

  console.log(`dispatch page: ${page}`)

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
})


// const data = require('./games.json')
// const items = data.result.items
// handleStore(items)
