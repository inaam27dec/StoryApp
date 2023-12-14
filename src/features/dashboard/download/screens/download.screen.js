import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, FlatList, Alert} from 'react-native';
import {Spacer} from '../../../../components/spacer/spacer.component';
import {SafeArea} from '../../../../components/utility/safe-area.component';
import {
  MainContainer,
  RowView,
  TopHeading,
} from '../../../../infrastructure/theme/global.styles';
import {colors} from '../../../../infrastructure/theme/colors';

import DownloadStoryComponent from '../components/download.story.component';
import {AppConstants} from '../../../../constants/app.constants';
import {getItem} from '../../../../constants/helper';
import firestore from '@react-native-firebase/firestore';
import dbConstants from '../../../../constants/dbConstants';
import NetInfo from '@react-native-community/netinfo';
import {
  getCharacterByID,
  isBookMarkExists,
} from '../../../../constants/social.helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {openAudioPlayer} from '../../../../utils/router_service';
import {fonts} from '../../../../infrastructure/theme/fonts';

function DownloadScreen(props) {
  const [downloadList, setDownloadList] = useState([]);
  const {navigation} = props;

  useEffect(() => {
    getItem(AppConstants.userID).then(async data => {
      let fcmToken = await AsyncStorage.getItem('fcmToken');
      let dataArray = [];
      let a = firestore()
        .collection(dbConstants.DOWNLOADS)
        .where('userID', '==', data)
        .where('fcm_token', '==', fcmToken)
        .onSnapshot(querySnapshot => {
          const downloadedList = querySnapshot.docs.map(documentSnapshot => {
            return documentSnapshot._data;
          });

          setDownloadList(downloadedList);
        });
    });
  }, []);

  // console.log(downloadList);
  return (
    <SafeArea style={styles.container}>
      <MainContainer>
        <RowView
          style={{justifyContent: 'space-between', alignItems: 'center'}}>
          <TopHeading>Downloads</TopHeading>
        </RowView>
        <Spacer position="bottom" size="large" />
        <View style={{height: '94%'}}>
          {downloadList.length == 0 ? (
            <View style={styles.noLblContainer}>
              <Text style={styles.noLbl}>No Downloads</Text>
            </View>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={downloadList}
              renderItem={({item, index}) => {
                return (
                  <DownloadStoryComponent
                    item={item}
                    isSubscribed={true}
                    selection={true}
                    index={index}
                    onPress={async () => {
                      const networkState = await NetInfo.fetch();
                      let isOnline = networkState.isConnected;

                      if (!isOnline && item.percentageDownload < 100) {
                        Alert.alert(
                          'Error',
                          'This story was not downloaded properly, Please connect your internet and try again.',
                        );
                      } else if (
                        (!isOnline && item.percentageDownload === 100) ||
                        (isOnline && !item.percentageDownload < 100) ||
                        (isOnline && item.percentageDownload === 100)
                      ) {
                        let isHighlight = await getItem(
                          AppConstants.userHighlightPreference,
                        );
                        console.log('isHighlight value ====', isHighlight);

                        isBookMarkExists(item.storyID).then(bookmarkValue => {
                          getCharacterByID(item.characterID).then(data => {
                            let result = openAudioPlayer(
                              navigation,
                              bookmarkValue,
                              isHighlight,
                              item.story,
                              data,
                              false,
                            );
                            if (result === false) {
                            }
                          });
                        });
                      }
                    }}
                  />
                );
              }}
              keyExtractor={(item, index) => `${index}`}
            />
          )}
        </View>
      </MainContainer>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  container: {},
  item: {
    height: 50,

    marginTop: 11,

    color: colors.ui.black,

    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 3, height: 3},
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  noLblContainer: {
    height: '90%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noLbl: {
    textAlignVertical: 'center',
    textAlign: 'center',
    fontSize: 18,
    fontFamily: fonts.Poppins_Medium,
    color: colors.ui.gray,
  },
});
export default DownloadScreen;
