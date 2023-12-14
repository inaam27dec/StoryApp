/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useMemo, useState} from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
  NativeModules,
  NativeEventEmitter,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';
import {FlatList} from 'react-native-gesture-handler/lib/commonjs/components/GestureComponents';
import {Spacer} from '../../../components/spacer/spacer.component';
import CustomActivityIndicator from '../../../components/utility/activity.indicator.component';
import {SafeArea} from '../../../components/utility/safe-area.component';
import SearchbarComponent from '../../../components/utility/searchbar.component';
import {AppConstants, Images} from '../../../constants/app.constants';
import {getItem, setItem} from '../../../constants/helper';
import {
  addSubscription,
  getStories,
  isBookMarkExists,
} from '../../../constants/social.helper';
import {
  MainContainer,
  RowView,
} from '../../../infrastructure/theme/global.styles';
import BookmarkCmponent from '../bookmarks/components/bookmark.component';
import {Title} from 'react-native-paper';
import SubscriptionScreen from '../story/screens/subscription.screen';
import QuestionnaireScreen from '../story/screens/questionnaire.screen';
import NetInfo from '@react-native-community/netinfo';
import {openAudioPlayer} from '../../../utils/router_service';

const width = Dimensions.get('screen').width;

const {Readerly} = NativeModules;
const eventEmitter = new NativeEventEmitter(NativeModules.RNEventEmitter);

function SearchScreen(props) {
  const {navigation, route} = props;

  const [playedStory, setPlayedStory] = useState('');
  const [characters, setCharacters] = useState(route.params.characters);
  const [stories, setStories] = useState(route.params.characters);
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchWord, setSearchWord] = useState('');
  const [isSubscriptionScreenVisible, setIsSubscriptionScreenVisible] =
    useState(false);
  const [isQuestionnaireScreenVisible, setIsQuestionnaireScreenVisible] =
    useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const goToStoryReadingScreen = (
    storyTitle,
    isBookmarked,
    isHighlighted,
    isMaleVoiceEnabled,
    storyContent,
  ) => {
    console.log('this is story read function');
    let finalStr =
      'S' +
      ':' +
      storyTitle +
      ':' +
      isBookmarked +
      ':' +
      isHighlighted +
      ':' +
      isMaleVoiceEnabled +
      '$$$' +
      storyContent;
    console.log(finalStr);
    Platform.OS === 'android'
      ? console.log('test')
      : Readerly.openStoryReadingVC(finalStr);
  };

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

  const applySearch = keyword => {
    let refinedList = [];
    let serachedCharacters = [];
    console.log(keyword);
    setLoading(true);
    if (keyword != '') {
      characters.find(obj => {
        if (obj.data.name.includes(keyword)) {
          serachedCharacters.push(obj);
        }
      });
      serachedCharacters.map(character => {
        stories.find(story => {
          if (story.data.character_id == character.id) {
            refinedList.push({
              storyData: story,
              caharacterData: character,
            });
          }
        });
      });
      setList(refinedList);
    } else {
      setList([]);
    }
    setLoading(false);
  };

  const reloadAfterSubscription = () => {
    getSubscriptionStatus();
    applySearch(searchWord);
  };

  useEffect(() => {
    getStories().then(data => {
      let activeStories = data.filter(item => item.data.status === 'active');
      setStories(activeStories);
    });
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getSubscriptionStatus();
      return unsubscribe;
    });
  }, []);

  renderListHeader = useMemo(
    () => (
      <View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <TouchableOpacity
            onPress={() => {
              navigation.pop();
            }}>
            <Image
              source={Images.back}
              style={{
                marginRight: 10,
                tintColor: '#000000',
              }}
            />
          </TouchableOpacity>
          <View
            style={{
              height: 50,
              width: width - 70,
              backgroundColor: 'red',
              borderRadius: 400,
            }}>
            <SearchbarComponent
              placeholder="Search"
              onChangeText={text => {
                setSearchWord(text);
                applySearch(text);
              }}
              value={searchWord}
            />
          </View>
        </View>
        <RowView
          style={{
            justifyContent: 'space-between',
            marginBottom: 30,
          }}>
          <Title>Search Results</Title>
        </RowView>
      </View>
    ),
    [applySearch],
  );

  return (
    <SafeArea>
      <MainContainer>
        {loading && <CustomActivityIndicator animate={loading} />}

        <Spacer position="bottom" size="large" />
        <View>
          <FlatList
            showsVerticalScrollIndicator={false}
            style={styles.list}
            data={list}
            keyExtractor={(item, index) => `${index}`}
            ItemSeparatorComponent={props => {
              return <View style={{height: 20}} />;
            }}
            ListHeaderComponent={renderListHeader}
            renderItem={({item}) => (
              <BookmarkCmponent
                title={item.storyData.data.title}
                imgUrl={item.storyData.data.cover_img_url}
                name={item.caharacterData.data.name}
                ratingVal={item.storyData.data.rating}
                isSubscribed={isSubscribed}
                isFree={item.storyData.data.is_free}
                onPress={async () => {
                  const networkState = await NetInfo.fetch();
                  let isOffline = networkState.isConnected;
                  if (!isOffline) {
                    Alert.alert(
                      'Error',
                      'Please connect your internet to continue, and check if there is anything in your downloads.',
                    );
                  } else {
                    if (!isSubscribed && !item.storyData.data.is_free) {
                      toggleQuestionnaireModal();
                    } else {
                      setLoading(true);
                      setPlayedStory(item);
                      let isHighlight = await getItem(
                        AppConstants.userHighlightPreference,
                      );

                      isBookMarkExists(item.storyData.id).then(
                        bookmarkValue => {
                          setLoading(false);
                          let result = openAudioPlayer(
                            navigation,
                            bookmarkValue,
                            isHighlight,
                            item.storyData,
                            item.caharacterData,
                            false,
                          );
                          if (result === false) {
                            setPlayedStory('');
                          }
                        },
                      );
                    }
                  }
                }}
              />
            )}
          />
        </View>
        <View style={styles.centeredView}>
          <QuestionnaireScreen
            visible={isQuestionnaireScreenVisible}
            onSuccess={() => {
              setIsQuestionnaireScreenVisible(false);
              // setIsSubscriptionScreenVisible(true);
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
              console.log('we are in onSubscriptionSelected');
              setIsSubscriptionScreenVisible(false);
              setItem(AppConstants.isSubscriptionEnabled, true);
              console.log('calling addSubscription from search screen');

              setLoading(true);
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
              console.log('we are in onSubscriptionSelected');
              setIsSubscriptionScreenVisible(false);
              reloadAfterSubscription();
            }}
          />
        </View>
      </MainContainer>
    </SafeArea>
  );
}

export default SearchScreen;
const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
  },
  list: {
    flexDirection: 'column',
    height: '100%',
    backgroundColor: '#F6F4F0',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
