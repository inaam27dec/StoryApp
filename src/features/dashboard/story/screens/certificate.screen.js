import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import ViewShot from 'react-native-view-shot';

import React, {useEffect, useState, useRef} from 'react';
import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import {TouchableOpacity} from 'react-native';
import {Spacer} from '../../../../components/spacer/spacer.component';
import CustomActivityIndicator from '../../../../components/utility/activity.indicator.component';
import PurpleButton from '../../../../components/utility/PurpleButton.component';
import {SafeArea} from '../../../../components/utility/safe-area.component';
import {ToolBar} from '../../../../components/utility/Toolbar';
import {Images} from '../../../../constants/app.constants';
import {getUserFromDatabase} from '../../../../constants/social.helper';
import {colors} from '../../../../infrastructure/theme/colors';
import {fonts} from '../../../../infrastructure/theme/fonts';
import {MainContainer} from '../../../../infrastructure/theme/global.styles';

function CertificateScreen(props) {
  const {navigation} = props;
  const {leaderboardDetails} = props.route.params;
  const {name} = props.route.params;

  const ref = useRef();

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('In Navigation Add Listener Block');
      return unsubscribe;
    });
  }, []);

  const takeScreenShot = () => {
    // to take a screenshot
    ref.current.capture().then(uri => {
      // to save screenshot in local memory
      CameraRoll.save(uri, {type: 'photo', album: 'Album codes'});
      alert(
        'Your certificate has been successfully saved in your photo Library',
      );
    });
  };

  return (
    <SafeArea>
      <ToolBar
        heading="Certification"
        showLeftIcon={true}
        leftIcon={Images.back}
        onLeftPressed={() => {
          navigation.pop();
        }}
        showRightIcon={false}
        rightIcon={Images.bell}
        onRightPressed={() => {}}
      />
      <ScrollView>
        <MainContainer>
          <View style={styles.listContainer}>
            <Text style={styles.congratulateLbl}>
              Congratulations on your certificate!
            </Text>
            <Text style={styles.congratulateLbl}>
              Point achieved: {leaderboardDetails.data.story_points} pts
            </Text>
            <Spacer position={'bottom'} size="large" />
            <ViewShot
              ref={ref}
              options={{
                fileName: 'certificate', // screenshot image name
                format: 'jpg', // image extension
                quality: 0.9, // image quality
              }}>
              <View style={styles.imgContainer}>
                <Image source={Images.certificate} style={styles.img} />

                <Text style={styles.topLabel1}>Readrly</Text>
                <Text style={styles.subTitle}>A new era of storytelling</Text>

                <Text style={styles.topLabel2}>{name === '' ? '-' : name}</Text>
                <Text style={styles.topLabel3}>
                  Congratulations for scoring{' '}
                  {(
                    (leaderboardDetails.data.story_points /
                      leaderboardDetails.data.totalPoints) *
                    100
                  ).toFixed(0)}
                  % on the story
                </Text>
                <Text style={styles.topLabel4}>
                  "{leaderboardDetails.data.story_title}"
                </Text>
              </View>
            </ViewShot>
          </View>
          <Spacer position={'bottom'} size="large" />

          <TouchableOpacity
            onPress={() => {
              takeScreenShot();
            }}>
            <Text style={styles.downloadBtn}>Download certificate</Text>
          </TouchableOpacity>
          <Spacer position={'bottom'} size="veryLarge" />
          <PurpleButton
            title={'Back to Home Page'}
            paddingHorizontal={24}
            paddingVertical={8}
            onPressed={() => {
              navigation.popToTop();
            }}
          />
        </MainContainer>
      </ScrollView>
    </SafeArea>
  );
}

export default CertificateScreen;

const styles = StyleSheet.create({
  listContainer: {
    // backgroundColor: colors.ui.yellow,
  },
  congratulateLbl: {
    fontSize: 14,
    fontFamily: fonts.Poppins_Regular,
    color: colors.ui.black,
    textAlign: 'center',
  },
  topLabel1: {
    position: 'absolute',
    marginTop: 10,
    color: colors.ui.white,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 17,
    fontFamily: fonts.suez_one,
  },
  subTitle: {
    position: 'absolute',
    marginTop: 30,
    color: colors.ui.white,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 10,
    fontFamily: fonts.Poppins_Regular,
  },
  topLabel2: {
    position: 'absolute',
    marginTop: 180,
    color: colors.ui.white,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 40,
    fontFamily: fonts.Bjola,
  },
  topLabel3: {
    position: 'absolute',
    marginTop: 240,
    color: colors.ui.white,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 11,
    fontFamily: fonts.Poppins_Regular,
  },
  topLabel4: {
    position: 'absolute',
    marginTop: 265,
    color: colors.ui.white,
    textAlign: 'center',
    alignSelf: 'center',
    fontSize: 11,
    fontFamily: fonts.Poppins_Light,
  },
  imgContainer: {
    marginTop: 0,
    resizeMode: 'contain',
    width: '100%',
    height: 500,
  },
  img: {
    // flex: 1,
    marginTop: 0,
    borderRadius: 20,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  downloadBtn: {
    alignSelf: 'center',
    fontFamily: fonts.Poppins_Bold,
    fontSize: 16,
    textDecorationLine: 'underline',
    color: colors.ui.purple,
  },
});
