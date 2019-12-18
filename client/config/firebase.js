import firebase from 'firebase'
import 'firebase/firestore'
import firebaseConfig from './firebaseConfig'

// Initialize Firebase
firebase.initializeApp(firebaseConfig)

export const firestore = firebase.firestore()

export default firebase