import React, {useEffect, useState} from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {ActivityIndicator} from 'react-native';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {Spacer} from '../../../../components/spacer/spacer.component';
import {colors} from '../../../../infrastructure/theme/colors';
import {fonts} from '../../../../infrastructure/theme/fonts';

const {width} = Dimensions.get('screen');

function LatestStoryComponent(props) {
  const {latestStory} = props;
  const {latestStoryCharacter} = props;
  const [latestStoryCharacterOpacity, setLatestStoryCharacterOpacity] =
    useState(0);

  useEffect(() => {}, [latestStory, latestStoryCharacter]);
  return (
    <View
      style={{
        marginLeft: 0,
        marginRight: 0,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.ui.white,
        height: 150,
        borderRadius: 16,
      }}>
      <View
        style={{
          flex: 0.7,
          height: '100%',
          padding: 20,
          justifyContent: 'space-around',
          alignItems: 'flex-start',
        }}>
        <Text
          numberOfLines={2}
          style={{
            fontFamily: fonts.Bjola,
            fontSize: 28,
            fontWeight: '900',
          }}>
          Latest Story
        </Text>
        <Spacer size={'large'} position={'bottom'} />
        <Text
          numberOfLines={3}
          style={{
            fontFamily: fonts.Poppins_Regular,
            fontSize: 14,
          }}>
          {latestStory == null || latestStory === undefined
            ? ''
            : latestStory.data.title}
        </Text>
        <Spacer size={'large'} position={'bottom'} />
        <TouchableOpacity
          onPress={() => {}}
          style={{
            width: 80,
            height: 30,
            justifyContent: 'center',
            backgroundColor: colors.ui.purple,
            borderRadius: 25,
          }}>
          <Text
            style={{
              color: colors.ui.white,
              width: '100%',
              textAlign: 'center',
              fontSize: 14,
              fontFamily: fonts.Poppins_Regular,
            }}>
            {'Explore'}
          </Text>
        </TouchableOpacity>
      </View>
      <FastImage
        style={{
          flex: 0.3,
          height: '100%',
          borderRadius: 15,
          resizeMode: 'contain',
          marginRight: 10,
        }}
        onLoadStart={() => {
          setLatestStoryCharacterOpacity(1);
        }}
        onLoad={() => {
          setLatestStoryCharacterOpacity(0);
        }}
        resizeMode={'contain'}
        source={{
          uri:
            latestStoryCharacter == null
              ? ''
              : latestStoryCharacter.data.full_animation_url,
        }}
      />
      <ActivityIndicator
        animating
        size="large"
        color={colors.ui.purple}
        style={[
          styles.activityIndicator,
          {opacity: latestStoryCharacterOpacity},
        ]}
      />
    </View>
  );
}

export default LatestStoryComponent;

const styles = StyleSheet.create({
  activityIndicator: {
    position: 'absolute',
    marginTop: 80,
    marginLeft: width / 2 - 40,
    marginRight: width / 2 - 40,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
