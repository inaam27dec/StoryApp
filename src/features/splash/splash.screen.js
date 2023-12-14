/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-undef */
import React from 'react';
import {View, StyleSheet, ImageBackground} from 'react-native';
import imagePath from '../../constants/imagePath';
import navigationStrings from '../../constants/navigationStrings';
import {getFirstTime, getItem, setItem} from '../../constants/helper';
import {useEffect} from 'react';
import {AppConstants} from '../../constants/app.constants';
import firestore from '@react-native-firebase/firestore';

export const SplashScreen = props => {
  const {navigation} = props;
  useEffect(() => {
    getFirstTime().then(data => {
      setupNavigation(data);
    });
  }, []);

  const setupNavigation = async data => {
    let isSubscription = await getItem(AppConstants.isSubscriptionEnabled);
    if (isSubscription === null || isSubscription === undefined) {
      setItem(AppConstants.isSubscriptionEnabled, false);
    }

    setTimeout(() => {
      if (data === false) {
        navigation.replace('Swiper');
      } else {
        isTheUserAuthenticated();
      }
    }, 2000);
  };

  const isTheUserAuthenticated = async () => {
    await firestore().settings({
      persistence: true, // enable offline persistence
    });
    let isAdminLogin = await getItem(AppConstants.isAdminLogin);
    let isUserLogin = await getItem(AppConstants.isUserLogin);
    console.log('isUserLogin ===', isUserLogin);
    if (isUserLogin) {
      if (isAdminLogin) {
        navigation.replace(navigationStrings.ADMIN_STACK);
      } else {
        navigation.replace(navigationStrings.DASHBOARD);
      }
    } else {
      navigation.replace('Auth');
    }
  };

  return (
    <View style={styles.imgContainer}>
      <ImageBackground style={styles.imgBG} source={imagePath.splash_bear} />
    </View>
  );
};

const styles = StyleSheet.create({
  imgContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
    backgroundColor: '#8015E8',
  },
  imgBG: {
    backgroundColor: '#ccc',
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
});
