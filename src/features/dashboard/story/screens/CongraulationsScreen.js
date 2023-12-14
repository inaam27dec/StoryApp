/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useState} from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import PurpleButton from '../../../../components/utility/PurpleButton.component';
import {SafeArea} from '../../../../components/utility/safe-area.component';
import {colors} from '../../../../infrastructure/theme/colors';
import {fonts} from '../../../../infrastructure/theme/fonts';
import {TopHeading} from '../../../../infrastructure/theme/global.styles';

import {Dimensions} from 'react-native';
import {Spacer} from '../../../../components/spacer/spacer.component';
import {getUserFromDatabase} from '../../../../constants/social.helper';
import imagePath from '../../../../constants/imagePath';
import {
  addAllCorrectAnswersTrack,
  getTrackPlayerQueue,
  resetTrackPlayer,
  setupPlayer,
} from '../../../../utils/trackPlayerServices';
import {useFocusEffect} from '@react-navigation/native';

function CongraulationsScreen({navigation, route}) {
  const [isAllAnswersCorrect, setIsAllAnswersCorrect] = useState(
    route.params.isAllAnswersCorrect,
  );
  const [profilePicUrl, setprofilePicUrl] = useState('');

  useEffect(() => {
    console.log('isAllAnswersCorrect ===', isAllAnswersCorrect);

    getUserFromDatabase().then(data => {
      setprofilePicUrl(data.profile_pic);
    });

    return async () => {
      resetPlayer();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      if (
        isAllAnswersCorrect !== undefined &&
        isAllAnswersCorrect !== null &&
        isAllAnswersCorrect === true
      ) {
        setup();
      }

      return async () => {
        resetPlayer();
      };
    }, []),
  );

  async function resetPlayer() {
    resetTrackPlayer();
  }

  async function setup() {
    await resetPlayer();
    let isSetup = await setupPlayer();

    const queue = await getTrackPlayerQueue();
    console.log('leaderboard setup ==== ', isSetup, queue.length);
    if (isSetup) {
      await addAllCorrectAnswersTrack(queue.length);
    }
  }

  return (
    <SafeArea>
      <ScrollView contentContainerStyle={{flex: 1}}>
        <ImageBackground
          style={styles.photo}
          source={imagePath.congratulations}>
          <View
            style={{
              position: 'absolute',
              bottom: 100,
              justifyContent: 'center',
              alignItems: 'center',
              right: 0,
              left: 0,
            }}>
            <TopHeading style={styles.topHeading}>Congraulations!</TopHeading>
            <Spacer position="bottom" size="large" />
            <Text style={styles.content}>
              You have sucessfully completed your story {'\n'}task without any
              mistakes. Welldone and {'\n'}keep up the good work.
            </Text>
            <Spacer position="bottom" size="veryLarge" />
            <PurpleButton
              width={300}
              paddingVertical={10}
              title="Check your progress"
              onPressed={() => {
                navigation.navigate('LeaderboardScreen');
              }}
            />
          </View>
        </ImageBackground>
      </ScrollView>
    </SafeArea>
  );
}

export default CongraulationsScreen;

const styles = StyleSheet.create({
  mainContainer: {
    margin: 20,
    alignItems: 'center',
  },
  topHeading: {
    textAlign: 'center',
    fontFamily: fonts.Bjola,
    fontSize: 32,
    color: colors.ui.purple,
  },
  content: {
    fontFamily: fonts.Poppins_Regular,
    fontSize: 14,
    lineHeight: 24,
    color: colors.ui.black,
    textAlign: 'center',
    fontWeight: '400',
  },
  photoContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: 'red',
  },
  photo: {
    backgroundColor: '#ccc',
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
});
