/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import ButtonComp from '../components/ButtonComp';
import {fonts} from '../../../../infrastructure/theme/fonts';
import {colors} from '../../../../infrastructure/theme/colors';
import {Images} from '../../../../constants/app.constants';
import auth, {firebase} from '@react-native-firebase/auth';
import imagePath from '../../../../constants/imagePath';
export const ForgetPasswordScreen = props => {
  const {navigation} = props;
  const [email, setEmail] = useState('');
  const btnActionSubmit = () => {
    if (!email) {
      Alert.alert('Readrly', 'Please enter your email');
      return;
    } else {
      auth()
        .sendPasswordResetEmail(email)
        .then(() => {
          Alert.alert(
            'Readrly',
            'A reset password link is sent to your email ' + email,
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.pop();
                },
              },
            ],
          );
        })
        .catch(function (e) {
          Alert.alert('Readrly', 'No user exists corresponding to this email.');
        });
    }
  };

  const btnActionBack = () => {
    navigation.pop();
  };

  return (
    <SafeAreaView>
      <View>
        <TouchableOpacity onPress={btnActionBack} style={styles.backButton}>
          <Image source={Images.back} />
        </TouchableOpacity>

        <View style={{height: '25%'}}>
          <Image
            source={imagePath.space}
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

        <Text style={styles.forgetPasswordText}> Forget Password?</Text>
        <Text style={styles.txtRequestPassword}>
          You can request a password below. We will {'\n'}send a security code
          to the email address.
        </Text>
        <View style={styles.viewFullName}>
          <Text style={styles.textFullName}>Email</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={text => {
              setEmail(text);
            }}
            placeholder="Enter email"
          />
        </View>
        <ButtonComp
          btnText="Submit"
          btnStyle={styles.btnStyle}
          onPress={btnActionSubmit}
        />
      </View>
      <Image style={styles.imgSplash2} source={imagePath.paw1} />
    </SafeAreaView>
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
  forgetPasswordText: {
    fontSize: 30,
    textAlign: 'center',
    color: colors.ui.black,
    fontWeight: '700',
    marginTop: 30,
    fontFamily: fonts.Poppins_Regular,
  },
  txtRequestPassword: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000000AD',
    lineHeight: 21,
    marginLeft: 31,
    marginRight: 31,
    marginTop: 21,
    textAlign: 'center',
    fontFamily: fonts.Poppins_Regular,
  },
  viewFullName: {
    flexDirection: 'column',
    marginTop: 50,
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
    borderRadius: 5,
    borderColor: colors.ui.borderColor,
    borderWidth: 1,
    padding: 10,
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
  btnStyle: {
    marginTop: 46,
    marginLeft: 20,
    marginRight: 20,
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
    bottom: '5%',
  },
});
