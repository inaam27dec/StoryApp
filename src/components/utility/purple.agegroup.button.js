/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {colors} from '../../infrastructure/theme/colors';
import {fonts} from '../../infrastructure/theme/fonts';

function PurpleAgeGroupButton({
  title,
  width,
  height,
  paddingVertical,
  onPressed,
  isSelected = true,
}) {
  return (
    <TouchableOpacity
      onPress={onPressed}
      style={{
        width: width,
        height: height,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        paddingVertical: paddingVertical,
        backgroundColor: isSelected ? '#D9C9F9' : colors.ui.white,
        borderRadius: 25,
        borderColor: isSelected ? colors.ui.black : colors.ui.white,
        borderWidth: 1,
      }}>
      <Text
        style={{
          color: isSelected ? colors.ui.black : '#838383',
          width: '100%',
          textAlign: 'center',
          fontSize: 14,
          fontFamily: fonts.Poppins_Regular,
          fontWeight: '600',
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export default PurpleAgeGroupButton;

const styles = StyleSheet.create({
  linearGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
