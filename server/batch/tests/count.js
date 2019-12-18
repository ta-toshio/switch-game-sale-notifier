const firebaseAdmin = require('./../firebase-factory')
const db = firebaseAdmin.firestore()

db.collection('games')
  .get()
  .then(function(querySnapshot) {
    console.log(querySnapshot.size)
  })