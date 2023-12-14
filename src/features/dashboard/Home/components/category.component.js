import React, {useState} from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import {colors} from '../../../../infrastructure/theme/colors';
import {fonts} from '../../../../infrastructure/theme/fonts';
import FastImage from 'react-native-fast-image';

function CategoryComponent(props) {
  const [opacity, setOpacity] = useState(0);

  const {onPress, data} = props;
  return (
    <TouchableOpacity onPress={onPress} style={styles.mainContainer}>
      <View style={styles.mainView}>
        <View />
        <FastImage
          style={[styles.img]}
          onLoadStart={() => {
            setOpacity(1);
          }}
          onLoad={() => {
            setOpacity(0);
          }}
          resizeMode={'contain'}
          source={{
            uri: data.full_animation_url,
          }}
        />

        <ActivityIndicator
          animating
          size="large"
          color={colors.ui.purple}
          style={[styles.activityIndicator, {opacity: opacity}]}
        />
        <Text style={styles.bottomText}> {data.name} </Text>
        <Text style={styles.bottomSubHeading}>from {data.country}</Text>
      </View>
    </TouchableOpacity>
  );
}

export default CategoryComponent;

const styles = StyleSheet.create({
  mainContainer: {
    width: 220,
    height: 250,
    borderRadius: 10,
    flex: 1,
    alignSelf: 'baseline',
    marginBottom: 20,
  },
  mainView: {
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 19,
    backgroundColor: 'white',
    flex: 1,
  },
  img: {
    width: '100%',
    flex: 1,
    borderRadius: 15,
    resizeMode: 'contain',
  },
  bottomText: {
    textAlign: 'center',
    color: colors.ui.purple,
    fontWeight: '700',
    fontSize: 20,
    fontFamily: fonts.Poppins_Regular,
  },
  bottomSubHeading: {
    textAlign: 'center',
    color: colors.ui.black,
    fontWeight: '500',
    fontSize: 12,
    fontFamily: fonts.Poppins_Regular,
    marginBottom: 10,
    flexWrap: 'wrap',
    paddingHorizontal: 5,
  },
  activityIndicator: {
    position: 'absolute',
    top: 70,
    left: 70,
    right: 70,
    bottom: 70,
  },
});
