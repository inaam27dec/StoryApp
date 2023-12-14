/* eslint-disable react-hooks/exhaustive-deps */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {NavigationContainer} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  LogBox,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  View,
  AppState,
} from 'react-native';
import {ThemeProvider} from 'styled-components';
import {theme} from './src/infrastructure/theme';
import DashboardNavStack from './src/navigators/DashboardStack';
import {AuthStack} from './src/navigators/AuthStack';
import {createStackNavigator} from '@react-navigation/stack';
import {
  getFirstTime,
  getFormattedStoryTitle,
  getItem,
  setFirstTime,
} from './src/constants/helper';
import Routes from './src/navigators/Routes';
import * as RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';

import {EventRegister} from 'react-native-event-listeners';
import {addDownloadStory} from './src/constants/social.helper';
import {
  NotificationListener,
  requestUserPermission,
} from './src/utils/pushnotification_helper';
import {AppConstants} from './src/constants/app.constants';
import firestore from '@react-native-firebase/firestore';
import dbConstants from './src/constants/dbConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();
LogBox.ignoreAllLogs();

var currentNarator = 0;
var totalPagesDownloaded = 0;

export default function App() {
  useEffect(async () => {
    this.listner = EventRegister.addEventListener('Event', data => {
      // console.log(data);
      currentNarator = 0;
      requestToPermissionsDownload(data);
    });

    requestUserPermission();
    NotificationListener();
    return () => {
      EventRegister.removeEventListener(this.listner);
    };
  }, []);

  const requestToPermissionsDownload = async data => {
    var selectedNarratorName = data.narratorList[currentNarator]?.name ?? '';
    selectedNarratorName = selectedNarratorName.replace('/ +/g', '');
    var page = data.currentPageNumber;
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    let storyTitle = getFormattedStoryTitle(data.story.data?.title ?? '');

    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          startDownloadOffline(
            data.narratorList[0]?.audioContentList[data.paragraphIndex].url ??
              '',
            selectedNarratorName,
            storyTitle,
            page,
            data,
            fcmToken,
          );
        }
      } else {
        startDownloadOffline(
          data.narratorList[currentNarator]?.audioContentList[page * 2].url ??
            '',
          selectedNarratorName,
          storyTitle,
          page,
          data,
          fcmToken,
        );
      }
    } catch (err) {
      console.log('i AM ERROR', err);
    }
  };

  const startDownloadOffline = async (
    fileUrl,
    folderName,
    filename,
    currentPageNumber,
    data,
    fcmToken,
  ) => {
    const android = RNFetchBlob.android;
    const {dirs} = RNFetchBlob.fs;
    const filepath =
      Platform.OS === 'android'
        ? dirs.DownloadDir +
          '/' +
          folderName +
          '/' +
          filename +
          '/' +
          currentPageNumber +
          '.mp3'
        : dirs.DocumentDir +
          '/' +
          folderName +
          '/' +
          filename +
          '/' +
          currentPageNumber +
          '.mp3';
    let exists = await RNFS.exists(filepath);
    console.log('filepath in App.js = ', filepath);
    console.log(exists);
    const downloadAppUrl = fileUrl;
    const configfb = {
      fileCache: true,
      useDownloadManager: true,
      notification: true,
      title: 'Great, download success',
      mime: 'application/vnd.android.package-archive',
      path: filepath,
    };
    const configOptions = Platform.select({
      ios: {
        fileCache: configfb.fileCache,
        title: configfb.title,
        path: configfb.path,
        appendExt: '.mp3',
      },
      android: configfb,
    });
    console.log('URL in App.js: ', downloadAppUrl);
    RNFetchBlob.config(configOptions)
      .fetch('GET', downloadAppUrl)
      .then(async res => {
        totalPagesDownloaded++;
        console.log(currentPageNumber);
        if (currentPageNumber % 1 === 0) {
          var progress =
            (totalPagesDownloaded /
              (data.pageList.length * data.narratorList.length)) *
            100;
          let title = data.story.data.title.replace(/[^a-zA-Z0-9 ]/g, '');
          await addDownloadStory(
            data.story.id,
            data.story.data.character_id,
            data.story.data.cover_img_url,
            title,
            progress > 100 ? 99 : progress,
            'Downloading In Progress',
            data.pageList.length,
            currentPageNumber,
            data.story,
            data.narratorList,
            data.pageList,
            fcmToken,
          )
            .then(data => {})
            .catch(error => {});
        }
        currentPageNumber++;
        if (currentPageNumber < data.pageList.length) {
          startDownloadOffline(
            data.narratorList[currentNarator]?.audioContentList[
              currentPageNumber * 2
            ].url ?? '',
            folderName,
            filename,
            currentPageNumber,
            data,
            fcmToken,
          );
        } else {
          if (currentNarator < data.narratorList.length) {
            currentNarator = currentNarator + 1;
            currentPageNumber = 0;
            var selectedNarratorName =
              data.narratorList[currentNarator]?.name ?? '';
            selectedNarratorName = selectedNarratorName.replace('/ +/g', '');
            startDownloadOffline(
              data.narratorList[currentNarator]?.audioContentList[
                currentPageNumber * 2
              ].url ?? '',
              selectedNarratorName,
              filename,
              currentPageNumber,
              data,
              fcmToken,
            );
          } else {
            let title = data.story.data.title.replace(/[^a-zA-Z0-9 ]/g, '');
            await addDownloadStory(
              data.story.id,
              data.story.data.character_id,
              data.story.data.cover_img_url,
              title,
              100,
              'Downloaded',
              data.pageList.length,
              currentPageNumber,
              data.story,
              data.narratorList,
              data.pageList,
              fcmToken,
            )
              .then(data => {})
              .catch(error => {});
          }
        }
      })
      .catch(async () => {
        let title = data.story.data.title.replace(/[^a-zA-Z0-9 ]/g, '');
        await addDownloadStory(
          data.story.id,
          data.story.data.character_id,
          data.story.data.cover_img_url,
          title,
          100,
          'Downloaded',
          data.pageList.length,
          currentPageNumber,
          data.story,
          data.narratorList,
          data.pageList,
          fcmToken,
        )
          .then(data => {})
          .catch(error => {});
        // setShowDownloadLoader(false);
      });
  };

  return (
    <>
      <ThemeProvider theme={theme}>
        <Routes />
      </ThemeProvider>
    </>
  );
}
