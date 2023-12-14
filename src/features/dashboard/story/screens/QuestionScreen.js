/* eslint-disable react-native/no-inline-styles */
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ScrollView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {ProgressBar} from 'react-native-paper';
import styled from 'styled-components';
import {Spacer} from '../../../../components/spacer/spacer.component';
import CustomActivityIndicator from '../../../../components/utility/activity.indicator.component';
import PurpleButton from '../../../../components/utility/PurpleButton.component';
import {SafeArea} from '../../../../components/utility/safe-area.component';
import {ToolBar} from '../../../../components/utility/Toolbar';
import {Images} from '../../../../constants/app.constants';
import {
  addStoryPointsToLeaderBoard,
  getStoryQuestions,
} from '../../../../constants/social.helper';
import {colors} from '../../../../infrastructure/theme/colors';
import {fonts} from '../../../../infrastructure/theme/fonts';
import {SuezHeading} from '../../../../infrastructure/theme/global.styles';
import FastImage from 'react-native-fast-image';
import {
  addCorrectAnswerTrack,
  addQuestionTimeTrack,
  addWrongAnswerTrack,
  getTrackPlayerQueue,
  resetTrackPlayer,
  setupPlayer,
} from '../../../../utils/trackPlayerServices';
import {useFocusEffect} from '@react-navigation/native';
import AnswerStatusPopup from './answer.status.popup';

const QuestionText = styled(Text)`
  font-family: ${props => props.theme.fonts.Poppins_Regular};
  font-size: 16px;
  font-weight: 600;
`;

const ImageContainer = styled(View)`
  align-self: center;
  width: 366px;
  height: 324px;
`;

export const QuestionScreen = props => {
  const {navigation, route} = props;
  console.log(route.params.characterImgURL);

  const {isAdmin} = props.route.params;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lisData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [points, setPoints] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [opacity, setOpacity] = useState(0);
  const [answerGiven, setAnswerGiven] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  const timerRef = useRef(null);

  const setAnswer = userAnswer => {
    console.log(userAnswer);
    if (lisData[currentIndex].data.answer == userAnswer) {
      console.log(lisData[currentIndex].data.answer);
      let updatedPoints = points + lisData[currentIndex].data.question_points;
      console.log('Points', updatedPoints);
      setupCorrectAnswerTrack();
      setPoints(updatedPoints);
    } else {
      let updatedPoints = points + 0;
      setupWrongAnswerTrack();
      setPoints(updatedPoints);
    }
    setTimeout(() => {
      setAnswerGiven(true);
      setIsCorrect(null);
    }, 2000);
  };

  async function resetPlayer() {
    await resetTrackPlayer();
  }

  function showIcon(isCorrect) {
    // setShowModal(true);
    setIsCorrect(isCorrect);
  }

  async function setupCorrectAnswerTrack() {
    showIcon(true);
    await resetPlayer();
    let isSetup = await setupPlayer();

    const queue = await getTrackPlayerQueue();
    console.log('correct answer sound ==== ', isSetup, queue.length);
    if (isSetup) {
      await addCorrectAnswerTrack(queue.length);
    }
  }

  async function setupWrongAnswerTrack() {
    showIcon(false);
    await resetPlayer();

    let isSetup = await setupPlayer();

    const queue = await getTrackPlayerQueue();
    console.log('wrong answer sound ==== ', isSetup, queue.length);
    if (isSetup) {
      await addWrongAnswerTrack(queue.length);
    }
  }

  async function setupQuestionTimeTrack() {
    await resetPlayer();

    let isSetup = await setupPlayer();

    const queue = await getTrackPlayerQueue();
    console.log('question timer sound ==== ', isSetup, queue.length);
    if (isSetup) {
      await addQuestionTimeTrack(queue.length);
    }
  }

  function showLoading(show) {
    if (show) {
      setLoading(true);
    } else {
      setLoading(false);
    }
  }

  const setIndex = () => {
    console.log('currentIndex after next button ===', currentIndex);
    if (currentIndex + 1 < lisData.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setTimeout(async () => {
        await resetPlayer();

        if (isAdmin) {
          Alert.alert('Success', 'Successfully given all the answers', [
            {
              text: 'Ok',
              onPress: () => {
                navigation.popToTop();
              },
            },
          ]);
        } else {
          let isAllAnswersCorrect = points == totalPoints ? true : false;

          setLoading(true);
          addStoryPointsToLeaderBoard(
            route.params?.storyID,
            route.params?.characterID,
            route.params?.characterImgURL,
            route.params?.storyTitle,
            points,
            totalPoints,
          )
            .then(data => {
              setLoading(false);
              navigation.push('CongraulationsScreen', {
                isAllAnswersCorrect: isAllAnswersCorrect,
              });
            })
            .catch(e => {
              setLoading(false);
            });
        }
      }, 100);
    }
  };

  useEffect(() => {
    setLoading(true);
    getStoryQuestions(route.params?.storyID).then(data => {
      setLoading(false);
      setListData(data);
      getTotalPoints(data);
      setTimeout(async () => {
        await resetTrackPlayer();
        setupQuestionTimeTrack();
      }, 1000);
    });

    return async () => {
      clearTimeout(timerRef.current);
      // timerRef = null;
      await resetPlayer();
    };
  }, []);

  useEffect(() => {
    if (lisData.length != 0 && answerGiven == true) {
      console.log('inside setIndex 2, ===', points, lisData.length);
      setIndex();
    }
    setAnswerGiven(false);
  }, [answerGiven]);

  useEffect(() => {
    if (currentIndex < lisData.length) {
      clearTimeout(timerRef.current);

      if (currentIndex < lisData.length) {
      }
      timerRef.current = setTimeout(() => {
        setupQuestionTimeTrack();
      }, 2500);
    }
  }, [currentIndex]);

  useFocusEffect(
    useCallback(() => {
      return async () => {
        await resetPlayer();
      };
    }, []),
  );

  const getTotalPoints = data => {
    var pointsVal = 0;
    data.forEach(element => {
      pointsVal = pointsVal + element.data.question_points;
    });
    setTotalPoints(pointsVal);
  };

  return (
    <SafeArea style={{backgroundColor: '#F6F4F0'}}>
      {loading && <CustomActivityIndicator animate={loading} />}
      <View>
        <ToolBar
          showLeftIcon={true}
          leftIcon={Images.back}
          onLeftPressed={() => {
            if (isAdmin) {
              navigation.popToTop();
            } else {
              navigation.pop(2);
            }
          }}
          showRightIcon={false}
          rightIcon={Images.setting}
          heading="Question time!"
        />
      </View>
      <ScrollView>
        <ImageContainer>
          <FastImage
            style={[
              {
                width: '100%',
                height: 324,
                borderRadius: 15,
                resizeMode: Platform.OS === 'ios' ? 'cover' : 'cover',
              },
            ]}
            onLoadStart={() => {
              setOpacity(1);
            }}
            onLoad={() => {
              setOpacity(0);
            }}
            resizeMode={'contain'}
            source={{
              uri: route.params?.characterImgURL,
              // priority: FastImage.priority.normal,
              // cache: FastImage.cacheControl.cacheOnly,
            }}
          />
          <ActivityIndicator
            animating
            size="large"
            color={colors.ui.purple}
            style={[styles.activityIndicator, {opacity: opacity}]}
          />
        </ImageContainer>
        <View style={styles.countContainer}>
          <SuezHeading>
            {currentIndex + 1}/{lisData.length}
          </SuezHeading>
        </View>
        <Spacer position="bottom" size="veryLarge" />
        {lisData.length != 0 && (
          <>
            <ProgressBar
              progress={
                (lisData[currentIndex].data.question_number / lisData.length) *
                1
              }
              color={colors.ui.purple}
              style={styles.progressBar}
            />
            <Question
              child={{
                question: lisData[currentIndex],
                setAnswer: setAnswer,
                setIndex: setIndex,
                showLoading: showLoading,
                resetPlayer: resetPlayer,
                arrayLength: lisData.length,
                isAdmin: isAdmin,
                isCorrect: isCorrect,
              }}
            />
          </>
        )}
      </ScrollView>
      <View>
        <AnswerStatusPopup
          visible={showModal}
          isCorrect={isCorrect}
          onHide={() => {
            setShowModal(false);
          }}
        />
        {/* <Image
              style={{flex: 1, backgroundColor: colors.ui.purple}}
              source={require('./back_icon.png')}
              resizeMode="contain"
            /> */}
      </View>
    </SafeArea>
  );
};

const Question = props => {
  const [selection, setSelection] = useState(-1);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const {child} = props;
  console.log(child);

  useEffect(() => {
    if (child.isCorrect == null) {
      setSelection(-1);
    }
  }, [child.isCorrect]);

  return (
    <View pointerEvents={child.isCorrect == null ? 'auto' : 'none'}>
      <View style={styles.progressbarContainer}>
        <Spacer position="bottom" size="medium" />
        <Text style={styles.questionNumber}>
          Question {child.question.data.question_number + 1}
        </Text>
        <Spacer position="bottom" size="large" />
        <QuestionText style={{alignSelf: 'center'}}>
          {child.question.data.question}
        </QuestionText>
      </View>
      <View style={styles.btnGroup}>
        <FlatList
          bounces={false}
          data={child.question.data.options}
          renderItem={({item, index}) => {
            return (
              <TouchableOpacity
                style={[
                  styles.btn,
                  selection === index
                    ? child.isCorrect === null
                      ? {backgroundColor: '#D9C9F9'}
                      : child.isCorrect
                      ? {backgroundColor: colors.ui.lightGreen}
                      : {backgroundColor: colors.ui.red}
                    : {borderColor: 'white', backgroundColor: 'white'},
                ]}
                onPress={async () => {
                  setSelection(index);
                  setSelectedAnswer(item);
                  await child.resetPlayer();
                }}>
                <Text
                  style={[
                    styles.btnText,
                    selection === index ? {color: colors.ui.white} : null,
                  ]}>
                  {item}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
      <View style={styles.nextBtnContainer}>
        <PurpleButton
          title="Next"
          paddingVertical={10}
          paddingHorizontal={55}
          width={310}
          onPressed={() => {
            if (child.isAdmin) {
              // setSelection(-1);
              child.setAnswer(selectedAnswer);
            } else {
              if (selection !== -1) {
                // setSelection(-1);
                child.setAnswer(selectedAnswer);
              } else {
                Alert.alert('Error', 'Please select an option');
              }
            }
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  topLabelContainer: {
    marginLeft: 20,
  },
  countContainer: {
    backgroundColor: colors.ui.white,
    width: 80,
    height: 50,
    borderRadius: 8,
    borderColor: colors.ui.gray,
    borderWidth: 0.5,
    margin: -20,
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressbarContainer: {
    padding: 20,
  },
  progressBar: {
    marginLeft: 20,
    marginRight: 20,
    height: 15,
    borderRadius: 7.5,
  },
  btnGroup: {
    alignSelf: 'center',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '60%',
    marginBottom: 40,
  },
  btn: {
    borderWidth: 1,
    borderColor: colors.ui.black,
    borderRadius: 52,
    marginBottom: 10,
  },
  btnText: {
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(0, 0, 0, 0.8)',
  },
  questionNumber: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: fonts.Poppins_Regular,
    color: colors.ui.purple,
    alignSelf: 'center',
  },
  nextBtnContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 40,
  },
  activityIndicator: {
    position: 'absolute',
    top: 70,
    left: 70,
    right: 70,
    bottom: 70,
  },
});
