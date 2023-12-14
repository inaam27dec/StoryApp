import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useEffect, useState} from 'react';
import {Text} from 'react-native';
import {StyleSheet, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import CustomActivityIndicator from '../../../../components/utility/activity.indicator.component';
import {SafeArea} from '../../../../components/utility/safe-area.component';
import {ToolBar} from '../../../../components/utility/Toolbar';
import {Images} from '../../../../constants/app.constants';
import {
  getLeaderBoardByUserID,
  getUserFromDatabase,
} from '../../../../constants/social.helper';
import {colors} from '../../../../infrastructure/theme/colors';
import {fonts} from '../../../../infrastructure/theme/fonts';
import {MainContainer} from '../../../../infrastructure/theme/global.styles';
import {
  addLeaderboardrack,
  getTrackPlayerQueue,
  resetTrackPlayer,
  setupPlayer,
} from '../../../../utils/trackPlayerServices';
import LeaderboardComponent from '../components/leaderboard.component';
import {showAlert} from '../../../../constants/helper';

function LeaderboardScreen(props) {
  const {navigation} = props;
  const [list, setList] = useState([]);
  const [userData, setUserData] = useState('');
  const [loading, setLoading] = useState(false);
  const [childName, setChildName] = useState('');

  useEffect(() => {
    setLoading(true);
    getLeaderBoardByUserID().then(data => {
      setLoading(false);
      setList(data);
    });

    return async () => {};
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getUseData();
      return unsubscribe;
    });
  }, []);

  const getUseData = () => {
    getUserFromDatabase().then(data => {
      setLoading(false);
      setUserData(data);
      setChildName(data.child_name ?? '');
    });
  };

  useFocusEffect(
    useCallback(() => {
      if (list.length !== 0) {
        setup();
      }
      return async () => {
        resetPlayer();
      };
    }, [list]),
  );

  async function resetPlayer() {
    resetTrackPlayer();
  }

  async function setup() {
    await resetPlayer();
    let isSetup = await setupPlayer();

    const queue = await getTrackPlayerQueue();
    if (isSetup) {
      await addLeaderboardrack(queue.length);
    }
  }

  return (
    <SafeArea>
      {loading && <CustomActivityIndicator animate={loading} />}
      <ToolBar
        heading="Leaderboard"
        showLeftIcon={true}
        leftIcon={Images.back}
        onLeftPressed={() => {
          navigation.popToTop();
        }}
        showRightIcon={false}
        rightIcon={Images.bell}
        onRightPressed={() => {}}
      />
      <MainContainer style={{flex: 1}}>
        <View style={styles.listContainer}>
          {list.length == 0 ? (
            <View style={styles.noLblContainer}>
              <Text style={styles.noLbl}>No Record Found</Text>
            </View>
          ) : (
            <FlatList
              style={{flexDirection: 'column'}}
              data={list}
              keyExtractor={item => item.id}
              ItemSeparatorComponent={props => {
                return <View style={{height: 20}} />;
              }}
              renderItem={({item, index}) => (
                <LeaderboardComponent
                  item={item}
                  i={index}
                  onPress={() => {
                    if (childName === '') {
                      showAlert(
                        'Readrly',
                        'Please add your child Name in the Profile Section to continue',
                        'Open Profile',
                        (onPressed = () => {
                          if (userData !== '') {
                            navigation.navigate('EditProfileScreen', {
                              userData: userData,
                            });
                          } else {
                            // Alert.alert(
                            //   'Readrly',
                            //   'Something went wrong, please try later',
                            // );
                          }
                        }),
                      );
                    } else {
                      resetPlayer();
                      navigation.push('Certificate', {
                        leaderboardDetails: item,
                        name: childName,
                      });
                    }
                  }}
                />
              )}
            />
          )}
        </View>
      </MainContainer>
    </SafeArea>
  );
}

export default LeaderboardScreen;

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
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
