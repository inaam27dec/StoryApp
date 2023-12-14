import React from 'react';
import {Image, StyleSheet, Text, View, Dimensions} from 'react-native';
import {colors} from '../../../../infrastructure/theme/colors';
import {fonts} from '../../../../infrastructure/theme/fonts';
const width = Dimensions.get('screen').width;

function OnBoardingScreen3(props) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Image style={styles.imageStyle} source={null} />

      <Text style={styles.heading_textStyle}> Listen via audio</Text>
      <Text style={styles.para_textStyle}>
        If you dont want to read you can listen! Dont miss the opportunity to
        immerse yourself ina wounderful story, let our storytellers read for you
      </Text>
    </View>
  );
}

export default OnBoardingScreen3;

const styles = StyleSheet.create({
  imageStyle: {
    height: '90%',
    width: width,
    marginLeft: 0,
    marginRight: 0,
  },
  heading_textStyle: {
    fontWeight: '900',
    textAlign: 'center',
    fontSize: 32,
    marginTop: -50,
    color: colors.ui.white,
    fontFamily: fonts.Bjola,
    marginRight: 10,
    marginLeft: 5,
  },
  para_textStyle: {
    textAlign: 'center',
    fontWeight: '400',
    fontSize: 16,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
    lineHeight: 24,
    fontFamily: fonts.Poppins_Regular,
    color: colors.ui.white,
  },
});
