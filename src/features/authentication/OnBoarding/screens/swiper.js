/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useRef, useState} from 'react';
import {AppRegistry, StyleSheet, View} from 'react-native';

import Swiper from 'react-native-swiper';
import OnBoardingScreen1 from './onboarding.screen1';
import OnBoardingScreen2 from './onboarding.screen2';
import OnBoardingScreen3 from './onboarding.screen3';
import OnBoardingNextButtonComp from '../components/ButtonComp';
import {colors} from '../../../../infrastructure/theme/colors';
import {fonts} from '../../../../infrastructure/theme/fonts';
import {SafeAreaView} from 'react-native-safe-area-context';
import {setFirstTime} from '../../../../constants/helper';
import Video from 'react-native-video';
import imagePath from '../../../../constants/imagePath';
import {
  addOnBoardingTrack,
  getTrackPlayerQueue,
  resetTrackPlayer,
  setupPlayer,
} from '../../../../utils/trackPlayerServices';

export default SwiperComponent = props => {
  const swiper = useRef(null);
  const {navigation} = props;
  console.log('pops', props);

  const [index, setIndex] = useState(0);
  const [backgroundColor, setBackgroundColor] = useState(imagePath.video1);

  const btnActionSkip = () => {
    setFirstTime(true);
    navigation.replace('Auth');
  };
  const btnActionNext = () => {
    if (index == 2) {
      btnActionSkip();
    } else {
      swiper.current.scrollBy(1);
    }
  };

  useEffect(() => {
    setup();

    return async () => {
      resetPlayer();
    };
  }, []);

  async function resetPlayer() {
    resetTrackPlayer();
  }

  async function setup() {
    await resetPlayer();

    let isSetup = await setupPlayer();

    const queue = await getTrackPlayerQueue();
    if (isSetup) {
      await addOnBoardingTrack(queue.length);
    }
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Video
        repeat
        source={backgroundColor} // Can be a URL or a local file.
        resizeMode="cover"
        style={StyleSheet.absoluteFill}
      />
      <Swiper
        style={styles.wrapper}
        activeDotColor="#9562EA"
        activeDot={
          <View
            style={{
              width: 41.95,
              height: 7.72,
              borderRadius: 26,
              backgroundColor: colors.ui.purple,
              marginRight: 4,
            }}
          />
        }
        ref={swiper}
        loop={false}
        onIndexChanged={index1 => {
          index1 === 0
            ? setBackgroundColor(imagePath.video1)
            : index1 === 1
            ? setBackgroundColor(imagePath.video2)
            : setBackgroundColor(imagePath.video3);
          setIndex(index1);
        }}>
        <View style={styles.slide}>
          <OnBoardingScreen1 />
        </View>
        <View style={styles.slide}>
          <OnBoardingScreen2 />
        </View>
        <View style={styles.slide}>
          <OnBoardingScreen3 />
        </View>
      </Swiper>

      <View style={{flex: 0.1}}>
        <View
          style={{
            alignItems: 'center',
          }}>
          <OnBoardingNextButtonComp onPress={btnActionNext} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {},
  slide: {
    flex: 0.9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSkip_Style: {
    marginLeft: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSkipText: {
    color: colors.ui.darkGray,
    fontFamily: fonts.Poppins_Regular,
    fontWeight: '600',
    fontSize: 14,
  },
});

AppRegistry.registerComponent('myproject', () => SwiperComponent);
