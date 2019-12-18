import React, { useEffect } from 'react'
import { Platform } from 'react-native'
import * as Application from 'expo-application'
import {
  getPushNotificationToken,
  registerPushNotificationToken,
} from '../utils/pushNotification'

const NotificationHandler = () => {

  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await getPushNotificationToken()
        if (!token) {
          return
        }

        let id = null
        if (Platform.OS === 'ios') {
          id = await Application.getIosIdForVendorAsync()
        }
        if (Platform.OS === 'android') {
          id = Application.androidId
        }

        if (!id) {
          return
        }

        const result = await registerPushNotificationToken(id, token)
        if (!result) {
          console.log('Failed to store token')
        }

      } catch (e) {
        console.log(e)
      }
    }

    getToken()
    
  }, [])

  return (
    <></>
  )
}

export default NotificationHandler