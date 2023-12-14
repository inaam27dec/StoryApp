/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { colors } from '../../infrastructure/theme/colors';
import { fonts } from '../../infrastructure/theme/fonts';

function PurpleBorderedButton({
  title,
  width,
  padding,
  paddingVertical,
  paddingHorizontal,
  onPressed,
  isSelected = true,
  buttonWidth,
}) {
  console.log(width)
  return (
    <TouchableOpacity
      style={[isSelected ? styles.selectedStyle : styles.unselectedStyle, buttonWidth && { width: buttonWidth }]}
      onPress={onPressed}>
      <Text
        style={{
          color: colors.ui.purple,
          width: width,
          padding: padding,
          paddingVertical: paddingVertical,
          paddingHorizontal: paddingHorizontal,
          textAlign: 'center',
          fontSize: 16,
          fontFamily: fonts.Poppins_Regular,
          fontWeight: '700',
          borderRadius: 38,
          borderWidth: 1,
          borderColor: isSelected ? colors.ui.clear : colors.ui.clear,
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export default PurpleBorderedButton;

const styles = StyleSheet.create({
  selectedStyle: {
    borderRadius: 52,
    borderWidth: 1,
    borderColor: colors.ui.purple,
  },
  unselectedStyle: {
    borderRadius: 52,
    backgroundColor: colors.ui.clear,
  },
});
