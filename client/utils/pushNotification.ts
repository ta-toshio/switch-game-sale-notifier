import { Notifications } from 'expo'
import * as Permissions from 'expo-permissions'
import { firestore } from '../config/firebase'

export const getPushNotificationToken = async() => {
  const { status: existingStatus } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  let finalStatus = existingStatus;

  // only ask if permissions have not already been determined, because
  // iOS won't necessarily prompt the user a second time.
  if (existingStatus !== 'granted') {
    // Android remote notification permissions are granted during the app
    // install, so this will only ask on iOS
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  // Stop here if the user did not grant permissions
  if (finalStatus !== 'granted') {
    return;
  }

  // Get the token that uniquely identifies this device
  let token = await Notifications.getExpoPushTokenAsync();

  return token
}

export const registerPushNotificationToken = async (uid: string, token: string) => {
  const notificationData = await getMyNotificationData(uid)

  await firestore.collection('notifications')
    .doc(uid)
    .set({
      uid,
      token,
      status: notificationData ? notificationData.status : true,
    })

  return await getMyNotificationData(uid)
}

export const getMyNotificationData = async(uid: string) => {
  const doc = await firestore.collection('notifications').doc(uid).get()
  return doc.data()
}