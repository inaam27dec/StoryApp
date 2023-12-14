import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  RepeatMode,
} from 'react-native-track-player';

export async function setupPlayer() {
  let isSetup = false;
  try {
    await TrackPlayer.getCurrentTrack();
    isSetup = true;
  } catch {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      android: {
        appKilledPlaybackBehavior:
          AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
      },
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.SeekTo,
      ],
      compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
      ],
      progressUpdateEventInterval: 2,
    });

    isSetup = true;
  } finally {
    return isSetup;
  }
}

export async function addAllCorrectAnswersTrack(queueLength) {
  if (queueLength <= 0) {
    await TrackPlayer.add([
      {
        id: '1',
        url: require('../../assets/sounds/all_correct_answers.mp3'),
        title: 'Fluidity',
        artist: 'tobylane',
        artwork: 'artwork',
      },
    ]);
  }
  await TrackPlayer.setRepeatMode(RepeatMode.Track);
  TrackPlayer.play();
}

export async function addLeaderboardrack(queueLength) {
  if (queueLength <= 0) {
    await TrackPlayer.add([
      {
        id: '2',
        url: require('../../assets/sounds/leaderboard.mp3'),
        title: 'Fluidity',
        artist: 'tobylane',
        artwork: 'artwork',
      },
    ]);
  }
  await TrackPlayer.setRepeatMode(RepeatMode.Track);
  TrackPlayer.play();
}

export async function addCorrectAnswerTrack(queueLength) {
  if (queueLength <= 0) {
    await TrackPlayer.add([
      {
        id: '3',
        url: require('../../assets/sounds/correct_answer.mp3'),
        title: 'Fluidity',
        artist: 'tobylane',
        artwork: 'artwork',
      },
    ]);
  }
  await TrackPlayer.setRepeatMode(RepeatMode.Off);
  TrackPlayer.play();
}

export async function addWrongAnswerTrack(queueLength) {
  if (queueLength <= 0) {
    await TrackPlayer.add([
      {
        id: '4',
        url: require('../../assets/sounds/wrong_answer.mp3'),
        title: 'Fluidity',
        artist: 'tobylane',
        artwork: 'artwork',
      },
    ]);
  }
  await TrackPlayer.setRepeatMode(RepeatMode.Off);
  TrackPlayer.play();
}

export async function addQuestionTimeTrack(queueLength) {
  if (queueLength <= 0) {
    await TrackPlayer.add([
      {
        id: '5',
        url: require('../../assets/sounds/question_time.mp3'),
        title: 'Fluidity',
        artist: 'tobylane',
        artwork: 'artwork',
      },
    ]);
  }
  await TrackPlayer.setRepeatMode(RepeatMode.Track);
  TrackPlayer.play();
}

export async function addOnBoardingTrack(queueLength) {
  if (queueLength <= 0) {
    await TrackPlayer.add([
      {
        id: '6',
        url: require('../../assets/sounds/on_boarding.mp3'),
        title: 'Fluidity',
        artist: 'tobylane',
        artwork: 'artwork',
      },
    ]);
  }
  await TrackPlayer.setRepeatMode(RepeatMode.Track);
  TrackPlayer.play();
}

export async function getTrackPlayerQueue() {
  const queue = await TrackPlayer.getQueue();
  return queue;
}

export async function resetTrackPlayer() {
  TrackPlayer.pause();
  TrackPlayer.reset();
}

// export async function playbackService() {
//   TrackPlayer.addEventListener(Event.RemotePause, () => {
//     console.log('Event.RemotePause');
//     TrackPlayer.pause();
//   });

//   TrackPlayer.addEventListener(Event.RemotePlay, () => {
//     console.log('Event.RemotePlay');
//     TrackPlayer.play();
//   });

//   TrackPlayer.addEventListener(Event.RemoteNext, () => {
//     console.log('Event.RemoteNext');
//     TrackPlayer.skipToNext();
//   });

//   TrackPlayer.addEventListener(Event.RemotePrevious, () => {
//     console.log('Event.RemotePrevious');
//     TrackPlayer.skipToPrevious();
//   });
// }
