import AsyncStorage from '@react-native-async-storage/async-storage';
import {firebase} from '@react-native-firebase/auth';
import {Alert, Platform} from 'react-native';
import * as RNFS from 'react-native-fs';

export function setItem(key, data) {
  data = JSON.stringify(data);
  return AsyncStorage.setItem(key, data);
}

export function getItem(key) {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem(key).then(data => {
      resolve(JSON.parse(data));
    });
  });
}

export function removeItem(key) {
  return AsyncStorage.removeItem(key);
}

export async function clearAsyncStorage(key) {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  await AsyncStorage.clear();
  await AsyncStorage.setItem('fcmToken', fcmToken);
  await setFirstTime(true);
}

export function setFirstTime(data) {
  data = JSON.stringify(data);
  return AsyncStorage.setItem('isFirstTime', data);
}

export async function getFirstTime() {
  return new Promise((resolve, reject) => {
    AsyncStorage.getItem('isFirstTime').then(data => {
      if (data) {
        resolve(data);
      } else {
        resolve(false);
      }
    });
  });
}

export async function logoutOnAccountDeleteNotification(navigation) {
  Alert.alert('Readrly', 'Something went wrong, please re-login to continue', [
    {
      text: 'OK',
      onPress: async () => {
        firebase.auth().signOut();
        navigation.replace('Auth');
        await clearAsyncStorage();
      },
    },
  ]);
}

export function getFormattedStoryTitle(title) {
  var storyTitle = title;
  storyTitle = title.replace(/[^a-zA-Z0-9 ]/g, '');
  storyTitle = storyTitle.replace(/\s/g, '');
  return storyTitle;
}

export const getFilePath = (
  selectedNarratorName,
  storyTitle,
  currentPageNumber,
) => {
  let path = '';
  var updatedNarratorName = selectedNarratorName;
  updatedNarratorName = updatedNarratorName.replace('/ +/g', '');
  if (Platform.OS === 'android') {
    path =
      RNFS.DownloadDirectoryPath +
      '/' +
      updatedNarratorName +
      '/' +
      storyTitle +
      '/' +
      currentPageNumber +
      '.mp3';
  } else {
    path =
      RNFS.DocumentDirectoryPath +
      '/' +
      updatedNarratorName +
      '/' +
      storyTitle +
      '/' +
      currentPageNumber +
      '.mp3';
  }
  return path;
};

export const showAlert = (
  title,
  message = '',
  buttonTitle = 'OK',
  onPressed,
) => {
  Alert.alert(title, message, [
    {
      text: buttonTitle,
      onPress: () => {
        onPressed();
      },
    },
  ]);
};

export const removeSpaces = s => {
  let result = s.replace(/\s/g, '');
  return result;
};
