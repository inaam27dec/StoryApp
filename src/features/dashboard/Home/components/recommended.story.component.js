import React from 'react';
import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import {View} from 'react-native';
import FastImage from 'react-native-fast-image';
import {colors} from '../../../../infrastructure/theme/colors';
import {fonts} from '../../../../infrastructure/theme/fonts';
import {RowViews} from '../../../../infrastructure/theme/global.styles';

function RecommendedStoryComponent(props) {
  const {onPress, item, isSubscribed, selection, index} = props;

  const isPaidStory = () => {
    let result = isSubscribed === false && item.data.is_free === false;
    return result;
  };
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        selection === index ? {backgroundColor: colors.ui.purple} : null,
      ]}
      onPress={onPress}>
      <RowViews style={[styles.rowViewStyle, {justifyContent: 'flex-start'}]}>
        <FastImage
          style={[
            styles.img,
            {
              borderColor: isPaidStory() ? '#FEC34E' : '#9FE279',
            },
          ]}
          resizeMode={'contain'}
          source={{uri: item.data.cover_img_url}}
        />

        <Text
          style={
            isPaidStory()
              ? [
                  styles.NonSubscribedBtnText,
                  selection === index ? {color: colors.ui.white} : null,
                ]
              : [
                  styles.btnText,
                  selection === index ? {color: colors.ui.white} : null,
                ]
          }>
          {item.data.title}
        </Text>
        <View
          style={[
            styles.subscriptionView,
            {
              backgroundColor: isPaidStory() ? '#FEC34E' : '#9FE279',
            },
          ]}>
          <Text style={styles.centeredText}>
            {isPaidStory() ? 'Gold' : 'Free'}
          </Text>
        </View>
      </RowViews>
    </TouchableOpacity>
  );
}

export default RecommendedStoryComponent;

const styles = StyleSheet.create({
  rowViewStyle: {
    flex: 1,
    marginLeft: 15,
  },
  btn: {
    borderWidth: 1,
    borderColor: colors.ui.white,
    borderRadius: 16,
    marginBottom: 10,
    backgroundColor: 'white',
    height: 90,
  },
  NonSubscribedBtnText: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.ui.gray,
    fontFamily: fonts.Poppins_Regular,
    fontWeight: '500',
    marginLeft: 20,
    alignSelf: 'center',
  },
  btnText: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.ui.black,
    fontFamily: fonts.Poppins_Regular,
    fontWeight: '500',
    marginLeft: 20,
    alignSelf: 'center',
  },
  img: {
    width: 70,
    height: 70,
    borderRadius: 400,
    borderWidth: 3,
    alignSelf: 'center',
  },
  subscriptionView: {
    width: 65,
    height: 31,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    justifyContent: 'center',
  },
  centeredText: {
    textAlign: 'center',
  },
});
