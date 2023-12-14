import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colors} from '../../../../infrastructure/theme/colors';
import {fonts} from '../../../../infrastructure/theme/fonts';

const ButtonComp = ({
  onPress = () => {},
  btnText = '',
  btnTextStyle = {},
  btnStyle = {},
}) => {
  return (
    <TouchableOpacity
      style={{...styles.btnStyle, ...btnStyle}}
      activeOpacity={0.8}
      onPress={onPress}>
      <Text style={{...styles.btnTextStyle, ...btnTextStyle}}>{btnText}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  btnStyle: {
    backgroundColor: colors.ui.purple,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 52,
    paddingHorizontal: 8,
    borderColor: 'black',
    borderWidth: 1,
  },
  btnTextStyle: {
    color: colors.ui.white,
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 20,
    fontFamily: fonts.Poppins_Regular,
  },
});
export default ButtonComp;
