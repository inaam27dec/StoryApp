/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler/lib/commonjs/components/GestureComponents';
import imagePath from '../../../../constants/imagePath';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  SafeAreaView,
  TextInput,
  Image,
  Alert,
  Platform,
} from 'react-native';
import ButtonComp from '../components/ButtonComp';
import navigationStrings from '../../../../constants/navigationStrings';
import {fonts} from '../../../../infrastructure/theme/fonts';
import {colors} from '../../../../infrastructure/theme/colors';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth, {firebase} from '@react-native-firebase/auth';
import {
  GoogleLogin,
  addUserToDatabase,
  AppleLogin,
  fbLogin,
  addFCMToken,
  getUserInfoFromFirebase,
} from '../../../../constants/social.helper';
import dbConstants from '../../../../constants/dbConstants';
import {AppConstants} from '../../../../constants/app.constants';
import {removeSpaces, setItem} from '../../../../constants/helper';
import CustomActivityIndicator from '../../../../components/utility/activity.indicator.component';
import {AccessToken, LoginManager} from 'react-native-fbsdk';

export const SigInScreen = props => {
  const {navigation} = props;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hidePassword, setHidePassword] = useState(true);
  const [isLoading, setLoading] = useState(false);
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '306852333522-23dc94rciqumn9q2oov0qgo6kevn1csp.apps.googleusercontent.com',
    });
  }, []);

  const onPress = () => setHidePassword(!hidePassword);

  const btnActionSignup = () => {
    navigation.push(navigationStrings.SIGNUP);
  };

  const btnActionForgotPassword = () => {
    navigation.push(navigationStrings.FORGET_PASSWORD);
  };

  const btnActionLogin = () => {
    if (!email || removeSpaces(email) === '') {
      Alert.alert('Readrly', 'Please enter your email');
      return;
    }
    if (!password || removeSpaces(password) === '') {
      Alert.alert('Readrly', 'Please enter your password');
      return;
    }
    setLoading(true);
    singInWithFirebase(email, password);
  };

  const loginFlow = user => {
    // if (email.toLowerCase() === 'admin@admin.com' && password === '1234567') {
    setItem(AppConstants.isUserLogin, true);
    if (
      user.userType !== undefined &&
      user.userType !== null &&
      user.userType === 'admin'
    ) {
      console.log('admin login');
      setItem(AppConstants.isAdminLogin, true);
      navigation.replace(navigationStrings.ADMIN_STACK);
    } else {
      console.log('simple login');
      setItem(AppConstants.isAdminLogin, false);
      navigation.replace(navigationStrings.DASHBOARD);
    }
  };

  const singInWithFirebase = async (email, password) => {
    try {
      let response = await auth().signInWithEmailAndPassword(email, password);
      let userObject = await getUserInfoFromFirebase(response.user.uid);

      if (userObject.userType === undefined || userObject.userType === null) {
        let responseFCM = await addFCMToken(response.user.uid, '');
        console.log('response FCM = ', responseFCM);
      }
      setLoading(false);
      if (response && response.user) {
        setItem(AppConstants.userID, response.user.uid);
        loginFlow(userObject);
      }
    } catch (e) {
      setLoading(false);
      console.error(e.message);
      Alert.alert('Readrly', e.message);
    }
  };

  btnActionGoogleLogin = async () => {
    console.log('Inside Google Login');
    setLoading(true);
    let obj = await GoogleLogin();
    if (obj == 0) {
      setLoading(false);
    } else {
      let user = (await obj).firebaseCred.user;

      let response = await addUserToDatabase(
        user.uid,
        user.displayName,
        user.email,
        (
          await obj
        ).password,
        '',
        user.photoURL,
        dbConstants.GOOGLE,
      );
      let responseFCM = await addFCMToken(user.uid, '');
      console.log('response FCM = ', responseFCM);

      setLoading(false);
      if (response === 'success') {
        await setItem(AppConstants.isUserLogin, true);
        navigation.replace(navigationStrings.DASHBOARD);
      } else {
        Alert.alert('Readrly', 'Oops! an error occured');
      }
    }
  };

  btnActionApple = async () => {
    let obj = AppleLogin();
    let user = (await obj).firebaseCred.user;
    setLoading(true);
    let response = await addUserToDatabase(
      user.uid,
      user.displayName,
      user.email,
      (
        await obj
      ).password,
      '',
      user.photoURL,
      dbConstants.APPLE,
    );

    let responseFCM = await addFCMToken(user.uid);
    console.log('response FCM = ', responseFCM);
    setLoading(false);
    if (response === 'success') {
      await setItem(AppConstants.isUserLogin, true);
      navigation.replace(navigationStrings.DASHBOARD);
    } else {
      Alert.alert('Readrly', 'Oops! an error occured');
    }
  };

  // btnActionFB = async () => {
  //   try {
  //     await fbLogin(_responseInfoCallBack);
  //   } catch (error) {
  //     console.log('error raised', error);
  //   }
  // };

  // _responseInfoCallBack = async (error, result) => {
  //   if (error) {
  //     console.log('error top', error);
  //     return;
  //   } else {
  //     const userData = result;
  //     console.log('fb data+++++++', userData);
  //   }
  // };

  getInfoFromToken = token => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: 'id,name,first_name,last_name',
      },
    };
    const profileRequest = new GraphRequest(
      '/me',
      {token, parameters: PROFILE_REQUEST_PARAMS},
      (error, user) => {
        if (error) {
          console.log('login info has error: ' + error);
        } else {
          console.log('result:', user);
        }
      },
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  loginWithFacebook = () => {
    // Attempt a login using the Facebook login dialog asking for default permissions.
    LoginManager.logInWithPermissions(['public_profile']).then(
      login => {
        if (login.isCancelled) {
          console.log('Login cancelled');
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            const accessToken = data.accessToken.toString();
            getInfoFromToken(accessToken);
          });
        }
      },
      error => {
        console.log('Login fail with error: ' + error);
      },
    );
  };

  return (
    <SafeAreaView style={{backgroundColor: '#F6F4F0', flex: 1}}>
      <ScrollView>
        <View>
          <CustomActivityIndicator animate={isLoading} />
          <View style={{height: '25%'}}>
            <Image
              source={imagePath.ball}
              style={{
                height: 125,
                width: 125,
                justifyContent: 'center',
                alignSelf: 'center',
                marginTop: 30,
              }}
            />
            <Image style={styles.imgSplash1} source={imagePath.paw2} />
          </View>

          <Text style={styles.welcomeText}>Sign In</Text>
          <View style={styles.viewFullName}>
            <Text style={styles.textFullName}>Email</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Enter email"
              onChangeText={text => {
                setEmail(text);
              }}
            />
          </View>

          <View style={styles.viewFullName}>
            <Text style={styles.textFullName}>Enter Password</Text>
            <View style={styles.sectionStyle}>
              <TextInput
                style={{flex: 1}}
                placeholder="Enter password"
                secureTextEntry={hidePassword}
                onChangeText={text => {
                  setPassword(text);
                  console.log(password);
                }}
              />
              <TouchableOpacity onPress={onPress}>
                <Image source={imagePath.eye} style={styles.imageStyle} />
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={btnActionForgotPassword}>
            <Text style={styles.textForgetPassword}>Forget Password ?</Text>
          </TouchableOpacity>

          <ButtonComp
            btnText="Sign in"
            btnStyle={styles.btnStyle}
            onPress={btnActionLogin}
          />
          <View>
            <Text style={styles.txtSignupUsing}> Or sign in using </Text>
            <View style={styles.viewSignupMethods}>
              <TouchableOpacity onPress={btnActionGoogleLogin}>
                <Image
                  source={imagePath.google}
                  style={(styles.imgSignupMethod, {height: 59, width: 59})}
                />
              </TouchableOpacity>
              <View>
                {Platform.OS === 'ios' && (
                  <TouchableOpacity onPress={btnActionApple}>
                    <Image
                      source={imagePath.apple}
                      style={styles.imgSignupMethod}
                    />
                  </TouchableOpacity>
                )}
              </View>

              {/* <TouchableOpacity onPress={loginWithFacebook}>
                <Image
                  source={imagePath.facebook}
                  style={styles.imgSignupMethod}
                />
              </TouchableOpacity> */}
            </View>
            <View style={styles.viewDontHaveAnAccount}>
              <Text style={styles.txtDontHaveAnAccount}>
                Dont have an account?
              </Text>
              <TouchableOpacity onPress={btnActionSignup}>
                <Text
                  style={{...styles.txtDontHaveAnAccount, ...styles.txtSignUp}}>
                  Sign up
                </Text>
              </TouchableOpacity>
            </View>
            <Image style={styles.imgSplash2} source={imagePath.paw1} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  headingText: {
    fontSize: 64,
    fontWeight: '400',
    marginTop: 20,
    textAlign: 'center',
    color: '#272443',
    fontFamily: fonts.suez_one,
  },
  titleText: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: '400',
    color: '#272443',
    marginTop: 10,
    fontFamily: fonts.Poppins_Regular,
  },
  welcomeText: {
    fontSize: 30,
    textAlign: 'center',
    color: colors.ui.black,
    fontWeight: '700',
    marginTop: 30,
    fontFamily: fonts.Poppins_Regular,
  },
  viewFullName: {
    flexDirection: 'column',
    marginTop: 15,
    marginLeft: 20,
    marginRight: 20,
  },
  textFullName: {
    fontSize: 12,
    fontWeight: '400',
    color: '#ABABAB',
    fontFamily: fonts.Poppins_Regular,
  },
  textInput: {
    height: 50,
    borderRadius: 38,
    borderColor: colors.ui.borderColor,
    borderWidth: 1,
    padding: 10,
    marginTop: 7,
  },
  sectionStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 38,
    borderColor: colors.ui.borderColor,
    borderWidth: 1,
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 7,
  },
  imageStyle: {
    padding: 10,
    margin: 0,
    height: 16,
    width: 22,
    resizeMode: 'stretch',
    alignItems: 'center',
  },
  textForgetPassword: {
    marginRight: 20,
    marginTop: 8,
    color: colors.ui.black,
    fontSize: 12,
    fontWeight: '400',
    textAlign: 'right',
    fontFamily: fonts.Poppins_Regular,
  },
  btnStyle: {
    marginTop: 26,
    marginLeft: 20,
    marginRight: 20,
  },
  txtSignupUsing: {
    marginTop: 22,
    marginBottom: 19,
    textAlign: 'center',
    color: colors.ui.black,
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 24,
    fontFamily: fonts.Poppins_Regular,
  },
  viewSignupMethods: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imgSignupMethod: {
    height: 50,
    width: 50,
    marginLeft: 20,
  },
  viewDontHaveAnAccount: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 14,
    marginBottom: 40,
  },
  txtDontHaveAnAccount: {
    color: colors.ui.darkGray,
    lineHeight: 20,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: fonts.Poppins_Regular,
  },
  txtSignUp: {
    color: colors.ui.black,
    fontWeight: '700',
    paddingLeft: 3,
    fontSize: 14,
    fontFamily: fonts.Poppins_Regular,
  },
  imgSplash1: {
    alignSelf: 'flex-end',
    marginTop: 0,
    marginRight: -10,
    height: 50,
    width: 50,
    resizeMode: 'contain',
    tintColor: 'rgba(136, 88, 237, 0.1)',
  },
  imgSplash2: {
    alignSelf: 'flex-start',
    height: 80,
    width: 90,
    resizeMode: 'contain',
    left: '-4.53%',
    bottom: '30%',
  },
});
