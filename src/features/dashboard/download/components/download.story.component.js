/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {Alert, StyleSheet, Text} from 'react-native';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {TouchableOpacity} from 'react-native';
import ProgressBar from 'react-native-progress-bar/ProgressBar';
import {colors} from '../../../../infrastructure/theme/colors';
import {fonts} from '../../../../infrastructure/theme/fonts';
import {RowViews} from '../../../../infrastructure/theme/global.styles';
import {Dimensions} from 'react-native';
import imagePath from '../../../../constants/imagePath';
import {EventRegister} from 'react-native-event-listeners';
import NetInfo from '@react-native-community/netinfo';

function DownloadStoryComponent(props) {
  const {onPress, item, selection, index} = props;
  const [progress, setProgress] = useState(0);
  const [downloadStaus, setDownloadStaus] = useState('Fetching Status');

  const hasDownloaded = item => {
    let result = item.percentageDownload === 100;
    return result;
  };

  setTimeout(() => {
    setProgress(item.percentageDownload / 100);
  }, 1000);

  useEffect(() => {
    setTimeout(() => {
      if (item.downloadStatus === 'Downloading In Progress') {
        setDownloadStaus('Downloading Failed');
      }
    }, 1000);
  }, []);
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        selection === index ? {backgroundColor: colors.ui.purple} : null,
        hasDownloaded(item) ? {height: 85} : {height: 90},
      ]}
      onPress={onPress}>
      <RowViews style={[styles.rowViewStyle]}>
        <FastImage
          style={[
            styles.img,
            {
              borderColor: '#9FE279',
            },
          ]}
          resizeMode={'contain'}
          source={{uri: item.character_img_url}}
        />
        <View style={{justifyContent: 'center'}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <Text
              style={[
                hasDownloaded(item)
                  ? [styles.downloaded]
                  : [styles.downloading],
                {flex: 3, alignSelf: 'center', paddingRight: 10, marginTop: 10},
              ]}
              numberOfLines={2}>
              {item.story_title}
            </Text>
            {hasDownloaded(item) ? null : (
              <TouchableOpacity
                style={{
                  justifyContent: 'center',
                  flex: 1,
                }}
                onPress={async () => {
                  const networkState = await NetInfo.fetch();

                  let isOnline = networkState.isConnected;
                  if (isOnline) {
                    EventRegister.emit('Event', {
                      narratorList: item.narratorList,
                      story: item.story,
                      pageList: item.pageList,
                      currentPageNumber: 0,
                      paragraphIndex: 0,
                    });
                  } else {
                    Alert.alert(
                      'Error',
                      'This story was not downloaded properly, Please connect your internet and try again.',
                    );
                  }
                }}>
                <FastImage
                  source={imagePath.download}
                  style={styles.noImageBackgroundWithSize}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>

          {hasDownloaded(item) ? (
            <Text
              style={[
                hasDownloaded(item)
                  ? [styles.downloaded, {color: 'green'}]
                  : [styles.downloading, {color: 'blue'}],
                {fontSize: 14},
              ]}>
              {item.downloadStatus === 'Downloading In Progress'
                ? 'Finishing'
                : 'Downloaded'}
            </Text>
          ) : null}

          <View
            style={{
              flexDirection: 'column',
              width: Dimensions.get('window').width - 150,
            }}>
            {hasDownloaded(item) ? null : (
              <Text style={[{fontSize: 10, alignSelf: 'flex-end'}]}>
                {Math.ceil((item.percentageDownload / 100) * 100)}%
              </Text>
            )}
            {hasDownloaded(item) ? null : (
              <ProgressBar
                fillStyle={{backgroundColor: 'purple'}}
                progress={progress}
                backgroundStyle={{borderRadius: 2}}
                style={{
                  width: Dimensions.get('window').width - 150,
                  marginLeft: 20,
                  marginTop: 10,
                }}
              />
            )}
          </View>
        </View>
      </RowViews>
    </TouchableOpacity>
  );
}

export default DownloadStoryComponent;

const styles = StyleSheet.create({
  rowViewStyle: {
    marginLeft: 15,
  },
  btn: {
    borderWidth: 1,
    borderColor: colors.ui.white,
    borderRadius: 16,
    marginBottom: 10,
    width: '100%',
    backgroundColor: colors.ui.white,
  },
  downloaded: {
    fontSize: 14,
    color: colors.ui.black,
    fontFamily: fonts.Poppins_Regular,
    fontWeight: '500',
    marginLeft: 20,
    alignSelf: 'baseline',
    width: '90%',
  },
  downloading: {
    color: '#0003',
    textShadowColor: 'rgba(255,255,255,0.8)',
    textShadowOffset: {
      width: 0,
      height: 0,
    },
    textShadowRadius: 10,
    textTransform: 'capitalize',
    textDecorationStyle: 'solid',
    fontSize: 14,
    fontFamily: fonts.Poppins_Regular,
    fontWeight: '500',
    marginLeft: 20,
    width: '90%',
  },
  imgContainer: {
    width: 70,
    height: 70,
    borderRadius: 400,
    borderWidth: 3,
    alignSelf: 'center',
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: 400,
    borderWidth: 3,
    alignSelf: 'center',
    marginTop: 8,
  },
  subscriptionView: {
    width: 65,
    height: 31,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    justifyContent: 'center',
  },
  centeredText: {
    textAlign: 'center',
  },
  noImageBackgroundWithSize: {
    width: 17,
    height: 17,
    alignSelf: 'center',
  },
});
