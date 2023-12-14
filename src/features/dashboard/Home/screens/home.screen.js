/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState, useRef, useCallback} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CategoryComponent from '../components/category.component';
import styled from 'styled-components';
import {SubHeading} from '../../../../infrastructure/theme/global.styles';
import {SafeArea} from '../../../../components/utility/safe-area.component';
import {AppConstants, Images} from '../../../../constants/app.constants';
import {
  addSubscription,
  getCharacterByID,
  getCharacters,
  getLatestStories,
  getStories,
  getUserFromDatabase,
  getUserPreferenceFromDatabase,
  getUserRecommendations,
  isBookMarkExists,
} from '../../../../constants/social.helper';
import CustomActivityIndicator from '../../../../components/utility/activity.indicator.component';
import {colors} from '../../../../infrastructure/theme/colors';
import {
  setItem,
  getItem,
  logoutOnAccountDeleteNotification,
} from '../../../../constants/helper';
import Toast, {BaseToast} from 'react-native-toast-message';
import {ScrollView} from 'react-native-gesture-handler';
import {fonts} from '../../../../infrastructure/theme/fonts';
import QuestionnaireScreen from '../../story/screens/questionnaire.screen';
import SubscriptionScreen from '../../story/screens/subscription.screen';
import RecommendedStoryComponent from '../components/recommended.story.component';
import LatestStoryComponent from '../components/latest.story.component';
import NetInfo from '@react-native-community/netinfo';
import {useFocusEffect} from '@react-navigation/native';
import {checkEitherSubscriptionExpiredNew} from '../../../../utils/inapp_service';
import {openAudioPlayer} from '../../../../utils/router_service';

const TopContainer = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const FlatListContainer = styled(View)`
  height: 270px;
  padding: 4px;
`;
const CategoryList = styled(FlatList)`
  width: 100%;
`;

const Subtitle = styled(Text)`
  font-family: ${props => props.theme.fonts.Poppins_Regular};
  font-weight: 400;
  font-size: 14px;
`;
let i = 1;
export const HomeScreen = props => {
  const {navigation} = props;
  const [loading, setLoading] = useState(false);
  const [recommendedStoryLoading, setRecommendedStoryLoading] = useState(false);
  const [characters, setCharacters] = useState([]);
  const [profilePicUrl, setprofilePicUrl] = useState('');
  const [copyCharacters, setCopyCharacters] = useState([]);
  const [recommendedStories, setRecommendedStories] = useState([]);
  const [latestStories, setLatestStories] = useState([]);
  const [latestStoryCharacter, setLatestStoryCharacter] = useState(null);

  const [lastIndex, setLastIndex] = useState(0);
  const flatListRef = useRef(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [selection, setSelection] = useState(-1);
  const [isQuestionnaireScreenVisible, setIsQuestionnaireScreenVisible] =
    useState(false);
  const [isSubscriptionScreenVisible, setIsSubscriptionScreenVisible] =
    useState(false);

  async function notificationReceived(event) {
    navigation.navigate('Home');
    navigation.navigate('LatestStoriesStack');
  }

  useEffect(() => {
    setLoading(true);
    window.EventBus.on('customNotification', notificationReceived);
    getCharacters().then(data => {
      Toast.show({
        text1: '💡 Tool Tip',
        text2: 'Swipe left or right to see your favorite chracters',
      });

      setLoading(false);
      var characetrsList = data;
      characetrsList = characetrsList.sort((a, b) =>
        a.data.order > b.data.order ? 1 : -1,
      );
      characetrsList.forEach(element => {});

      setCharacters(characetrsList);
      setCopyCharacters(data);
    });
    getUserPreferenceFromDatabase().then(data => {
      setItem(
        AppConstants.userHighlightPreference,
        data.is_highlighting_enabled,
      )
        .then(console.log('Highlight set'))
        .catch(error => {});
      setItem(AppConstants.userFemaleVoicePreference, data.is_female_voice)
        .then(console.log('Female Voice set'))
        .catch(error => {
          console.log(error);
        });
      setItem(AppConstants.userMaleVoicePreference, data.is_male_voice)
        .then(console.log('Male Voice set'))
        .catch(error => {});
      if (
        data.stories === undefined ||
        data.stories === null ||
        data.stories === ''
      ) {
        setItem(AppConstants.userStoryPreference, '')
          .then(console.log('stories preference set 1'))
          .catch(error => {});
      } else {
        setItem(AppConstants.userStoryPreference, data.stories)
          .then(console.log('stories preference set 2'))
          .catch(error => {});
      }
    });

    checkEitherSubscriptionExpiredNew();
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log('In Navigation Add Listener Block');
      reloadScreen();
      setTimeout(() => {
        Toast.show({
          text1: '💡 Tool Tip',
          text2: 'Swipe left or right to see your favorite chracters',
        });
      }, 1000);
    }, []),
  );

  const reloadScreen = () => {
    getSubscriptionStatus();
    setSelection(-1);

    getUserFromDatabase().then(userData => {
      if (userData === undefined) {
        logoutOnAccountDeleteNotification(navigation);
      } else {
        getLatestStories().then(latestOnes => {
          if (latestOnes.length > 10) {
            latestOnes = latestOnes.slice(0, 10);
          } else {
            latestOnes = latestOnes.slice(0, latestOnes.length);
          }
          var randomNumber =
            Math.floor(Math.random() * latestOnes.length - 1) + 1;
          if (randomNumber >= latestOnes.length) {
            randomNumber = randomNumber - 1;
          }
          setLatestStories([latestOnes[randomNumber]]);
          if (
            copyCharacters === null ||
            copyCharacters === undefined ||
            copyCharacters.length === 0
          ) {
            getCharacters().then(data => {
              var characetrsList = data;
              let characterId = latestOnes[randomNumber].data.character_id;
              let index = characetrsList.findIndex(
                item => item.id === characterId,
              );
              setLatestStoryCharacter(characetrsList[index]);
            });
          } else {
            var characetrsList = copyCharacters;
            let characterId = latestOnes[randomNumber].data.character_id;
            let index = characetrsList.findIndex(
              item => item.id === characterId,
            );
            setLatestStoryCharacter(characetrsList[index]);
          }
        });

        if (
          userData?.last_read_story == null ||
          userData?.last_read_story == ''
        ) {
          setRecommendedStoryLoading(true);
          getStories()
            .then(stories => {
              setRecommendedStoryLoading(false);
              let activeStories = stories.filter(
                item => item.data.status === 'active',
              );
              setRecommendedStories(activeStories);
            })
            .catch(error => {
              console.log(error);
              setRecommendedStoryLoading(false);
            });
        } else {
          setRecommendedStoryLoading(true);
          getUserRecommendations(userData?.last_read_story)
            .then(recommendations => {
              if (recommendations.length > 0) {
                let activeStories = recommendations.filter(
                  item => item.status === 'active',
                );

                var result = activeStories.map(story => ({
                  id: story.story_id,
                  data: story,
                }));
                setRecommendedStoryLoading(false);
                setRecommendedStories(result);
              } else {
                getStories().then(stories => {
                  let activeStories = stories.filter(
                    item => item.data.status === 'active',
                  );
                  setRecommendedStoryLoading(false);
                  setRecommendedStories(activeStories);
                });
              }
            })
            .catch(error => {
              console.log(error);
              setRecommendedStoryLoading(false);
            });
        }

        setprofilePicUrl(userData.profile_pic);
      }
    });
  };

  const toggleQuestionnaireModal = () => {
    setIsQuestionnaireScreenVisible(!isQuestionnaireScreenVisible);
  };

  const toggleSubscripionModal = () => {
    setIsSubscriptionScreenVisible(!isSubscriptionScreenVisible);
  };

  const getSubscriptionStatus = async () => {
    let isSubscription = await getItem(AppConstants.isSubscriptionEnabled);
    console.log('isSubscription in splash screen ====', isSubscription);
    if (isSubscription === null || isSubscription === undefined) {
      setItem(AppConstants.isSubscriptionEnabled, false);
      isSubscription = false;
    }

    setIsSubscribed(isSubscription);
  };

  const toastConfig = {
    success: props => (
      <BaseToast
        {...props}
        style={{borderLeftColor: colors.ui.purple}}
        contentContainerStyle={{paddingHorizontal: 15}}
        text1Style={{
          fontSize: 14,
          fontWeight: '500',
        }}
        text2Style={{
          fontSize: 12,
          fontWeight: '500',
          color: 'black',
        }}
      />
    ),
  };

  return (
    <SafeArea>
      {loading && <CustomActivityIndicator animate={loading} />}
      <ScrollView style={styles.mainContainer}>
        <View style={styles.topContainer}>
          <TopContainer>
            <SubHeading style={{fontWeight: '700', color: colors.ui.purple}}>
              Hey! Welcome
            </SubHeading>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('SearchScreen', {
                  characters: characters,
                });
              }}
              style={{
                flexDirection: 'row',
                backgroundColor: 'white',
                borderRadius: 40,
                paddingVertical: 11,
                paddingHorizontal: 20,
              }}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#838383',
                  fontWeight: '500',
                  fontFamily: 'Poppins',
                }}>
                Search
              </Text>
              <Image
                source={Images.search}
                style={{
                  tintColor: '#838383',
                  height: 16,
                  width: 16,
                  marginLeft: 50,
                }}
              />
            </TouchableOpacity>
          </TopContainer>
          <TouchableOpacity
            onPress={async () => {
              if (latestStoryCharacter !== null) {
                navigation.navigate('LatestStoriesStack');
              }
            }}>
            <LatestStoryComponent
              latestStory={latestStories[0]}
              latestStoryCharacter={latestStoryCharacter}
            />
          </TouchableOpacity>
          <View style={styles.header}>
            <SubHeading>Select your Storyteller</SubHeading>
            <Subtitle>
              Please chose a Storyteller below for your story{' '}
            </Subtitle>
          </View>
        </View>
        <FlatListContainer>
          <CategoryList
            ref={flatListRef} // add ref
            pagingEnabled={false}
            legacyImplementation={false}
            horizontal
            data={copyCharacters}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({item, index}) => {
              return (
                <CategoryComponent
                  data={item.data}
                  onPress={() => {
                    setLastIndex(index);
                    i = index;
                    navigation.navigate('CharacterSelection', {
                      characterData: item,
                      ageGroupId: -1,
                    });
                  }}
                />
              );
            }}
          />
        </FlatListContainer>
        <View style={{margin: 20, marginTop: -20}}>
          <ActivityIndicator
            animating
            size="large"
            color={colors.ui.purple}
            style={[
              styles.recommendedStoryLoadingStyle,
              {
                opacity:
                  recommendedStories.length === 0 && recommendedStoryLoading
                    ? 1.0
                    : 0.0,
              },
            ]}
          />
          <SubHeading>Popular this week!</SubHeading>
          <View style={{marginTop: 20}}>
            <FlatList
              bounces={false}
              data={recommendedStories.slice(0, 3)}
              renderItem={({item, index}) => {
                return (
                  <RecommendedStoryComponent
                    item={item}
                    isSubscribed={isSubscribed}
                    selection={selection}
                    index={index}
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
                          setSelection(index);
                          let isHighlight = await getItem(
                            AppConstants.userHighlightPreference,
                          );

                          isBookMarkExists(item.id).then(bookmarkValue => {
                            getCharacterByID(item.data.character_id).then(
                              data => {
                                setLoading(false);
                                let result = openAudioPlayer(
                                  navigation,
                                  bookmarkValue,
                                  isHighlight,
                                  item,
                                  data,
                                  false,
                                );
                                if (result === false) {
                                  setSelection(-1);
                                }
                              },
                            );
                          });
                        }
                      }
                      // });
                    }}
                  />
                );
              }}
              keyExtractor={(item, index) => `${index}`}
            />
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
                console.log('calling addSubscription from home screen');

                await addSubscription(
                  productId,
                  transactionDateTimeStamp,
                  deviceType,
                  subscriptionType,
                  price,
                  transactionReceipt,
                ).then(data => {});
                reloadScreen();
              }}
              onCancelTapped={() => {
                setIsSubscriptionScreenVisible(false);
                reloadScreen();
              }}
            />
          </View>
        </View>
      </ScrollView>

      <Toast position="bottom" config={toastConfig} bottomOffset={20} />
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: 20,
  },
  mainContainer: {
    flex: 1,
  },
  topContainer: {
    margin: 20,
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btn: {
    borderWidth: 1,
    borderColor: colors.ui.white,
    borderRadius: 16,
    marginBottom: 10,
    backgroundColor: 'white',
    height: 90,
  },
  NonSubscribedBtnText: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.ui.gray,
    fontFamily: fonts.Poppins_Regular,
    fontWeight: '500',
    marginLeft: 20,
    alignSelf: 'center',
  },
  btnText: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.ui.black,
    fontFamily: fonts.Poppins_Regular,
    fontWeight: '500',
    marginLeft: 20,
    alignSelf: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendedStoryLoadingStyle: {
    flex: 1,
    top: 70,
    zIndex: 5,
  },
});
