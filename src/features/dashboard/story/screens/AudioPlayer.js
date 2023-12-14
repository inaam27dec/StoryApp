import React, {useState, useEffect, useRef} from 'react';
import * as RNFS from 'react-native-fs';
import TrackPlayer, {useProgress, State} from 'react-native-track-player';
import OptionModal from '../../../../components/utility/ModalOptionForHighlight';
import {Images, StoryConstants} from '../../../../constants/app.constants';
import {Alert, Dimensions, PermissionsAndroid, Platform} from 'react-native';
import Slider from '@react-native-community/slider';
import Orientation from 'react-native-orientation-locker';
import {FlipPage, FlipPagePage} from '../../../../components/book_page';
import IdleTimerManager from 'react-native-idle-timer';

import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  Modal,
} from 'react-native';
import imagePath from '../../../../constants/imagePath';
import {colors} from '../../../../infrastructure/theme/colors';
import OptionModalForVoice from '../../../../components/utility/ModalOptionForVoice';
import {fonts} from '../../../../infrastructure/theme/fonts';
import {
  addStoryToBookmark,
  isStoryDownloaded,
  removeStoryPreference,
  updateStoryPreference,
  updateStoryStatusByID,
  updateUserLastReadStory,
} from '../../../../constants/social.helper';
import StoryRatingPopup from './story.rating.popup';
import CustomActivityIndicator from '../../../../components/utility/activity.indicator.component';
import RNFetchBlob from 'rn-fetch-blob';
import {AppKilledPlaybackBehavior} from 'react-native-track-player';

import {
  getFilePath,
  getFormattedStoryTitle,
  getItem,
  showAlert,
} from '../../../../constants/helper';
import {AppConstants} from '../../../../constants/app.constants';

import {ActivityIndicator} from 'react-native-paper';
import {EventRegister} from 'react-native-event-listeners';
import FastImage from 'react-native-fast-image';
import NetInfo from '@react-native-community/netinfo';

let WordIndex = 0;
let numberOfWordsInPara;

const {width, height} = Dimensions.get('screen');
const AudioPlayer = props => {
  const {navigation} = props;
  const {bookmarkValue} = props.route.params;
  const {story} = props.route.params;
  const {character} = props.route.params;
  const {isAdmin} = props.route.params;
  const {isHighlightValue} = props.route.params;

  const [storyTitle, setStoryTitle] = useState('');
  const progress = useProgress(100);
  const [paragraphIndex, setparagraphIndex] = useState(0);
  const [curserInPara, setcurserInPara] = useState(0);
  const [curserInPara1, setcurserInPara1] = useState(0);
  const [imageUri, setimageUri] = useState(imagePath.play);
  const [isHighlight, setisHighlight] = useState(isHighlightValue);

  const [isBookMarkToastVisible, setIsBookMarkToastVisible] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(bookmarkValue);
  const [isModelVisible, setisModalVisible] = useState(false);
  const [isModelVoiceVisible, setisModalVoiceVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isRatingModalVisible, setRatingModalVisible] = useState(false);
  const [paragraphs, setParagraphs] = useState([]);
  const [pageList, setPageList] = useState([]);

  const [wordsList, setWordsList] = useState([]);
  const [selectedNarrator, setSelectedNarrator] = useState();
  const [narratorList, setNarratorList] = useState([]);
  const [isPageChanged, setIsPageChanged] = useState(true);
  const [currentPageNumber, setCurrentPageNumber] = useState(0);
  const [showPanel, setShowPanel] = useState(true);
  const [timeList, setTimeList] = useState([]);
  const [durationForPages, setDurationForPages] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [disabledBackwardButton, setDisabledBackwardButton] = useState(false);
  const [disabledForwardButton, setDisabledForwardButton] = useState(false);
  const inputRef = useRef(null);

  const [userStoryPreference, setUserStoryPreference] = useState('abc');

  const [showDownloadLoader, setShowDownloadLoader] = useState(false);
  const [showDownloadButton, setShowDownloadButton] = useState(false);

  const skipToForwardBackWord = async skip => {
    const position = await TrackPlayer.getPosition();
    const duration = await TrackPlayer.getDuration();
    if (position < duration && position != duration) {
      if (skip === 'Forward') {
        await TrackPlayer.seekTo(position + 5);
      } else {
        await TrackPlayer.seekTo(position - 5);
      }
    }
  };

  useEffect(() => {
    initialize();

    return async () => {
      console.log('in audio player return statement');
      IdleTimerManager.setIdleTimerDisabled(false);
      Orientation.lockToPortrait();
    };
  }, []);

  const initialize = async () => {
    reset(false, true);
    IdleTimerManager.setIdleTimerDisabled(true);
    getUserPreference();
  };

  useEffect(() => {
    try {
      if (
        story.data?.title !== null &&
        story.data?.title !== undefined &&
        story.data?.title !== ''
      ) {
        let storyTitle = getFormattedStoryTitle(story.data?.title ?? '');
        setStoryTitle(storyTitle);
      }

      let content = JSON.parse(story.data?.content);
      downloadImages(content);
      setParagraphs(content.data);
      let paragraphArrayCount = content.data.length ?? 0;
      const arr = Array(paragraphArrayCount / 2).fill('dummy');
      setPageList(arr);
    } catch (error) {
      showErrorAlertAndPop();
    }
  }, []);

  useEffect(() => {
    try {
      if (userStoryPreference !== 'abc' && userStoryPreference !== null) {
        if (userStoryPreference === '') {
          setcurserInPara(0);
          setcurserInPara1(0);
          WordIndex = 0;
        } else {
          setcurserInPara(userStoryPreference.cursorInPara);
          setcurserInPara1(userStoryPreference.cursorInPara);
          WordIndex = userStoryPreference.lastWordIndex;
        }

        setTimeout(() => {
          fetchNarratorsFromDB();
        }, 200);
      }
    } catch (error) {
      showErrorAlertAndPop();
    }
  }, [userStoryPreference]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setTimeout(() => {
        Orientation.lockToLandscape();
      }, 100);
      return unsubscribe;
    });
  }, []);

  useEffect(() => {
    try {
      let content = JSON.parse(story.data?.content);

      if (selectedNarrator) {
        getStoryConfiguration();
        setupPlayer();
        numberOfWordsInPara =
          content.data[paragraphIndex].data.split(' ').length;
        requestToPermissions();
      }
    } catch (error) {
      console.log('error 1', error);
      showErrorAlertAndPop();
    }
  }, [selectedNarrator]);

  useEffect(() => {
    try {
      if (
        selectedNarrator !== null &&
        selectedNarrator !== undefined &&
        isPageChanged === true
      ) {
        updateUserPreference(false, true);

        let content = JSON.parse(story.data?.content);
        getStoryConfiguration();
        setupPlayer();
        numberOfWordsInPara =
          content.data[paragraphIndex].data.split(' ').length;
        requestToPermissions();
      }
    } catch (error) {
      showErrorAlertAndPop();
    }
  }, [currentPageNumber]);

  useEffect(() => {
    const networkState = NetInfo.fetch().then(data => {
      let isOnline = data.isConnected;
      if (isOnline) {
        isStoryDownloaded(story?.id).then(data => {
          if (data) {
            setShowDownloadButton(false);
          } else {
            setShowDownloadButton(true);
          }
        });
      } else {
        setShowDownloadButton(false);
      }
    });
  }, []);

  useEffect(() => {
    try {
      const networkState = NetInfo.fetch().then(data => {
        let content = JSON.parse(story.data?.content);

        let paragraphArrayCount = content.data.length ?? 0;
        const pageList = Array(paragraphArrayCount / 2).fill('dummy');
        let isOnline = data.isConnected;
        if (isOnline) {
          let narratorList = JSON.parse(story.data?.audio_content).data;
          isStoryDownloaded(story?.id).then(data => {
            if (!data) {
              setTimeout(() => {
                EventRegister.emit('Event', {
                  narratorList,
                  story,
                  pageList,
                  currentPageNumber: 0,
                  paragraphIndex: 0,
                });
              }, 6000);
            }
          });
        }
      });
    } catch (error) {
      showErrorAlertAndPop();
    }
  }, []);

  const downloadImages = content => {
    let paragraphs = content.data;

    let images = [];

    paragraphs.map(item => {
      if (item.type === 'image') {
        images = [...images, item.data];
      }
    });

    images.map(item => {
      FastImage.preload([
        {
          uri: item,
        },
      ]);
    });
  };

  const fetchNarratorsFromDB = () => {
    let audioContent = JSON.parse(story.data?.audio_content);
    setNarratorList(audioContent.data);
    if (audioContent.data.length > 0) {
      let index = audioContent.data.findIndex(
        obj => obj.id === StoryConstants.RubyNarratorId,
      );
      if (index !== undefined && index !== null && index !== -1) {
        let narrator = audioContent.data[index];
        setSelectedNarrator(narrator);
      } else {
        setSelectedNarrator(audioContent.data[0]);
      }
    }
  };

  const getStoryConfiguration = () => {
    if (selectedNarrator != null) {
      let wordsListStr =
        selectedNarrator?.audioContentList[paragraphIndex].wordsList ?? '';
      let wordsList = JSON.parse(wordsListStr);
      if (wordsList != null) {
        let array = wordsList ?? [];
        setWordsList(array);
        progress.position = 0;
      }

      var startTimeOfPara = 0;
      var list = [];
      var durationList = [];
      var i = 0;
      var endMSSum = 0;

      while (i < selectedNarrator?.audioContentList.length) {
        let audioContent = selectedNarrator?.audioContentList[i];

        let wordsListStr = audioContent.wordsList ?? '';
        let wordsList = JSON.parse(wordsListStr);

        if (wordsList != null) {
          let array = wordsList ?? [];

          if (startTimeOfPara === 0) {
            startTimeOfPara = 0.1;
          }
          list = [...list, startTimeOfPara];
          let endTimeOfPara = array[array.length - 1].endMs ?? 0;
          durationList = [...durationList, endTimeOfPara];
          startTimeOfPara = startTimeOfPara + endTimeOfPara;
          endMSSum = endMSSum + endTimeOfPara;
        }

        i = i + 2;
      }

      selectedNarrator.audioTime = endMSSum;
      setTimeList(list);
      setDurationForPages(durationList);
    }
  };

  const showErrorAlertAndPop = () => {
    setTimeout(async () => {
      await reset();
      Alert.alert('Error', 'An Error occured..., please try again later...', [
        {
          text: 'OK',
          onPress: async () => {
            await reset();
            navigation.pop();
          },
        },
      ]);
    }, 100);
  };

  async function setupPlayer() {
    var selectedNarratorName = selectedNarrator?.name ?? '';
    selectedNarratorName = selectedNarratorName.replace('/ +/g', '');
    await TrackPlayer.setupPlayer();
    let path = '';
    if (Platform.OS === 'android') {
      path =
        RNFS.DownloadDirectoryPath +
        '/' +
        selectedNarratorName +
        '/' +
        storyTitle +
        '/' +
        currentPageNumber +
        '.mp3';
    } else {
      path =
        RNFS.DocumentDirectoryPath +
        '/' +
        selectedNarratorName +
        '/' +
        storyTitle +
        '/' +
        currentPageNumber +
        '.mp3';
    }

    await TrackPlayer.add({
      id: story.id,
      url: path,
      title: 'story',
      artist: 'readrly',
      artwork: path,
    });
  }

  const skipPunctuation = (isBackward = false) => {
    while (
      WordIndex < wordsList.length &&
      (wordsList[WordIndex].word == '.' ||
        wordsList[WordIndex].word == ',' ||
        wordsList[WordIndex].word == ',' ||
        wordsList[WordIndex].word == '!' ||
        wordsList[WordIndex].word == '!' ||
        wordsList[WordIndex].word == ' ' ||
        wordsList[WordIndex].word == '?' ||
        wordsList[WordIndex].word == ';' ||
        wordsList[WordIndex].word == ':')
    ) {
      if (isBackward) {
        WordIndex -= 1;
      } else {
        WordIndex += 1;
      }
    }
  };

  const skipHyphenSign = (isBackward = false) => {
    paragraphs[paragraphIndex].data.split(' ').map((item, newIndex) => {
      if (
        curserInPara == newIndex &&
        (item.includes('-') ||
          item.includes('—') ||
          item.includes('-') ||
          item.includes('-'))
      ) {
        let listOfHyphenWords = item.split(/[-—]+/);
        let tempWordIndex = WordIndex;
        let isHyphenWordsMatch = true;
        listOfHyphenWords.map((hyphenWord, indexOfHyphenWord) => {
          if (tempWordIndex < wordsList.length) {
            if (wordsList[tempWordIndex].word != hyphenWord) {
              isHyphenWordsMatch = false;
            }
            tempWordIndex++;
          }
        });
        if (isHyphenWordsMatch) {
          if (isBackward) {
            WordIndex -= listOfHyphenWords.length - 1;
          } else {
            WordIndex += listOfHyphenWords.length - 1;
          }
        }
      }
    });
  };

  const moveCursor = () => {
    let numberOfWordsSkiped = curserInPara;
    let previousCurserInPara = curserInPara;
    let isfirstTime = true;

    // Page changed these line only set curser to start but not set wordIndex (track player)
    if (!isPageChanged) {
      setcurserInPara(0);
      setcurserInPara1(0);
      return;
    }
    skipPunctuation();
    skipHyphenSign();
    // Skip words untill right word arrives
    while (
      WordIndex < wordsList.length &&
      getProgressPositionMiliSeconds() > wordsList[WordIndex].endMs
    ) {
      WordIndex += 1;

      let progressVal = progress.position;
      let totalDuration = durationForPages[currentPageNumber] / 1000;

      if (
        numberOfWordsSkiped >= numberOfWordsInPara ||
        progressVal === totalDuration
      ) {
        //the same code is written in useEffect of dependency [progress.position] in longer else part
      }
      // Same Paragraph and move to next word
      else {
        numberOfWordsSkiped += 1;
        if (isfirstTime) {
          previousCurserInPara = numberOfWordsSkiped;
        }
      }
      isfirstTime = false;
      skipPunctuation();
      skipHyphenSign();
    }

    setcurserInPara(numberOfWordsSkiped);
    setcurserInPara1(previousCurserInPara);
  };

  const moveCursorBackWord = async () => {
    let seconds = progress.position - 5;
    if (seconds < 0) {
      seconds = 0;
      setcurserInPara(0);
      setcurserInPara1(0);
      WordIndex = 0;
      setparagraphIndex(0);
      numberOfWordsInPara = paragraphs[0].data.split(' ').length;
      return;
    }

    skipPunctuation(true);
    skipHyphenSign(true);

    let numberOfWordsSkiped = curserInPara;
    let previousCurserInPara = curserInPara1;
    let isfirstTime = true;
    while (seconds < wordsList[WordIndex].endMs / 1000) {
      WordIndex -= 1;
      if (WordIndex < 0) {
        WordIndex = 0;
      }
      if (numberOfWordsSkiped <= 0) {
        let prePara = paragraphIndex - 1;
        if (prePara < 0) {
          prePara = 0;
        }

        while (true) {
          if (paragraphs[prePara].type == 'text') {
            break;
          }
          prePara -= 1;
        }
        numberOfWordsInPara = paragraphs[prePara].data.split(' ').length;

        setparagraphIndex(prePara);
        setcurserInPara(numberOfWordsInPara - 1);
        numberOfWordsSkiped = numberOfWordsInPara - 1;
        previousCurserInPara = numberOfWordsInPara - 1;
      } else {
        numberOfWordsSkiped -= 1;
        if (isfirstTime) {
          previousCurserInPara = numberOfWordsSkiped;
        }
      }
      isfirstTime = false;
      skipPunctuation(true);
      skipHyphenSign(true);
    }
    setcurserInPara(numberOfWordsSkiped);
    setcurserInPara1(previousCurserInPara);
  };

  const getProgressPositionMiliSeconds = () => {
    return progress.position * 1000;
  };

  useEffect(() => {
    if (
      (progress.position == progress.duration ||
        curserInPara >= numberOfWordsInPara) &&
      progress.duration != 0 &&
      currentPageNumber === pageList.length - 1
    ) {
      console.log('Completeesssss');

      setTimeout(async () => {
        if (isAdmin) {
          await goToQuestionScreen();
        } else {
          const networkState = NetInfo.fetch().then(async data => {
            let isOnline = data.isConnected;
            //This check is for offline mode to take the user back once story completes
            if (isOnline) {
              await callBookmarkApi();
            } else {
              showAlert(
                'Congratulations',
                'Your story is completed',
                'OK',
                (onPressed = async () => {
                  reset();
                  popScreen();
                }),
              );
            }
          });
        }
      }, 100);
    } else {
      if (
        (progress.position >= progress.duration && progress.duration != 0) ||
        curserInPara >= numberOfWordsInPara
      ) {
        TrackPlayer.pause();
        setimageUri(imagePath.play);

        pausePlayerOnPageChange();

        let nextPara = paragraphIndex + 1;
        // Skip para untill text para arrives
        while (true) {
          if (nextPara < paragraphs.length) {
            if (paragraphs[nextPara].type == 'text') {
              break;
            }
            nextPara += 1;
          } else {
            break;
          }
        }
        if (nextPara >= paragraphs.length) {
          return;
        }

        numberOfWordsInPara = paragraphs[nextPara].data.split(' ').length;

        setparagraphIndex(nextPara);
        setcurserInPara(0);
        numberOfWordsSkiped = 0;
        previousCurserInPara = 0;
        if (inputRef.current.hasNextPage()) {
          inputRef.current.goToPage(currentPageNumber + 1);
        }
      } else {
        if (wordsList.length > 0 && WordIndex < wordsList.length) {
          moveCursor();
        }
      }
    }
  }, [progress.position]);

  const toggleModal = () => {
    setRatingModalVisible(!isRatingModalVisible);
  };

  const callBookmarkApi = async () => {
    await reset();
    updateUserPreference(true, false);
    if (bookmarkValue != isBookmarked) {
      setLoading(true);
      addStoryToBookmark(
        story?.id,
        character.id,
        character.data?.name,
        story?.data?.cover_img_url,
        story.data?.title,
        story.data?.rating,
        story.data?.is_free,
      )
        .then(data => {
          setLoading(false);
          toggleModal();
        })
        .catch(err => {
          setLoading(false);
          toggleModal();
        });
    } else {
      toggleModal();
    }
  };

  const callBookmarkApiAndPop = async () => {
    await reset();
    if (bookmarkValue != isBookmarked) {
      setLoading(true);
      addStoryToBookmark(
        story?.id,
        character.id,
        character.data?.name,
        story?.data?.cover_img_url,
        story.data?.title,
        story.data?.rating,
        story.data?.is_free,
      )
        .then(data => {
          setLoading(false);
          popScreen();
        })
        .catch(err => {
          setLoading(false);
          popScreen();
        });
    } else {
      popScreen();
    }
  };

  const popScreen = () => {
    setTimeout(() => {
      navigation.pop();
    }, 100);
  };

  const resetTrackPlayer = async () => {
    await TrackPlayer.reset();

    let trackIndex = await TrackPlayer.getCurrentTrack();
    console.log('trackIndex ===', trackIndex);
    if (trackIndex > 0) {
      await TrackPlayer.remove(trackIndex - 1)
        .then(res => {
          console.log('track player removed successfully, ', res);
        })
        .catch(e => {
          console.log('track player remove error, ', e);
        });
    }
  };

  const reset = async (isPageOrNarratorChange = false, isUseEffect = false) => {
    setimageUri(imagePath.play);

    if (isUseEffect) {
      resetTrackPlayer();
    } else {
      await resetTrackPlayer();
    }

    WordIndex = 0;
    setcurserInPara(0);
    setcurserInPara1(0);
    if (isPageOrNarratorChange == false) {
      setparagraphIndex(0);
    }
  };

  const goToQuestionScreen = async () => {
    await reset();

    setTimeout(() => {
      Orientation.lockToPortrait();
    }, 600);

    setTimeout(() => {
      navigation.push('QuestionScreen', {
        characterID: character.id,
        characterImgURL: character.data?.half_animation_url,
        storyID: story.id,
        storyTitle: story.data.title,
        isAdmin: isAdmin,
      });
    }, 800);
  };

  const requestToPermissions = async () => {
    var selectedNarratorName = selectedNarrator?.name ?? '';
    selectedNarratorName = selectedNarratorName.replace('/ +/g', '');
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          startDownload(
            selectedNarrator?.audioContentList[paragraphIndex].url ?? '',
            selectedNarratorName,
            storyTitle,
            currentPageNumber,
          );
        }
      } else {
        startDownload(
          selectedNarrator?.audioContentList[paragraphIndex].url ?? '',
          selectedNarratorName,
          storyTitle,
          currentPageNumber,
        );
      }
    } catch (err) {
      console.log('i AM ERROR', err);
    }
  };

  const startDownload = async (
    fileUrl,
    folderName,
    filename,
    currentPageNumber,
  ) => {
    const android = RNFetchBlob.android;
    const {dirs} = RNFetchBlob.fs;
    const filepath =
      Platform.OS === 'android'
        ? dirs.DownloadDir +
          '/' +
          folderName +
          '/' +
          filename +
          '/' +
          currentPageNumber +
          '.mp3'
        : dirs.DocumentDir +
          '/' +
          folderName +
          '/' +
          filename +
          '/' +
          currentPageNumber +
          '.mp3';
    let exists = await RNFS.exists(filepath);
    if (exists) {
      changeTrackOnVoiceChange();
      playVoice();
    } else {
      setLoading(true);
      const downloadAppUrl = fileUrl;
      const configfb = {
        fileCache: true,
        useDownloadManager: true,
        notification: true,
        title: 'Great, download success',
        mime: 'application/vnd.android.package-archive',
        path: filepath,
      };
      const configOptions = Platform.select({
        ios: {
          fileCache: configfb.fileCache,
          title: configfb.title,
          path: configfb.path,
          appendExt: '.mp3',
        },
        android: configfb,
      });
      RNFetchBlob.config(configOptions)
        .fetch('GET', downloadAppUrl)
        .then(res => {
          setLoading(false);
          changeTrackOnVoiceChange();
          playVoice();
        })
        .catch(err => {
          console.log('error donwloading audio file ===', err);
          setLoading(false);
          Alert.alert(
            'Error',
            'An Error occured in downloading the audio file, please try again later...',
            [
              {
                text: 'OK',
                onPress: () => {
                  navigation.pop();
                },
              },
            ],
          );
        });
    }
  };

  const changeTrackOnVoiceChange = async () => {
    let path = getFilePath(
      selectedNarrator?.name ?? '',
      storyTitle,
      currentPageNumber,
    );
    await TrackPlayer.add({
      id: story.id,
      url: path,
      title: 'story',
      artist: 'readrly',
      artwork: path,
    });

    const tracks = await TrackPlayer.getQueue();

    if (tracks.length >= 0) {
      TrackPlayer.skipToNext();
    }

    let trackIndex = await TrackPlayer.getCurrentTrack();

    if (trackIndex > 0) {
      await TrackPlayer.remove(trackIndex - 1)
        .then(res => {})
        .catch(e => {});
    }
  };

  const playVoice = async () => {
    setShowPanel(false);
    if (isPageChanged) {
      const state = await TrackPlayer.getState();
      if (state === State.Playing) {
        TrackPlayer.pause();
        setimageUri(imagePath.play);
      } else {
        setimageUri(imagePath.pause);
        starTrack();
      }
    }
  };

  const starTrack = async () => {
    let path = getFilePath(
      selectedNarrator?.name ?? '',
      storyTitle,
      currentPageNumber,
    );
    const tracks = await TrackPlayer.getQueue();

    if (tracks.length == null || tracks.length < 0) {
      // Add a track to the queue
      await TrackPlayer.add({
        id: story.id,
        url: path,
        title: 'story',
        artist: 'readrly',
        artwork: path,
      });
    }
    if (
      userStoryPreference !== '' &&
      userStoryPreference !== null &&
      userStoryPreference !== undefined
    ) {
      if (userStoryPreference.seekTime !== 0) {
        await TrackPlayer.seekTo(userStoryPreference.seekTime);
      }
      await TrackPlayer.play();

      setUserStoryPreference(null);
    } else {
      await TrackPlayer.play();
    }
    await TrackPlayer.updateOptions({
      android: {
        // To Stop the Audio in Background
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
    });
  };

  const pausePlayerOnPageChange = async index => {
    setIsPageChanged(false);
    const state = await TrackPlayer.getState();
    if (state === State.Playing) {
      TrackPlayer.pause();
      setimageUri(imagePath.play);
    }
  };

  const getUserPreference = async () => {
    let storiesPreference = await getItem(AppConstants.userStoryPreference);
    if (
      storiesPreference != undefined &&
      storiesPreference != null &&
      storiesPreference != ''
    ) {
      try {
        let storiesList = JSON.parse(storiesPreference);
        let thisStory = storiesList.find(item => item.storyId === story.id);
        console.log('thisStory ===', thisStory);
        if (thisStory !== undefined && thisStory !== null) {
          continueReadingAlert(thisStory);
        } else {
          setUserStoryPreference('');
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setUserStoryPreference('');
    }
  };

  const continueReadingAlert = thisStory => {
    Alert.alert(
      'Continue Reading',
      'Do you want to continue reading where you left off?',
      [
        {
          text: 'Yes',
          onPress: () => {
            let page = thisStory.page;
            inputRef.current.goToPage(page);
            setUserStoryPreference(thisStory);
          },
        },
        {
          text: 'No',
          onPress: async () => {
            setUserStoryPreference('');
          },
        },
      ],
    );
  };

  const updateUserPreference = async (
    isStoryComplete = false,
    isPageChange = false,
  ) => {
    if (isStoryComplete) {
      removeStoryPreference(story.id);
    } else if (isPageChange) {
      updateStoryPreference(currentPageNumber, 0, story.id, 0, 0);
    } else {
      const position = await TrackPlayer.getPosition();
      updateStoryPreference(
        currentPageNumber,
        position,
        story.id,
        curserInPara,
        WordIndex,
      );
    }
  };

  const ratingPopupDismiss = async () => {
    updateUserLastReadStory(story.id);
    setRatingModalVisible(false);
    await goToQuestionScreen();
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.ui.lightPurple}}>
      {loading && <CustomActivityIndicator animate={loading} />}
      <View style={{flex: 1, paddingTop: 0}}>
        <FlipPage
          ref={inputRef}
          orientation={'horizontal'}
          onPageStartMoving={async () => {
            const state = await TrackPlayer.getState();
            if (state === State.Playing) {
              TrackPlayer.pause();
              setimageUri(imagePath.play);
            }
          }}
          onPageChange={async (pageIndex, direction) => {
            console.log('===================== onPageChange ===========');
            await reset(true);

            setparagraphIndex(pageIndex * 2);
            setIsPageChanged(true);
            setCurrentPageNumber(pageIndex);
          }}>
          {pageList.map((_, index) => (
            <FlipPagePage
              key={index}
              style={{backgroundColor: colors.ui.lightPurple, padding: 0}}>
              <View
                style={{
                  paddingTop: 15,
                  height: 60,
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity
                  onPress={async () => {
                    const networkState = NetInfo.fetch().then(async data => {
                      let isOnline = data.isConnected;
                      if (isOnline) {
                        await updateUserPreference();
                        await reset();
                        await callBookmarkApiAndPop();
                      } else {
                        await reset();
                        popScreen();
                      }
                    });
                  }}
                  style={{
                    marginTop: 0,
                    marginLeft: 0,
                    width: 100,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    style={{height: 16, width: 16}}
                    source={require('./back_icon.png')}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <View
                  style={{
                    width: height - 200,
                    marginTop: 15,
                    marginLeft: 100,
                    marginRight: 100,
                    height: 50,
                    zIndex: 1,
                    position: 'absolute',
                    textAlign: 'center',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      fontFamily: fonts.Bjola,
                      fontSize: 16,
                      fontWeight: '900',
                    }}>
                    {story.data?.title}
                  </Text>
                </View>
                <TouchableOpacity
                  style={{
                    marginTop: 0,
                    marginRight: 0,
                    width: 100,
                    height: 50,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    if (isAdmin) {
                      Alert.alert(
                        'Alert',
                        'Do you want to make this story active?',
                        [
                          {
                            text: 'Yes',
                            onPress: async () => {
                              setLoading(true);
                              updateStoryStatusByID(story.id, 'active').then(
                                async () => {
                                  setLoading(false);
                                  await reset();
                                  popScreen();
                                },
                              );
                            },
                          },
                          {
                            text: 'No',
                            onPress: () => {
                              console.log('no pressed');
                            },
                            style: 'cancel',
                          },
                        ],
                      );
                    } else {
                      const networkState = NetInfo.fetch().then(data => {
                        let isOnline = data.isConnected;
                        if (isOnline) {
                          setIsBookmarked(!isBookmarked);
                          setTimeout(() => {
                            setIsBookMarkToastVisible(false);
                          }, 800);
                          setIsBookMarkToastVisible(true);
                        } else {
                          showAlert(
                            (title = 'Error'),
                            (message =
                              'Please Turn ON internet connection to performe this operation'),
                            (buttonTitle = 'OK'),
                            (onPressed = () => {
                              console.log('ok pressed');
                            }),
                          );
                        }
                      });
                    }
                  }}>
                  {!isAdmin && (
                    <FastImage
                      source={
                        isAdmin
                          ? null
                          : isBookmarked
                          ? Images.bookmark_selected
                          : Images.bookmark_unselected
                      }
                      style={{width: 15, height: 15}}
                      resizeMode="contain"
                    />
                  )}
                  {isAdmin && <Text>Active</Text>}
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  setShowPanel(!showPanel);
                }}
                style={{
                  flexDirection: 'row',
                  backgroundColor: colors.ui.white,
                  borderRadius: 20,
                  borderColor: 'gray',
                  borderWidth: 1,
                  marginLeft: 50,
                  marginRight: 50,
                  marginTop: 10,
                  marginBottom: 180,
                  height: '70%',
                }}>
                <View
                  style={{
                    width: '49.8%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    key={index}
                    style={{
                      textAlign: 'justify',
                      margin: 10,
                    }}>
                    {paragraphs[index * 2].data
                      .split(' ')
                      .map((item, newIndex) => {
                        if (
                          index == paragraphIndex / 2 &&
                          (curserInPara == newIndex ||
                            curserInPara1 == newIndex) &&
                          isHighlight
                        ) {
                          return (
                            <Text
                              key={newIndex}
                              style={{
                                backgroundColor: colors.ui.lightPurple,
                                fontSize: 13,
                                fontFamily: fonts.Poppins_Regular,
                                fontWeight: '400',
                              }}>
                              {item}{' '}
                            </Text>
                          );
                        }
                        return (
                          <Text
                            style={{
                              fontSize: 13,
                              fontFamily: fonts.Poppins_Regular,
                              fontWeight: '400',
                            }}
                            key={newIndex}>
                            {item}{' '}
                          </Text>
                        );
                      })}
                  </Text>
                </View>
                <View
                  style={{
                    height: '100%',
                    backgroundColor: colors.ui.black,
                    borderColor: 'gray',
                    borderWidth: 2,
                    overflow: 'hidden',
                    shadowColor: 'blue',
                    shadowRadius: 10,
                    shadowOpacity: 0.9,
                    flex: 1,
                  }}></View>
                <View
                  style={{
                    width: '49.8%',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <FastImage
                    key={index}
                    resizeMode="stretch"
                    style={{
                      width: '100%',
                      height: '100%',
                      borderColor: colors.ui.black,
                      marginRight: 2,
                      borderWidth: 0.5,
                      borderBottomRightRadius: 20,
                      borderTopRightRadius: 20,
                      backgroundColor: colors.ui.white,
                    }}
                    reset
                    source={{uri: paragraphs[index * 2 + 1].data}}
                  />
                </View>
              </TouchableOpacity>
            </FlipPagePage>
          ))}
        </FlipPage>
      </View>

      {showPanel && (
        <View style={styles.bottomLayout}>
          <OptionModal
            visible={isModelVisible}
            onClose={() => {
              setisModalVisible(false);
            }}
            value={isHighlight}
            onValueChange={setisHighlight}
          />
          <OptionModalForVoice
            visible={isModelVoiceVisible}
            onClose={async (value, narrator) => {
              setisModalVoiceVisible(false);
              if (value) {
                await reset(true);
                setTimeout(() => {
                  setSelectedNarrator(narrator);
                }, 500);
              }
            }}
            onValueChange={(value, narrator) => {}}
            narratorList={narratorList}
            selectedNarrator={selectedNarrator}
          />
          <View style={{flexDirection: 'column', flex: 1}}>
            <Slider
              disabled={true}
              value={
                timeList.length === 0
                  ? 0
                  : ((timeList[currentPageNumber] + progress.position * 1000) /
                      (selectedNarrator?.audioTime ?? 0)) *
                    1
              }
              onSlidingComplete={async () => {
                // if (isAdmin) {
                //   await goToQuestionScreen();
                // } else {
                //   await callBookmarkApi();
                // }
              }}
              maximumValue={1}
              minimumValue={0}
              minimumTrackTintColor={'#8015E8'}
              maximumTrackTintColor={colors.ui.gray}
              style={{
                width: '60%',
                transform: [{scaleX: 1}, {scaleY: 1}],
                marginTop: 0,
                alignContent: 'center',
                alignSelf: 'center',
                alignItems: 'flex-start',
              }}
            />
            <View
              style={{
                flex: 1,
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                alignItems: 'flex-start',
                marginTop: -10,
              }}>
              <View style={styles.verticalLayoutRight}>
                <TouchableOpacity
                  onPress={async () => {
                    TrackPlayer.pause();
                    setimageUri(imagePath.play);
                    setisModalVisible(true);
                  }}
                  style={styles.noTouchableOpactiyBackground}>
                  <FastImage
                    source={imagePath.highlight}
                    style={styles.noImageBackgroundWithSize}
                    resizeMode="cover"
                  />
                  <Text style={styles.textStyle}>Highlight</Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  width: 160,
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  disabled={disabledBackwardButton}
                  onPress={async () => {
                    await skipToForwardBackWord((skip = 'Backward'));
                    await moveCursorBackWord();
                  }}
                  style={styles.noTouchableOpactiyBackground}>
                  <FastImage
                    source={imagePath.skipBackward}
                    style={styles.noImageBackgroundforSkip}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    playVoice();
                  }}
                  style={styles.playPauseButtonLayout}>
                  <FastImage
                    source={imageUri}
                    style={styles.playPauseImageLayout}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  disabled={disabledForwardButton}
                  onPress={async () => {
                    await skipToForwardBackWord((skip = 'Forward'));
                  }}
                  style={styles.noTouchableOpactiyBackground}>
                  <FastImage
                    source={imagePath.skipForward}
                    style={styles.noImageBackgroundforSkip}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.verticalLayoutLeft1}>
                <TouchableOpacity
                  onPress={async () => {
                    TrackPlayer.pause();
                    setimageUri(imagePath.play);
                    setisModalVoiceVisible(true);
                  }}
                  style={styles.noTouchableOpactiyBackground}>
                  <FastImage
                    source={imagePath.microphone}
                    style={styles.noImageBackgroundWithSize}
                    resizeMode="cover"
                  />
                  <Text style={styles.textStyle}>Voice</Text>
                </TouchableOpacity>

                {showDownloadLoader && <ActivityIndicator></ActivityIndicator>}

                {showDownloadButton && !showDownloadLoader && (
                  <TouchableOpacity
                    disabled={isDownloading ? true : false}
                    onPress={async () => {
                      setIsDownloading(true);
                      EventRegister.emit('Event', {
                        narratorList,
                        story,
                        pageList,
                        currentPageNumber,
                        paragraphIndex,
                      });
                    }}
                    style={styles.noTouchableOpactiyBackground}>
                    <FastImage
                      source={imagePath.download}
                      style={[
                        styles.noImageBackgroundWithSize,
                        {tintColor: '#272443'},
                      ]}
                      resizeMode="cover"
                    />
                    <Text style={styles.textStyle}>
                      {isDownloading ? 'Downloading' : 'Download'}
                    </Text>
                  </TouchableOpacity>
                )}

                {}
              </View>
            </View>
          </View>
        </View>
      )}

      <Modal
        supportedOrientations={['portrait', 'landscape']}
        transparent={true}
        visible={isBookMarkToastVisible}>
        <View style={styles.centeredView}>
          <View style={styles.bookmarkToast}>
            {isBookmarked ? (
              <Text style={styles.bookMarkToastText}>Added to Bookmark</Text>
            ) : (
              <Text style={styles.bookMarkToastText}>
                Removed from Bookmark
              </Text>
            )}
          </View>
        </View>
      </Modal>
      {isRatingModalVisible && (
        <StoryRatingPopup
          visible={isRatingModalVisible}
          story={story}
          onRateNowTapped={async () => {
            await ratingPopupDismiss();
          }}
          onNotNowTapped={async () => {
            await ratingPopupDismiss();
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  bottomLayout: {
    zIndex: 1,
    position: 'absolute',
    marginTop: width - 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: '100%',
    height: 100,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: '#999999',
    shadowOffset: {width: -3, height: -3},
    shadowOpacity: 0.8,
    shadowRadius: 3,
  },
  verticalLayoutLeft: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginLeft: 40,
    padding: 0,
  },
  verticalLayoutLeft1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    padding: 0,
  },
  verticalLayoutRight: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginRight: 35,
    marginTop: 0,
  },
  playPauseButtonLayout: {
    margin: 0,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    backgroundColor: '#D9C9F9',
    borderRadius: 27.5,
    borderColor: colors.ui.black,
    borderWidth: 1,
  },
  playPauseImageLayout: {
    width: 12,
    height: 13,
    backgroundColor: colors.ui.clear,
    tintColor: colors.ui.black,
  },
  noImageBackground: {
    width: 20,
    height: 23,
  },
  noImageBackgroundWithSize: {
    width: 17,
    height: 17,
    padding: 0,
    margin: 0,
  },
  noImageBackgroundforSkip: {
    width: 9.76,
    height: 8.54,
  },
  noTouchableOpactiyBackground: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    width: 70,
    height: 50,
  },
  textStyle: {
    justifyContent: 'center',
    textAlign: 'center',
    padding: 0,
    margin: 0,
    color: colors.ui.black,
    fontSize: 10,
  },
  bookmarkToast: {
    height: 46,
    width: 360,
    borderRadius: 8,
    justifyContent: 'center',
    backgroundColor: colors.ui.purple,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookMarkToastText: {
    textAlign: 'center',
    color: colors.ui.white,
    fontFamily: fonts.Poppins_Bold,
    fontSize: 15,
  },
});

export default AudioPlayer;
