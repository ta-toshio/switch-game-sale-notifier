const firebaseAdmin = require('../firebase-factory')
const axios = require('axios')
const uuidv4 = require('uuid/v4')
const db = firebaseAdmin.firestore()

const dispatch = () => {
  const id = uuidv4()
  db.collection('notificationEvents')
    .doc(id)
    .set({
      id,
      createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp()
    })
}

dispatch()