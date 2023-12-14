import React, {useEffect, useState} from 'react';
import {Image, TouchableOpacity, View, StyleSheet, Alert} from 'react-native';
import {firebase} from '@react-native-firebase/auth';
import {ScrollView} from 'react-native-gesture-handler';
import {Spacer} from '../../../../components/spacer/spacer.component';
import PurpleButton from '../../../../components/utility/PurpleButton.component';
import {SafeArea} from '../../../../components/utility/safe-area.component';
import {Images, WebURLS} from '../../../../constants/app.constants';

import {
  GrayLabel,
  MainContainer,
  RowViews,
  TopHeading,
} from '../../../../infrastructure/theme/global.styles';
import ProfileComponent from '../components/profile.component';
import imagePath from '../../../../constants/imagePath';
import CustomActivityIndicator from '../../../../components/utility/activity.indicator.component';
import {
  deleteAccount,
  deleteAppleAccount,
  deleteGoogleAccount,
  getUserFromDatabase,
  removeFCMToken,
} from '../../../../constants/social.helper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  clearAsyncStorage,
  logoutOnAccountDeleteNotification,
} from '../../../../constants/helper';
import navigationStrings from '../../../../constants/navigationStrings';

function ProfileScreen(props) {
  const {navigation} = props;
  const [userData, setUserData] = useState('');
  const [profilePic, setProfilePic] = useState('');
  const [userName, setUserName] = useState('');
  const [childName, setChildName] = useState('');
  const [isLoading, setLoading] = useState(false);

  const list = [
    {
      icon: Images.leaderboard,
      text: 'Leaderboard',
      size: 17,
    },
    {
      icon: Images.setting_purple,
      text: 'Settings',
      size: 17,
    },
    {
      icon: Images.termsCondition,
      text: 'Terms Of Use',
      size: 18,
    },
    {
      icon: Images.privacyPolicy,
      text: 'Privacy Policy',
      size: 18,
    },
    {
      icon: Images.log_out,
      text: 'Log out',
      size: 12,
    },
    {
      icon: Images.trashIcon,
      text: 'Delete Account',
      size: 17,
    },
    // {
    //   icon: null,
    //   text: 'Version: 2,   Build: 8',
    //   size: 12,
    // },
  ];
  const itemTapped = index => {
    switch (index) {
      case 0:
        navigation.push('Leaderboard');
        break;
      case 1:
        navigation.push('GeneraSettingScreen');
        break;
      case 2:
        navigation.push(navigationStrings.WEBVIEW_SCREEN, {
          title: 'Terms of Service',
          url: WebURLS.termsOfUse,
        });
        break;
      case 3:
        navigation.push(navigationStrings.WEBVIEW_SCREEN, {
          title: 'Privacy Policy',
          url: WebURLS.privacyPolicy,
        });
        break;
      case 4:
        Alert.alert('Logout', 'Are you sure you want to logout?', [
          {
            text: 'Cancel',
            onPress: () => null,
          },
          {
            text: 'OK',
            onPress: async () => {
              setLoading(true);
              let responseFCM = await removeFCMToken();
              console.log('response FCM = ', responseFCM);
              setLoading(false);
              if (responseFCM === 'success') {
                firebase.auth().signOut();
                navigation.replace('Auth');
                await clearAsyncStorage();
              } else {
                Alert.alert('Readrly', 'Oops! an error occured');
              }
            },
          },
        ]);
        break;
      case 5:
        Alert.alert(
          'Delete Account?',
          'You would not be able to login and use this app. \n Are you sure you want to delete your account?',
          [
            {
              text: 'NO',
              onPress: () => null,
            },
            {
              text: 'YES',
              style: 'destructive',
              onPress: async () => {
                setLoading(true);
                getUserFromDatabase()
                  .then(data => {
                    deleteAccountFromFirebase(
                      data.email_address,
                      data.password,
                      data.login_method,
                    );
                  })
                  .catch(e => {
                    console.log('error in getting user from firebase', e);
                  });
              },
            },
          ],
        );
        break;
      default:
        break;
    }
  };

  const deleteAccountFromFirebase = async (email, password, loginMethod) => {
    var response = '';
    if (loginMethod === 'google') {
      response = await deleteGoogleAccount(email, password);
    } else if (loginMethod === 'apple') {
      response = await deleteAppleAccount(email, password);
    } else if (loginMethod === 'simple_login') {
      response = await deleteAccount(email, password);
    }
    if (response === 'success') {
      setLoading(false);
      Alert.alert(
        'Success',
        'Your account and all your data linked to this account is deleted successfully',
        [
          {
            text: 'OK',
            onPress: () => {
              firebase.auth().signOut();
              navigation.replace('Auth');
              clearAsyncStorage();
            },
          },
        ],
      );
    } else {
      setLoading(false);
      Alert.alert('Error', response);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      getUserFromDatabase().then(data => {
        setLoading(false);
        if (data === undefined) {
          logoutOnAccountDeleteNotification(navigation);
        } else {
          setUserData(data ?? '');
          if (data != null) {
            AsyncStorage.setItem('profileImage', data.profile_pic ?? '');
            setProfilePic(data.profile_pic ?? '');
            setUserName(data.name ?? '');
            setChildName(data.child_name ?? '');
          }
        }
      });
      return unsubscribe;
    });
  }, []);

  return (
    <SafeArea>
      <MainContainer>
        <ScrollView>
          <CustomActivityIndicator animate={isLoading} />
          <RowViews style={{justifyContent: 'center'}}>
            <TopHeading>Profile</TopHeading>
          </RowViews>
          <Spacer position="bottom" size="large" />
          <View style={styles.photoContainer}>
            <Image
              style={styles.photo}
              source={
                profilePic === ''
                  ? imagePath.profilePlaceHolder
                  : {uri: profilePic}
              }
            />
            <View style={{height: 23}} />
          </View>
          <Spacer position="bottom" size="veryLarge" />
          <View style={{alignItems: 'center'}}>
            <TopHeading>{userName === '' ? '-' : userName}</TopHeading>
            <GrayLabel>
              {childName === '' ? 'Child : -' : 'Child : ' + childName}
            </GrayLabel>
            <View style={{height: 23}} />
            <PurpleButton
              title="Edit Profile"
              width={176}
              padding={12}
              onPressed={() => {
                if (userData !== '') {
                  navigation.navigate('EditProfileScreen', {
                    userData: userData,
                  });
                } else {
                  Alert.alert(
                    'Readrly',
                    'Something went wrong, please try later',
                  );
                }
              }}
            />
          </View>
          <Spacer position="bottom" size="veryLarge" />
          <View style={styles.listContainer}>
            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => {
                itemTapped(0);
              }}>
              <ProfileComponent
                title={list[0].text}
                img={list[0].icon}
                size={list[0].size}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => {
                itemTapped(1);
              }}>
              <ProfileComponent
                title={list[1].text}
                img={list[1].icon}
                size={list[1].size}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => {
                itemTapped(2);
              }}>
              <ProfileComponent
                title={list[2].text}
                img={list[2].icon}
                size={list[2].size}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => {
                itemTapped(3);
              }}>
              <ProfileComponent
                title={list[3].text}
                img={list[3].icon}
                size={list[3].size}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => {
                itemTapped(4);
              }}>
              <ProfileComponent
                title={list[4].text}
                img={list[4].icon}
                size={list[4].size}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{flex: 1}}
              onPress={() => {
                itemTapped(5);
              }}>
              <ProfileComponent
                title={list[5].text}
                img={list[5].icon}
                size={list[5].size}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </MainContainer>
    </SafeArea>
  );
}

export default ProfileScreen;

const styles = StyleSheet.create({
  photoContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    width: 150,
    height: 150,
    marginTop: 30,
    borderWidth: 3,
    borderRadius: 300,
    padding: 10,
    borderColor: '#D9C9F9',
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 75,
  },
  listContainer: {
    flex: 1,
    height: 300,
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    padding: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
});
