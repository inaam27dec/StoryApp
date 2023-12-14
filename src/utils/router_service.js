import {Alert} from 'react-native';

export function openAudioPlayer(
  navigation,
  bookmarkValue = false,
  isHighlight = false,
  story,
  characterInfo,
  isAdmin,
) {
  if (
    story.data?.content === undefined ||
    story.data?.content === '' ||
    story.data?.content === null ||
    story.data?.audio_content === undefined ||
    story.data?.audio_content === '' ||
    story.data?.audio_content === null
  ) {
    Alert.alert(
      'Error',
      'The story is incomplete, please contact your support and try again.',
    );
    return false;
  } else {
    navigation.navigate('AudioPlayer', {
      bookmarkValue: bookmarkValue,
      isHighlightValue: isHighlight,
      story: story,
      character: characterInfo,
      isAdmin: isAdmin,
    });
  }
}
