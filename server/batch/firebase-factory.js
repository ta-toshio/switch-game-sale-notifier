const admin = require("firebase-admin")

const serviceAccount = require("./config/firebaseConfig.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://switch-game-sale-notifier.firebaseio.com"
})

module.exports = admin