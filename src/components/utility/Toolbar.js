/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Image, TouchableOpacity, Text, Dimensions} from 'react-native';
import {colors} from '../../infrastructure/theme/colors';
import {fonts} from '../../infrastructure/theme/fonts';
import {TopHeading} from '../../infrastructure/theme/global.styles';

export const ToolBar = ({
  showLeftIcon,
  leftIcon,
  onLeftPressed,
  showRightIcon,
  rightIcon,
  heading,
  onRightPressed,
  isText,
  text,
  isFromBookmark,
  isStoryScreen = false,
}) => {
  return (
    <View
      style={{
        backgroundColor: isStoryScreen
          ? colors.ui.lightPurple
          : colors.ui.clear,
      }}>
      <View
        style={{
          width: '100%',
          height: 60,
          // backgroundColor: 'pink',
          justifyContent: 'center',
        }}>
        {isFromBookmark && (
          <Text
            style={{
              alignSelf: 'center',
              fontSize: 24,
              fontFamily: fonts.Poppins_Regular,
              fontWeight: '600',
              // marginLeft: 15,
              // marginRight: 15,
            }}>
            {heading}
          </Text>
        )}
        {!isFromBookmark && (
          <TopHeading
            style={{
              alignSelf: 'center',
            }}>
            {heading}
          </TopHeading>
        )}
      </View>

      {showLeftIcon && (
        <TouchableOpacity
          onPress={onLeftPressed}
          style={{
            marginLeft: 5,
            width: isStoryScreen ? 100 : 60,
            height: 30,
            flex: 1,
            position: 'absolute',
            top: 20,
            left: 5,
            alignItems: isStoryScreen ? 'center' : 'flex-start',
            paddingHorizontal: 12,
          }}>
          <Image source={leftIcon} resizeMode="contain" />
        </TouchableOpacity>
      )}
      {showRightIcon && (
        <TouchableOpacity
          onPress={onRightPressed}
          style={
            isText
              ? {
                  marginRight: 5,
                  width: 50,
                  height: 30,
                  flex: 1,
                  position: 'absolute',
                  top: 20,
                  right: 15,
                  justifyContent: 'center',
                  backgroundColor: colors.ui.purple,
                  borderRadius: 5,
                }
              : {
                  marginRight: 0,
                  width: isStoryScreen ? 100 : 16,
                  height: 16,
                  flex: 1,
                  position: 'absolute',
                  top: 20,
                  right: 15,
                  alignItems: isStoryScreen ? 'center' : 'flex-start',
                }
          }>
          {isText && (
            <Text
              style={{
                fontSize: 14,
                color: 'white',
                textAlign: 'center',
                fontWeight: '500',
              }}>
              {text}
            </Text>
          )}
          {!isText && (
            <Image
              source={rightIcon}
              resizeMode="contain"
              style={{height: 16, width: 16}}
            />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};
