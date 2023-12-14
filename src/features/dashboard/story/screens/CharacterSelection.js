/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';

import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import styled from 'styled-components';
import {SafeArea} from '../../../../components/utility/safe-area.component';
import {ToolBar} from '../../../../components/utility/Toolbar';
import {AppConstants, Images} from '../../../../constants/app.constants';
import {colors} from '../../../../infrastructure/theme/colors';
import {fonts} from '../../../../infrastructure/theme/fonts';
import {
  addSubscription,
  getAgeGroups,
  getStoriesByCharacterID,
  isBookMarkExists,
} from '../../../../constants/social.helper';
import CustomActivityIndicator from '../../../../components/utility/activity.indicator.component';
import {getItem, setItem} from '../../../../constants/helper';
import SubscriptionScreen from './subscription.screen';
import QuestionnaireScreen from './questionnaire.screen';
import PurpleAgeGroupButton from '../../../../components/utility/purple.agegroup.button';
import {Spacer} from '../../../../components/spacer/spacer.component';
import FastImage from 'react-native-fast-image';
import RecommendedStoryComponent from '../../Home/components/recommended.story.component';
import NetInfo from '@react-native-community/netinfo';
import {openAudioPlayer} from '../../../../utils/router_service';

const Title = styled(Text)`
  font-size: 20px;
  font-family: ${props => props.theme.fonts.Poppins_Regular};
  font-weight: 600;
`;

export const CharacterSelection = ({navigation, route}) => {
  const [selection, setSelection] = useState(-1);
  const [ageGroupId, setAgeGroupId] = useState(route.params.ageGroupId);
  const [playedStory, setPlayedStory] = useState('');
  const [lisData, setListData] = useState([]);
  const [filteredStories, setFilteredStories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isSubscriptionScreenVisible, setIsSubscriptionScreenVisible] =
    useState(false);
  const [isQuestionnaireScreenVisible, setIsQuestionnaireScreenVisible] =
    useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [opacity, setOpacity] = useState(0);
  const [ageGroupIndex, setAgeGroupIndex] = useState(-1);
  const [ageGroup, setAgeGroup] = useState([]);

  const toggleSubscripionModal = () => {
    setIsSubscriptionScreenVisible(!isSubscriptionScreenVisible);
  };

  const toggleQuestionnaireModal = () => {
    setIsQuestionnaireScreenVisible(!isQuestionnaireScreenVisible);
  };

  useEffect(() => {
    reloadScreen();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setSelection(-1);
      getSubscriptionStatus();
      console.log('In Navigation Useeffect of Character selection screen');
      return unsubscribe;
    });
  }, []);

  useEffect(() => {
    getAgeGroups().then(data => {
      setAgeGroup(data);
    });
  }, []);

  useEffect(() => {
    if (ageGroupIndex !== -1) {
      getAgeGroupStories(ifAgeGroupExists(ageGroupIndex + 1).id);
    } else {
      setFilteredStories(lisData);
    }
  }, [ageGroupIndex]);

  const reloadScreen = () => {
    console.log('in reload screen');
    getSubscriptionStatus();
    setLoading(true);

    getStoriesByCharacterID(route.params.characterData.id).then(data => {
      var updatedList = [];
      if (ageGroupId === -1) {
        updatedList = data;
      } else {
        updatedList = data.filter(
          item => item.data.age_group_id === ageGroupId,
        );
      }
      setListData(updatedList);

      setFilteredStories(updatedList);
      setLoading(false);
    });
  };

  const getSubscriptionStatus = async () => {
    let isSubscription = await getItem(AppConstants.isSubscriptionEnabled);
    setIsSubscribed(isSubscription);
  };

  const ifAgeGroupExists = index => {
    let obj;
    if (ageGroup.length >= index) {
      obj = ageGroup.find(obj => {
        if (obj.data.preference == index) {
          return obj.data.name;
        }
      });
      return obj;
    } else {
      return {
        id: '',
        data: {name: ''},
      };
    }
  };

  const getAgeGroupStories = id => {
    if (ageGroupIndex === -1) {
      setFilteredStories(lisData);
    } else {
      var arr = lisData;
      arr = arr.filter(obj => obj.data.age_group_id.replace(' ', '') === id);
      setFilteredStories(arr);
    }
  };

  return (
    <SafeArea style={{backgroundColor: '#F6F4F0'}}>
      <View>
        <ToolBar
          showLeftIcon={true}
          leftIcon={Images.back}
          showRightIcon={false}
          rightIcon={Images.setting}
          heading="Choose your story"
          onLeftPressed={() => {
            navigation.pop();
          }}
          onRightPressed={() => {}}
        />
      </View>
      {loading && <CustomActivityIndicator animate={loading} />}

      <View style={styles.buttonContainer}>
        <PurpleAgeGroupButton
          title={ifAgeGroupExists(1).data.name + ' years'}
          width={'32%'}
          height={40}
          isSelected={ageGroupIndex === 0 ? true : false}
          onPressed={() => {
            if (ageGroupIndex === 0) {
              setAgeGroupIndex(-1);
            } else {
              setAgeGroupIndex(0);
            }
          }}
        />
        <Spacer position="right" size="medium" />

        <PurpleAgeGroupButton
          title={ifAgeGroupExists(2).data.name + ' years'}
          width={'32%'}
          height={40}
          isSelected={ageGroupIndex === 1 ? true : false}
          onPressed={() => {
            if (ageGroupIndex === 1) {
              setAgeGroupIndex(-1);
            } else {
              setAgeGroupIndex(1);
            }
          }}
        />
        <Spacer position="right" size="medium" />
        <PurpleAgeGroupButton
          title={ifAgeGroupExists(3).data.name + ' years'}
          width={'32%'}
          height={40}
          isSelected={ageGroupIndex === 2 ? true : false}
          onPressed={() => {
            if (ageGroupIndex === 2) {
              setAgeGroupIndex(-1);
            } else {
              setAgeGroupIndex(2);
            }
          }}
        />
      </View>
      <View style={styles.topContainer}>
        <View
          style={{
            height: 40,
            paddingTop: 10,
            paddingLeft: 20,
            paddingRight: 20,
            paddingBottom: 0,
          }}>
          <Text
            style={{
              textAlign: 'center',
              color: colors.ui.purple,
              fontWeight: '700',
              fontSize: 20,
              fontFamily: fonts.Poppins_Regular,
            }}>
            {route.params.characterData.data.name}
          </Text>
        </View>
        <FastImage
          style={[
            {
              width: '100%',
              height: 200,
              borderRadius: 15,
              resizeMode: Platform.OS === 'ios' ? 'cover' : 'cover',
            },
          ]}
          onLoadStart={() => {
            setOpacity(1);
          }}
          onLoad={() => {
            setOpacity(0);
          }}
          resizeMode={'contain'}
          source={{
            uri: route.params.characterData.data.half_animation_url,
            // priority: FastImage.priority.normal,
            // cache: FastImage.cacheControl.cacheOnly,
          }}
        />
        <View
          style={{
            height: 40,
            marginTop: 20,
            paddingLeft: 20,
            paddingRight: 20,
            paddingBottom: 0,
          }}>
          <Text
            numberOfLines={2}
            adjustsFontSizeToFit
            style={{
              textAlign: 'center',
              flex: 1,
              fontFamily: fonts.Poppins_Regular,
              fontSize: 12,
            }}>
            {route.params.characterData.data.description}
          </Text>
        </View>
        <ActivityIndicator
          animating
          size="large"
          color={colors.ui.purple}
          style={[styles.activityIndicator, {opacity: opacity}]}
        />
      </View>
      <View
        style={{padding: 15, justifyContent: 'center', alignItems: 'center'}}>
        <Title style={{textAlign: 'center'}}>
          Select the story you like from {'\n'}this character
        </Title>
      </View>

      <FlatList
        style={{margin: 20, marginTop: 10}}
        data={filteredStories}
        renderItem={({item, index}) => {
          return (
            <RecommendedStoryComponent
              item={item}
              isSubscribed={isSubscribed}
              selection={selection}
              index={index}
              onPress={async () => {
                console.log('story cell pressed');
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
                    setPlayedStory(item);
                    let isHighlight = await getItem(
                      AppConstants.userHighlightPreference,
                    );

                    isBookMarkExists(item.id).then(bookmarkValue => {
                      setLoading(false);
                      let result = openAudioPlayer(
                        navigation,
                        bookmarkValue,
                        isHighlight,
                        item,
                        route.params.characterData,
                        false,
                      );
                      if (result === false) {
                        setSelection(-1);
                        setPlayedStory('');
                      }
                    });
                  }
                }
              }}
            />
          );
        }}
        keyExtractor={(item, index) => `${index}`}
      />
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
            console.log('we are in onSubscriptionSelected');
            setIsSubscriptionScreenVisible(false);
            setItem(AppConstants.isSubscriptionEnabled, true);

            console.log(
              'calling addSubscription from character selection screen',
            );

            await addSubscription(
              productId,
              transactionDateTimeStamp,
              deviceType,
              subscriptionType,
              price,
              transactionReceipt,
            ).then(data => {
              console.log('added subscription to DB ===========', data);
            });
            getSubscriptionStatus();
            reloadScreen();
          }}
          onCancelTapped={() => {
            console.log('we are in onSubscriptionSelected');
            setIsSubscriptionScreenVisible(false);
            getSubscriptionStatus();
            reloadScreen();
          }}
        />
      </View>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    marginTop: 10,
    marginHorizontal: 20,
    backgroundColor: '#EDE3FF',
    borderRadius: 14,
    height: 300,
  },
  btnGroup: {
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '90%',
  },
  btn: {
    borderWidth: 1,
    borderColor: colors.ui.white,
    borderRadius: 16,
    marginBottom: 10,
    backgroundColor: 'white',
    height: 90,
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
  NonSubscribedBtnText: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.ui.gray,
    fontFamily: fonts.Poppins_Regular,
    fontWeight: '500',
    opacity: 0.5,
    marginLeft: 20,
    alignSelf: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIndicator: {
    position: 'absolute',
    top: 70,
    left: 70,
    right: 70,
    bottom: 70,
  },
  buttonContainer: {
    width: '90%',
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
