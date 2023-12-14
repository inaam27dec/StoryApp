/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Text, Alert} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {Spacer} from '../../../../components/spacer/spacer.component';
import CustomActivityIndicator from '../../../../components/utility/activity.indicator.component';
import {SafeArea} from '../../../../components/utility/safe-area.component';
import {AppConstants} from '../../../../constants/app.constants';
import {getItem, setItem} from '../../../../constants/helper';
import {
  addSubscription,
  getBookMarksByUserID,
  getStoryByID,
} from '../../../../constants/social.helper';
import {
  MainContainer,
  RowView,
  TopHeading,
} from '../../../../infrastructure/theme/global.styles';
import BookmarkCmponent from '../components/bookmark.component';
import {fonts} from '../../../../infrastructure/theme/fonts';
import {colors} from '../../../../infrastructure/theme/colors';
import QuestionnaireScreen from '../../story/screens/questionnaire.screen';
import SubscriptionScreen from '../../story/screens/subscription.screen';
import NetInfo from '@react-native-community/netinfo';
import {openAudioPlayer} from '../../../../utils/router_service';

function BookmarkScreen(props) {
  const {navigation} = props;
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playedStory, setPlayedStory] = useState('');
  const [clickedItem, setClickedItem] = useState('');
  const [isSubscriptionScreenVisible, setIsSubscriptionScreenVisible] =
    useState(false);
  const [isQuestionnaireScreenVisible, setIsQuestionnaireScreenVisible] =
    useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const toggleSubscripionModal = () => {
    setIsSubscriptionScreenVisible(!isSubscriptionScreenVisible);
  };

  const toggleQuestionnaireModal = () => {
    setIsQuestionnaireScreenVisible(!isQuestionnaireScreenVisible);
  };

  const getSubscriptionStatus = async () => {
    let isSubscription = await getItem(AppConstants.isSubscriptionEnabled);
    console.log('isSubscription available ==========', isSubscribed);
    setIsSubscribed(isSubscription);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getSubscriptionStatus();
      setLoading(true);
      getBookMarksByUserID().then(data => {
        setLoading(false);
        setList(data);
      });
      return unsubscribe;
    });
  }, []);

  const reloadAfterSubscription = () => {
    getSubscriptionStatus();
    setLoading(true);
    getBookMarksByUserID().then(data => {
      setLoading(false);
      setList(data);
    });
  };

  return (
    <SafeArea>
      <MainContainer>
        {loading && <CustomActivityIndicator animate={loading} />}
        <RowView
          style={{justifyContent: 'space-between', alignItems: 'center'}}>
          <TopHeading>Bookmarks</TopHeading>
        </RowView>
        <Spacer position="bottom" size="large" />
        <View style={{height: '96%'}}>
          {list.length == 0 ? (
            <View style={styles.noLblContainer}>
              <Text style={styles.noLbl}>No Bookmarks Found</Text>
            </View>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              style={styles.list}
              data={list}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={props => {
                return <View style={{height: 20}} />;
              }}
              renderItem={({item}) => (
                <BookmarkCmponent
                  title={item.data.story_title}
                  ratingVal={item.data.story_rating}
                  imgUrl={item.data.character_img_url}
                  name={item.data.characterName}
                  isSubscribed={isSubscribed}
                  isFree={item.data.is_free}
                  onPress={async () => {
                    const networkState = await NetInfo.fetch();
                    let isOffline = networkState.isConnected;
                    if (!isOffline) {
                      Alert.alert(
                        'Error',
                        'Please connect your internet to continue, and check if there is anything in your downloads.',
                      );
                    } else {
                      if (!isSubscribed && !item.data.is_free) {
                        toggleQuestionnaireModal();
                      } else {
                        setLoading(true);
                        let isHighlight = await getItem(
                          AppConstants.userHighlightPreference,
                        );

                        getStoryByID(item.data.storyID).then(story => {
                          setClickedItem(item);
                          setPlayedStory(story);
                          let characterObj = {
                            id: item.data.characterID,
                            data: {
                              name: item.data.characterName,
                              half_animation_url: item.data.character_img_url,
                            },
                          };
                          setTimeout(() => {
                            setLoading(false);
                            let result = openAudioPlayer(
                              navigation,
                              true,
                              isHighlight,
                              story,
                              characterObj,
                              false,
                            );
                            if (result === false) {
                              setClickedItem('');
                              setPlayedStory('');
                            }
                          }, 500);
                        });
                      }
                    }
                  }}
                />
              )}
            />
          )}
        </View>
        <View style={styles.centeredView}>
          <QuestionnaireScreen
            visible={isQuestionnaireScreenVisible}
            onSuccess={() => {
              setIsQuestionnaireScreenVisible(false);
              toggleSubscripionModal();
            }}
            onCancelTapped={() => {
              setIsQuestionnaireScreenVisible(false);
            }}
          />
        </View>
        <View style={styles.centeredView}>
          <SubscriptionScreen
            visible={isSubscriptionScreenVisible}
            onSubscriptionSelected={async (
              productId,
              transactionDateTimeStamp,
              deviceType,
              subscriptionType,
              price,
              transactionReceipt,
            ) => {
              setIsSubscriptionScreenVisible(false);
              setItem(AppConstants.isSubscriptionEnabled, true);

              setLoading(true);
              console.log('calling addSubscription from bookmark screen');
              await addSubscription(
                productId,
                transactionDateTimeStamp,
                deviceType,
                subscriptionType,
                price,
                transactionReceipt,
              )
                .then(data => {
                  setLoading(false);
                  console.log('added subscription to DB ===========', data);
                  reloadAfterSubscription();
                })
                .catch(error => {
                  console.log(
                    'error in adding subscription to firebase = ',
                    error,
                  );
                  setLoading(false);
                  reloadAfterSubscription();
                });
            }}
            onCancelTapped={() => {
              setIsSubscriptionScreenVisible(false);
              reloadAfterSubscription();
            }}
          />
        </View>
      </MainContainer>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  list: {
    flexDirection: 'column',
    marginBottom: '10%',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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

export default BookmarkScreen;
