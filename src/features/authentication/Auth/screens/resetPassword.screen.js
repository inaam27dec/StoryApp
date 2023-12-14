import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import ButtonComp from '../components/ButtonComp';
import {fonts} from '../../../../infrastructure/theme/fonts';
import {colors} from '../../../../infrastructure/theme/colors';
import {Images} from '../../../../constants/app.constants';

export const ResetPasswordScreen = props => {
  const {navigation} = props;

  const btnActionBack = () => {
    navigation.pop();
  };

  return (
    <SafeAreaView>
      <View>
        <TouchableOpacity onPress={btnActionBack} style={styles.backButton}>
          <Image source={Images.back} />
        </TouchableOpacity>
        <Text style={styles.headingText}>Readrly</Text>
        <Text style={styles.titleText}> A new era of storytelling</Text>
        <Text style={styles.forgetPasswordText}> Reset Password</Text>
        <View style={styles.viewFullName}>
          <Text style={styles.textFullName}>Enter password</Text>
          <TextInput style={styles.textInput} placeholder="Enter password" />
        </View>
        <View style={{...styles.viewFullName, ...{marginTop: 14}}}>
          <Text style={styles.textFullName}>Confirm password</Text>
          <TextInput style={styles.textInput} placeholder="Confirm password" />
        </View>
        <ButtonComp btnText="Update password" btnStyle={styles.btnStyle} />
      </View>
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
    fontSize: 24,
    textAlign: 'center',
    color: colors.ui.black,
    fontWeight: '600',
    marginTop: 30,
    fontFamily: fonts.Poppins_Regular,
  },
  viewFullName: {
    flexDirection: 'column',
    marginTop: 30,
    marginLeft: 20,
    marginRight: 20,
  },
  textFullName: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.ui.black,
    fontFamily: fonts.Poppins_Regular,
  },
  textInput: {
    height: 48,
    borderRadius: 5,
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
});
