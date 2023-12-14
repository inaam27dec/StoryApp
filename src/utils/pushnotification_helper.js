import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import {Alert, PermissionsAndroid, Platform} from 'react-native';
// import notifee from '@notifee/react-native';
import {firebase} from '@react-native-firebase/auth';

export async function requestUserPermission() {
  if (Platform.OS === 'android') {
    // PermissionsAndroid.request(
    //   PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    // );
  }
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    GetFCMToken();
  }
}

async function GetFCMToken() {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  if (!fcmToken) {
    try {
      fcmToken = await messaging().getToken();
      console.log('fcm token === ', fcmToken);
      if (fcmToken) {
        // user has a device token
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export const NotificationListener = () => {
  // Assume a message-notification contains a "type" property in the data payload of the screen to open

  console.log('inside NotificationListener');
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage,
    );
    console.log('going to the function');
    navigationOnNotificationReceive(false, remoteMessage);
    // navigation.navigate(remoteMessage.data.type);
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage,
        );
        navigationOnNotificationReceive(true, remoteMessage);
        // setInitialRoute(remoteMessage.data.type); // e.g. "Settings"
      }
      //   setLoading(false);
    });

  messaging().onMessage(async remoteMessage => {
    console.log('notification on foreground state ===', remoteMessage);
    // Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    Alert.alert(
      remoteMessage.notification.title,
      remoteMessage.notification.body,
      [
        {
          text: 'Later',
          style: 'destructive',
          onPress: () => null,
        },
        {
          text: 'Read Now',
          onPress: () => {
            navigationOnNotificationReceive(false, remoteMessage);
          },
        },
      ],
    );
    // const channelId = await notifee.createChannel({
    //   id: 'default',
    //   name: 'Default Channel',
    // });
    // await notifee.displayNotification({
    //   title: remoteMessage.notification.title,
    //   body: remoteMessage.notification.body,
    //   data: remoteMessage.data,
    // });
  });
};

async function navigationOnNotificationReceive(isQuitApp, remoteMessage) {
  console.log('inside navigationOnNotificationReceive');

  let characterImgURL = remoteMessage.data['character_half_animation_url'];
  let characterId = remoteMessage.data['character_id'];
  let characterName = remoteMessage.data['character_name'];
  let storyId = remoteMessage.data['storyId'];

  console.log(
    'before sending push observer ===',
    characterImgURL,
    characterId,
    characterName,
    storyId,
  );

  let user = firebase.auth().currentUser;
  if (user) {
    let time = isQuitApp ? 5000 : 200;
    setTimeout(() => {
      window.EventBus.trigger('customNotification', {
        characterImgURL: characterImgURL,
        characterId: characterId,
        characterName: characterName,
        storyId: storyId,
      });
    }, time);
  } else {
    // do nothing
    console.log('user is not logged in');
  }
}
