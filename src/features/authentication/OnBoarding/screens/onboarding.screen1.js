/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Image, StyleSheet, Text, View, Dimensions} from 'react-native';
import {colors} from '../../../../infrastructure/theme/colors';
import {fonts} from '../../../../infrastructure/theme/fonts';

const width = Dimensions.get('screen').width;

function OnBoardingScreen1(props) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Image style={styles.imageStyle} source={null} />

      <Text style={styles.heading_textStyle}> Select your Storyteller</Text>
      <Text style={styles.para_textStyle}>
        You decide who will be in your story! A {'\n'}pirate, a samurai, a
        detective, the {'\n'}decision is yours!
      </Text>
    </View>
  );
}

export default OnBoardingScreen1;

const styles = StyleSheet.create({
  imageStyle: {
    height: '90%',
    width: width,
    marginLeft: 0,
    marginRight: 0,
  },
  heading_textStyle: {
    marginTop: -50,
    fontWeight: '900',
    textAlign: 'center',
    fontSize: 32,
    lineHeight: 44,
    color: colors.ui.textColor,
    fontFamily: fonts.Bjola,
    marginRight: 10,
    marginLeft: 5,
  },
  para_textStyle: {
    textAlign: 'center',
    fontWeight: '400',
    marginTop: 20,
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 30,
    marginRight: 30,
    fontFamily: fonts.Poppins_Regular,
    color: colors.ui.textColor,
  },
});
