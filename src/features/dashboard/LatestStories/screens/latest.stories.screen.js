import React, {useEffect, useState} from 'react';
import {Alert, FlatList, StyleSheet, View} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import RecommendedStoryComponent from '../../Home/components/recommended.story.component';
import {AppConstants} from '../../../../constants/app.constants';
import {
  MainContainer,
  RowView,
  TopHeading,
} from '../../../../infrastructure/theme/global.styles';
import SubscriptionScreen from '../../story/screens/subscription.screen';
import QuestionnaireScreen from '../../story/screens/questionnaire.screen';
import {getItem, setItem} from '../../../../constants/helper';
import {
  addSubscription,
  getCharacterByID,
  getLatestStories,
  isBookMarkExists,
} from '../../../../constants/social.helper';
import CustomActivityIndicator from '../../../../components/utility/activity.indicator.component';
import {SafeArea} from '../../../../components/utility/safe-area.component';
import {Spacer} from '../../../../components/spacer/spacer.component';
import {Text} from 'react-native';
import {fonts} from '../../../../infrastructure/theme/fonts';
import {colors} from '../../../../infrastructure/theme/colors';
import {openAudioPlayer} from '../../../../utils/router_service';

function LatestStoriesScreen(props) {
  const {navigation} = props;

  const [filteredStories, setFilteredStories] = useState([]);

  const [loading, setLoading] = useState(false);
  const [isSubscriptionScreenVisible, setIsSubscriptionScreenVisible] =
    useState(false);
  const [isQuestionnaireScreenVisible, setIsQuestionnaireScreenVisible] =
    useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    console.log('inside latest stories useEffect');
    reloadScreen();
  }, []);

  const reloadScreen = () => {
    getSubscriptionStatus();
    setLoading(true);

    getLatestStories().then(data => {
      setFilteredStories(data);
      setLoading(false);
    });
  };

  const getSubscriptionStatus = async () => {
    let isSubscription = await getItem(AppConstants.isSubscriptionEnabled);
    setIsSubscribed(isSubscription);
  };

  const toggleSubscripionModal = () => {
    setIsSubscriptionScreenVisible(!isSubscriptionScreenVisible);
  };

  const toggleQuestionnaireModal = () => {
    setIsQuestionnaireScreenVisible(!isQuestionnaireScreenVisible);
  };

  return (
    <SafeArea>
      <MainContainer>
        {loading && <CustomActivityIndicator animate={loading} />}
        <RowView
          style={{justifyContent: 'space-between', alignItems: 'center'}}>
          <TopHeading>Latest Stories</TopHeading>
        </RowView>
        <Spacer position="bottom" size="large" />
        <View style={{height: '94%'}}>
          {filteredStories.length == 0 ? (
            <View style={styles.noLblContainer}>
              <Text style={styles.noLbl}>No Latest Stories Found</Text>
            </View>
          ) : (
            <FlatList
              data={filteredStories}
              renderItem={({item, index}) => {
                return (
                  <RecommendedStoryComponent
                    item={item}
                    isSubscribed={isSubscribed}
                    selection={false}
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
                          let isHighlight = await getItem(
                            AppConstants.userHighlightPreference,
                          );

                          isBookMarkExists(item.id)
                            .then(bookmarkValue => {
                              getCharacterByID(item.data.character_id)
                                .then(data => {
                                  setLoading(false);
                                  let result = openAudioPlayer(
                                    navigation,
                                    bookmarkValue,
                                    isHighlight,
                                    item,
                                    data,
                                    false,
                                  );
                                })
                                .catch(error => {
                                  setLoading(false);
                                });
                            })
                            .catch(error => {
                              setLoading(false);
                            });
                        }
                      }
                    }}
                  />
                );
              }}
              keyExtractor={(item, index) => `${index}`}
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

              console.log('calling addSubscription from latest stories screen');
              await addSubscription(
                productId,
                transactionDateTimeStamp,
                deviceType,
                subscriptionType,
                price,
                transactionReceipt,
              ).then(data => {});
              getSubscriptionStatus();
              reloadScreen();
            }}
            onCancelTapped={() => {
              setIsSubscriptionScreenVisible(false);
              getSubscriptionStatus();
              reloadScreen();
            }}
          />
        </View>
      </MainContainer>
    </SafeArea>
  );
}

export default LatestStoriesScreen;

const styles = StyleSheet.create({
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
