/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components';
import {colors} from '../../infrastructure/theme/colors';
import {fonts} from '../../infrastructure/theme/fonts';

// const OpacityContainer = styled(TouchableOpacity)`
//   border-radius: 5px;
//   background-color: ${props => props.theme.colors.ui.purple};
// `;

function PurpleButton({
  title,
  width,
  padding,
  paddingVertical,
  paddingHorizontal,
  onPressed,
  isSelected = true,
  marginBottom,
  buttonWidth,
  isPaid = false,
}) {
  return (
    <TouchableOpacity
      style={[
        isSelected
          ? isPaid
            ? styles.selectedPaidStyle
            : styles.selectedStyle
          : styles.unselectedStyle,
        marginBottom && {marginBottom: marginBottom},
        buttonWidth && {width: buttonWidth},
      ]}
      onPress={onPressed}>
      <Text
        style={{
          color: isSelected
            ? isPaid
              ? colors.ui.black
              : colors.ui.white
            : colors.ui.purple,
          width: width,
          padding: padding,
          paddingVertical: paddingVertical,
          paddingHorizontal: paddingHorizontal,
          textAlign: 'center',
          fontSize: 16,
          fontFamily: fonts.Poppins_Regular,
          fontWeight: '700',
          borderRadius: 38,
          borderColor: isSelected ? colors.ui.purple : colors.ui.purple,
        }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

export default PurpleButton;

const styles = StyleSheet.create({
  selectedStyle: {
    borderRadius: 52,
    backgroundColor: colors.ui.purple,
    borderWidth: 1,
  },
  selectedPaidStyle: {
    borderRadius: 52,
    backgroundColor: colors.ui.yellow,
    borderWidth: 1,
  },
  unselectedStyle: {
    borderRadius: 52,
    backgroundColor: colors.ui.clear,
    borderWidth: 1,
    borderColor: colors.ui.purple,
  },
});
