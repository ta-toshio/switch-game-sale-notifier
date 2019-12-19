process.env.TZ = 'Asia/Tokyo'
const Expo = require('expo-server-sdk').default
const firebaseAdmin = require('./../firebase-factory')
const moment = require('moment')

const db = firebaseAdmin.firestore()
const expo = new Expo();

const dispatch = async () => {

  const games = await fetchCertainRangeOfGameSales(-1, -0)
  const promisesForGames = games.map(async game => {
    // console.log(game.title)
    const users = await fetchGameUsers(game.id)
    const promisesForUsers = users.map(async user => {
      const userId = user.id
      const notification = await fetchUserNotificationToken(userId)
      const token = notification && notification.token
      return { token, game }
    })
    return Promise.all(promisesForUsers)
  })

  Promise.all(promisesForGames)
    .then(tokensAndGames => {
      return tokensAndGames.filter((tokenAndGame) => {
        return tokenAndGame.length
      })
    })
    .then(tokensAndGames => {
      const saleInfoByUser = {}
      tokensAndGames.forEach(tokenAndGame => {
        tokenAndGame.forEach(_tokenAndGame => {
          if (!saleInfoByUser[_tokenAndGame.token]) {
            saleInfoByUser[_tokenAndGame.token] = []
          }
          saleInfoByUser[_tokenAndGame.token].push({
            title: _tokenAndGame.game.title,
            defaultPrice: _tokenAndGame.game.dprice,
            salePrice: _tokenAndGame.game.sprice,
          })
        })
      })
      return saleInfoByUser
    })
    .then(saleInfoByUser => {
      const messages = []
      Object.keys(saleInfoByUser).forEach(token => {
        if (!Expo.isExpoPushToken(token)) {
          return
        }

        const info = saleInfoByUser[token]

        const gameNum = info.length
        const body = info.slice(1).map(data => data.title).join('、')
          + (gameNum > 2 ? '、他' : '')
        messages.push({
          to: token,
          sound: 'default',
          body: '[本日のお気に入りのセール] ' + body,
          data: {}
        })
      })
      console.log(messages)
    })
}

const fetchUserNotificationToken = async userId => {
  const doc = await db.collection(`notifications`).doc(userId).get()

  if (doc.empty) {
    return null
  }

  return doc.data()
}

const fetchGameUsers = async (gameId) => {

  const snapshot = await db.collection(`games/${gameId}/users`)
    .get()
  
  const users = []
  if (snapshot.empty) {
    return users
  }

  snapshot.forEach(doc => {
    users.push(doc.data())
  })

  return users
}

const fetchCertainRangeOfGameSales = async (start, end) => {

  const startOfDay = moment().add(start, 'day').startOf('day')
  const endOfDay = moment().add(end, 'day').endOf('day')

  const snapshot = await db.collection('gameSales')
    .orderBy('ssdate', 'asc')
    .where('ssdate', '>=', startOfDay.toDate())
    .where('ssdate', '<=', endOfDay.toDate())
    .get()
  
  const games = []
  if (snapshot.empty) {
    return games
  }

  snapshot.forEach(doc => {
    games.push(doc.data())
  })

  return games
}

dispatch()