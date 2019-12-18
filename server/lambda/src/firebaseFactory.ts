const admin = require("firebase-admin")

const serviceAccount = require("./config/firebaseConfig.json")

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://switch-game-sale-notifier.firebaseio.com"
  })
}

export default admin