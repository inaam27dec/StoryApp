/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {ScrollView} from 'react-native-gesture-handler/lib/commonjs/components/GestureComponents';
import imagePath from '../../../../constants/imagePath';
import Moment from 'moment';

import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import ButtonComp from '../components/ButtonComp';
import {fonts} from '../../../../infrastructure/theme/fonts';
import {colors} from '../../../../infrastructure/theme/colors';
import {
  AppConstants,
  EMAIL_REGEX,
  Images,
  WebURLS,
} from '../../../../constants/app.constants';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import auth, {firebase} from '@react-native-firebase/auth';
import {
  GoogleLogin,
  addUserToDatabase,
  AppleLogin,
  fbLogin,
  addFCMToken,
} from '../../../../constants/social.helper';
import dbConstants from '../../../../constants/dbConstants';
import navigationStrings from '../../../../constants/navigationStrings';
import DatePickerComponent from '../../../../components/utility/date.picker.component';
import {Spacer} from '../../../../components/spacer/spacer.component';
import DOBComponent from '../../../../components/utility/dob.component';
import {SafeArea} from '../../../../components/utility/safe-area.component';
import CustomActivityIndicator from '../../../../components/utility/activity.indicator.component';
import {LoginManager} from 'react-native-fbsdk';
import {removeSpaces, setItem} from '../../../../constants/helper';

export const SignupScreen = props => {
  const {navigation} = props;
  const [hidePassword, setHidePassword] = useState(true);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDOB] = useState('');
  const [date, setDate] = useState(new Date());
  const [isLoading, setLoading] = useState(false);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const toggleModal = () => {
    setIsDatePickerVisible(!isDatePickerVisible);
  };
  const [isValidEmail, setIsValidEmail] = useState(true);

  const onPress = () => setHidePassword(!hidePassword);

  const btnActionSignIn = () => {
    navigation.pop();
  };

  const btnActionSignUp = () => {
    if (!fullName || removeSpaces(fullName) === '') {
      Alert.alert('Readrly', 'Please enter your full name');
      return;
    }
    if (!email || removeSpaces(email) === '') {
      Alert.alert('Readrly', 'Please enter your email');
      return;
    }
    if (isValidEmail == false) {
      Alert.alert('Readrly', 'Your email format is invalid');
      return;
    }
    if (!dob) {
      Alert.alert('Readrly', 'Please enter your date of birth');
      return;
    }
    if (!password || removeSpaces(password) === '') {
      Alert.alert('Readrly', 'Please enter your password');
      return;
    }
    if (password.length < 8) {
      Alert.alert(
        'Readrly',
        'Weak password, minimum 8 and maximum 26 characters is required',
      );
      return;
    }
    if (isSelected == false) {
      Alert.alert(
        'Readrly',
        'Please agree to the terms of services and privacy policy',
      );
      return;
    }
    setLoading(true);
    createUserOnFirebase(email, password);
  };

  const createUserOnFirebase = async (email, password) => {
    try {
      console.log('Email', email), console.log('Password', password);
      let response = await auth().createUserWithEmailAndPassword(
        email,
        password,
      );
      if (response && response.user) {
        let res = await addUserToDatabase(
          response.user.uid,
          fullName,
          email,
          password,
          dob,
          '',
          dbConstants.SIMPLE,
        );
        console.log('Response', response);
        setLoading(false);
        if (res === 'success') {
          Alert.alert('Success ✅', 'Account created successfully', [
            {
              text: 'OK',
              onPress: () => {
                navigation.pop();
              },
            },
          ]);
        } else {
          Alert.alert('Readrly', 'Oops! an error occured');
        }
      } else {
        setLoading(false);
        Alert.alert('Readrly', 'Something went wrong');
      }
    } catch (e) {
      setLoading(false);
      Alert.alert('Error', e.message);
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '306852333522-23dc94rciqumn9q2oov0qgo6kevn1csp.apps.googleusercontent.com',
    });
  }, []);

  btnActionGoogleLogin = async () => {
    setLoading(true);
    console.log('Inside Google Login');
    let obj = await GoogleLogin();
    if (obj == 0) {
      setLoading(false);
    } else {
      let user = (await obj).firebaseCred.user;
      console.log(user);
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
        setItem(AppConstants.isUserLogin, true);
        navigation.replace(navigationStrings.DASHBOARD);
      } else {
        Alert.alert('Readrly', 'Oops! an error occured');
      }
    }
  };

  async function btnActionApple() {
    let obj = AppleLogin();
    let user = (await obj).firebaseCred.user;
    console.log(user);
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
    let responseFCM = await addFCMToken(user.uid, '');
    console.log('response FCM = ', responseFCM);
    setLoading(false);
    if (response === 'success') {
      setItem(AppConstants.isUserLogin, true);
      navigation.replace(navigationStrings.DASHBOARD);
    } else {
      Alert.alert('Readrly', 'Oops! an error occured');
    }
  }

  btnActionFB = async () => {
    try {
      await fbLogin(_responseInfoCallBack);
    } catch (error) {
      console.log('error raised', error);
    }
  };

  _responseInfoCallBack = async (error, result) => {
    if (error) {
      console.log('error top', error);
      return;
    } else {
      const userData = result;
      console.log('fb data+++++++', userData);
    }
  };

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
  const [isSelected, setSelected] = useState(false);

  return (
    <SafeArea>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={{flex: 1}}>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <CustomActivityIndicator animate={isLoading} />
            <View>
              <TouchableOpacity
                onPress={btnActionSignIn}
                style={styles.backButton}>
                <Image source={Images.back} />
              </TouchableOpacity>
              <View>
                <Image
                  source={imagePath.rocket}
                  style={{
                    height: 158,
                    width: 135,
                    alignSelf: 'center',
                    marginTop: 0,
                  }}
                />
                <Image style={styles.imgSplash1} source={imagePath.paw2} />
              </View>

              <Text style={styles.accountText}>Sign Up</Text>
              <View style={styles.viewFullName}>
                <Text style={styles.textFullName}>Full Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter full name"
                  onChangeText={text => {
                    setFullName(text);
                  }}
                />
              </View>
              <View style={styles.viewFullName}>
                <Text style={styles.textFullName}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={text => {
                    setEmail(text);
                    setIsValidEmail(EMAIL_REGEX.test(text));
                  }}
                  placeholder="Enter email"
                />
              </View>

              <Spacer position="bottom" size="medium" />
              <DOBComponent
                heading="Date of birth"
                placeholder="Enter dob"
                value={dob}
                onPress={() => {
                  console.log('onPress');
                  toggleModal();
                }}
              />

              <View style={styles.viewFullName}>
                <Text style={styles.textFullName}>Create Password</Text>
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
              <View>
                <Text style={styles.textPasswordLength}>
                  Between 8 and 26 characters
                </Text>
                <View style={styles.viewTermsAndPolicy}>
                  <TouchableOpacity
                    onPress={() => {
                      setSelected(!isSelected);
                    }}>
                    <Image
                      source={
                        isSelected === false
                          ? imagePath.unCheck
                          : imagePath.check
                      }
                      style={styles.imgRectangleStyle}
                    />
                  </TouchableOpacity>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <Text style={styles.txtTerms}>I agree to the</Text>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.push(navigationStrings.WEBVIEW_SCREEN, {
                          title: 'Terms of Service',
                          url: WebURLS.termsOfUse,
                        });
                      }}>
                      <Text style={styles.txtTermsBold}>terms of services</Text>
                    </TouchableOpacity>
                    <Text style={styles.txtTerms}>and</Text>
                    <TouchableOpacity
                      onPress={() => {
                        navigation.push(navigationStrings.WEBVIEW_SCREEN, {
                          title: 'Priacy policy',
                          url: WebURLS.privacyPolicy,
                        });
                      }}>
                      <Text style={styles.txtTermsBold}>privacy policy.</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              <ButtonComp
                btnText="Sign up"
                btnStyle={styles.btnStyle}
                onPress={btnActionSignUp}
              />
              <Text style={styles.txtSignupUsing}> Or sign up using </Text>
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

                {/* <TouchableOpacity onPress={btnActionFB}>
                  <Image
                    source={imagePath.facebook}
                    style={styles.imgSignupMethod}
                  />
                </TouchableOpacity> */}
              </View>
              <View style={styles.viewAlreadyHaveAnAccount}>
                <Text style={styles.txtAlreadyHaveAnAccount}>
                  Already have an account?
                </Text>
                <TouchableOpacity onPress={btnActionSignIn}>
                  <Text
                    style={{
                      ...styles.txtAlreadyHaveAnAccount,
                      ...styles.txtLogIn,
                    }}>
                    Log in
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.centeredView}>
                <DatePickerComponent
                  visible={isDatePickerVisible}
                  selectedDate={date}
                  onDateSelected={date => {
                    setDate(date);
                    setIsDatePickerVisible(false);
                    console.log(
                      'inside onDateSelected dob',
                      date,
                      isDatePickerVisible,
                    );
                    setDOB(Moment(date).format('MMMM DD, yyyy'));
                    // toggleModal();
                  }}
                  onClose={() => {
                    // setIsDatePickerVisible(false);
                    toggleModal();
                  }}
                />
              </View>
              <Image style={styles.imgSplash2} source={imagePath.paw1} />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </SafeArea>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backButton: {
    marginLeft: 15,
    marginTop: 10,
  },
  headingText: {
    fontSize: 64,
    fontWeight: '400',
    marginTop: 0,
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
  accountText: {
    fontSize: 30,
    textAlign: 'center',
    color: colors.ui.black,
    fontWeight: '600',
    marginTop: 0,
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
    height: 48,
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
    height: 48,
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
  textPasswordLength: {
    marginLeft: 36,
    marginRight: 36,
    marginTop: 7,
    color: '#ABABAB',
    fontSize: 12,
    fontWeight: '300',
    fontFamily: fonts.Poppins_Regular,
    alignSelf: 'flex-end',
  },
  viewTermsAndPolicy: {
    flexDirection: 'row',
    marginLeft: 20,
    marginRight: 20,
    marginTop: 15,
    alignItems: 'center',
  },

  imgRectangleStyle: {
    height: 25,
    width: 25,
    resizeMode: 'stretch',
    // alignItems: 'center',
    tintColor: 'rgba(0, 0, 0, 0.3)',
  },
  txtTerms: {
    fontSize: 12,
    fontWeight: '400',
    color: 'rgba(0, 0, 0, 0.3)',
    paddingLeft: 6,
    lineHeight: 16,
    fontFamily: fonts.Poppins_Regular,
  },
  txtTermsBold: {
    fontSize: 12,
    color: 'rgba(0, 0, 0, 0.3)',
    paddingLeft: 6,
    lineHeight: 16,
    fontFamily: fonts.Poppins_Bold,
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
    marginLeft: 32,
  },
  viewAlreadyHaveAnAccount: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    marginBottom: 40,
  },
  txtAlreadyHaveAnAccount: {
    color: colors.ui.darkGray,
    lineHeight: 20,
    fontSize: 14,
    fontWeight: '400',
    fontFamily: fonts.Poppins_Regular,
  },
  txtLogIn: {
    color: colors.ui.black,
    fontWeight: '600',
    paddingLeft: 3,
    fontSize: 14,
    fontFamily: fonts.Poppins_Regular,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.ui.white,
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
    bottom: '10%',
  },
});
