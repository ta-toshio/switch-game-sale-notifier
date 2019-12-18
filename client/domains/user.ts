import { Platform } from 'react-native'
import * as Application from 'expo-application'
import { firestore } from '../config/firebase'

export const register = async userId => {
  await firestore
    .collection('users')
    .doc(userId)
    .set({
      id: userId
    })
}

export const fetch = async userId => {
  const ref = firestore
    .collection('users')
    .doc(userId)
  
  const doc = await ref.get()
  if (!doc.exists) {
    return null
  }
  return doc.data()
}

export const getUserId = async () => {
  let userId = null

  if (Platform.OS === 'ios') {
    userId = await Application.getIosIdForVendorAsync()
  }
  if (Platform.OS === 'android') {
    userId = Application.androidId
  }

  return userId
}