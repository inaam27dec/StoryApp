import React from 'react';
import {Image, StyleSheet, Text, View, Dimensions} from 'react-native';
import {colors} from '../../../../infrastructure/theme/colors';
import {fonts} from '../../../../infrastructure/theme/fonts';
const width = Dimensions.get('screen').width;

function OnBoardingScreen2(props) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Image style={styles.imageStyle} source={null} />

      <Text style={styles.heading_textStyle}> Read by yourself</Text>
      <Text style={styles.para_textStyle}>
        Read while we help you! you can read {'\n'}without fear of making
        mistakes, we will {'\n'}tell you where you can improve!
      </Text>
    </View>
  );
}

export default OnBoardingScreen2;

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
    color: colors.ui.textColor,
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
    color: colors.ui.textColor,
  },
});
