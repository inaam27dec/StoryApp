import React from 'react';
import {Image, StyleSheet, TouchableOpacity} from 'react-native';
import imagePath from '../../../../constants/imagePath';
import {colors} from '../../../../infrastructure/theme/colors';
import {fonts} from '../../../../infrastructure/theme/fonts';

const OnBoardingNextButtonComp = ({onPress = () => {}}) => {
  return (
    <TouchableOpacity style={styles.btnNext_Style} onPress={onPress}>
      <Image style={styles.imgSplash2} source={imagePath.right} />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  btnNext_Style: {
    width: 52,
    backgroundColor: '#9562EA',
    height: 52,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnNexText: {
    color: colors.ui.white,
    fontWeight: '700',
    fontSize: 16,
    fontFamily: fonts.Poppins_Regular,
  },
  imgSplash2: {
    height: 24,
    width: 24,
    resizeMode: 'contain',
  },
});

export default OnBoardingNextButtonComp;
