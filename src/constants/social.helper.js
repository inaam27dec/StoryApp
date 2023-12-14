import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {firebase, updatePassword} from '@react-native-firebase/auth';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import firestore from '@react-native-firebase/firestore';
import dbConstants from './dbConstants';
import {getItem, setItem} from './helper';
import {
  AppConstants,
  DateFormats,
  InAppConstants,
  MLURLS,
  SubscriptionType,
} from './app.constants';
import {LoginManager} from 'react-native-fbsdk';
import {Alert, Platform} from 'react-native';
import moment from 'moment';
import axios from 'axios';
import * as RNIap from 'react-native-iap';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GoogleLogin = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userData = await GoogleSignin.signIn();
    const credential = firebase.auth.GoogleAuthProvider.credential(
      userData.idToken,
    );
    const firebaseUserCredential = await firebase
      .auth()
      .signInWithCredential(credential);
    return {
      firebaseCred: firebaseUserCredential,
      password: userData.idToken,
    };
  } catch (error) {
    return 0;
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
      console.log(error);
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (e.g. sign in) is in progress already
      console.log(error);
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
      console.log(error);
    } else {
      // some other error happened
      console.log(error);
    }
    return 'error';
  }
};

export const AppleLogin = async () => {
  // performs login request
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });
  console.log('Hello', appleAuthRequestResponse);
  // Ensure Apple returned a user identityToken
  if (!appleAuthRequestResponse.identityToken) {
    throw new Error('Apple Sign-In failed - no identify token returned');
  }
  // Create a Firebase credential from the response
  const {identityToken, nonce} = appleAuthRequestResponse;
  const appleCredential = firebase.auth.AppleAuthProvider.credential(
    identityToken,
    nonce,
  );
  console.log(appleCredential);
  // Sign the user in with the credential
  const firebaseUserCredential = await firebase
    .auth()
    .signInWithCredential(appleCredential);
  console.log(firebaseUserCredential);

  return {
    firebaseCred: firebaseUserCredential,
    password: identityToken,
  };
};

export const fbLogin = resCallBack => {
  LoginManager.logOut();
  return LoginManager.logInWithPermissions(['email', 'public_profie']).then(
    result => {
      console.log('fb result ====>>>>', result);
      if (
        result.declinedPermissions &&
        result.declinedPermissions.includes('email')
      ) {
        resCallBack({message: 'Email is required'});
      }
      if (result.isCancelled) {
        console.log('error');
      } else {
        const infoRequest = new GraphRequest(
          '/me?fields=email,name,picture',
          null,
          resCallBack,
        );
        new GraphRequestManager().addRequest(infoRequest).start();
      }
    },
    function (error) {
      console.log('Login failed with error' + error);
    },
  );
};

export const getUserInfoFromFirebase = async id => {
  let response = '';
  return firestore()
    .collection(dbConstants.USER)
    .doc(id)
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
        let dob = documentSnapshot.data().dob;
        let email = documentSnapshot.data().email_address;
        let isEnabled = documentSnapshot.data().is_enabled;
        let loginMethod = documentSnapshot.data().login_method;
        let name = documentSnapshot.data().name;
        let profilePic = documentSnapshot.data().profile_pic;
        let userType = documentSnapshot.data().user_type;

        response = {
          dob: dob,
          email: email,
          isEnabled: isEnabled,
          loginMethod: loginMethod,
          name: name,
          profilePic: profilePic,
          userType: userType,
        };
      }
      return response;
    })
    .catch(error => {
      console.log(error);
      return response;
    });
};

const updateFCMTokenToFirebase = async (id, token) => {
  let response = '';
  return firestore()
    .collection(dbConstants.USER)
    .doc(id)
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
        //we are saving profile picture from our DB if the record exists

        let dob = documentSnapshot.data().dob;
        let email = documentSnapshot.data().email_address;
        let isEnabled = documentSnapshot.data().is_enabled;
        let loginMethod = documentSnapshot.data().login_method;
        let name = documentSnapshot.data().name;
        let password = documentSnapshot.data().password;
        let profilePic = documentSnapshot.data().profile_pic;

        return firestore()
          .collection(dbConstants.USER)
          .doc(id)
          .update({
            name: name,
            email_address: email,
            password: password,
            dob: dob,
            profile_pic: profilePic,
            is_enabled: isEnabled,
            login_method: loginMethod,
            fcm_token: token,
          })
          .then(() => {
            response = 'success';
            return response;
          })
          .catch(error => {
            console.log(error);
            response = 'error';
            return response;
          });
      }
    });
};

export const addFCMToken = async id => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  console.log('FCM Token before login === ', fcmToken);
  let response = await updateFCMTokenToFirebase(id, fcmToken);
  return response;
};

export const removeFCMToken = async () => {
  let userID = await getItem(AppConstants.userID);
  let response = await updateFCMTokenToFirebase(userID, '');
  return response;
};

export const addUserToDatabase = async (
  id,
  name,
  email,
  password,
  dob,
  photoURL,
  loginMethod,
) => {
  let response = '';
  return firestore()
    .collection(dbConstants.USER)
    .doc(id)
    .get()
    .then(documentSnapshot => {
      if (documentSnapshot.exists) {
        //we are saving profile picture from our DB if the record exists

        let profilePicURLFromDB = documentSnapshot.data().profile_pic;
        let dobFromDB = documentSnapshot.data().dob;
        let userName = documentSnapshot.data().name ?? '';
        return firestore()
          .collection(dbConstants.USER)
          .doc(id)
          .update({
            // name: name,
            name: userName,
            email_address: email,
            password: password,
            // dob: dob,
            // profile_pic: photoURL,
            dob: dobFromDB,
            profile_pic: profilePicURLFromDB,
            is_enabled: true,
            login_method: loginMethod,
          })
          .then(() => {
            setItem(AppConstants.userID, id);
            response = 'success';
            return response;
          })
          .catch(error => {
            console.log(error);
            response = 'error';
            return response;
          });
      } else {
        return firestore()
          .collection(dbConstants.USER)
          .doc(id)
          .set({
            name: name,
            email_address: email,
            password: password,
            dob: dob,
            profile_pic: photoURL,
            is_enabled: true,
            login_method: loginMethod,
          })
          .then(() => {
            setItem(AppConstants.userID, id);
            response = 'success';

            return firestore()
              .collection(dbConstants.USER)
              .doc(id)
              .collection(dbConstants.PREFERENCES)
              .doc(id)
              .set({
                is_highlighting_enabled: true,
                is_male_voice: false,
                is_female_voice: true,
              })
              .then(data => {
                response = 'success';
                return response;
              })
              .catch(error => {
                console.log(error);
                response = 'error';
                return response;
              });
          })
          .catch(error => {
            console.log(error);
            response = 'error';
            return response;
          });
      }
    });
  // .finally(() => {
  // return response;
  // });
};

export const getUserPreferenceFromDatabase = async () => {
  let data = await getItem(AppConstants.userID);
  let documentSnapshot = await firestore()
    .collection(dbConstants.USER)
    .doc(data)
    .collection(dbConstants.PREFERENCES)
    .doc(data)
    .get();
  if (documentSnapshot.exists) {
    return documentSnapshot.data();
  }
};
export const updateUserHighlightPreference = async flag => {
  let data = await getItem(AppConstants.userID);
  await firestore()
    .collection(dbConstants.USER)
    .doc(data)
    .collection(dbConstants.PREFERENCES)
    .doc(data)
    .update({
      is_highlighting_enabled: flag,
    })
    .then(() => {
      setItem(AppConstants.userHighlightPreference, flag);
    });
};

export const updateUserMaleVoicePreference = async flag => {
  let data = await getItem(AppConstants.userID);
  await firestore()
    .collection(dbConstants.USER)
    .doc(data)
    .collection(dbConstants.PREFERENCES)
    .doc(data)
    .update({
      is_male_voice: flag,
    })
    .then(() => {
      setItem(AppConstants.userMaleVoicePreference, flag);
    });
};
export const updateUserFemaleVoicePreference = async flag => {
  let data = await getItem(AppConstants.userID);
  await firestore()
    .collection(dbConstants.USER)
    .doc(data)
    .collection(dbConstants.PREFERENCES)
    .doc(data)
    .update({
      is_female_voice: flag,
    })
    .then(() => {
      setItem(AppConstants.userFemaleVoicePreference, flag);
    });
};
const updateUserStoryPreference = async str => {
  let data = await getItem(AppConstants.userID);
  await firestore()
    .collection(dbConstants.USER)
    .doc(data)
    .collection(dbConstants.PREFERENCES)
    .doc(data)
    .update({
      stories: str,
    })
    .then(() => {
      setItem(AppConstants.userStoryPreference, str);
    });
};

export const removeStoryPreference = async storyId => {
  let storiesPreference = await getItem(AppConstants.userStoryPreference);
  if (
    storiesPreference === undefined ||
    storiesPreference === null ||
    storiesPreference === ''
  ) {
    storiesPreference = '';
  }
  var storiesList =
    storiesPreference === '' ? [] : JSON.parse(storiesPreference);
  let updatedList = storiesList.filter(obj => obj.storyId !== storyId);

  if (updatedList !== undefined && updatedList !== null) {
    storiesList = updatedList;
    const myObjStr = JSON.stringify(storiesList);
    updateUserStoryPreference(myObjStr);
  }
};

export const updateStoryPreference = async (
  pageIndex,
  seekTime = 0,
  storyId,
  cursorInPara,
  WordIndex,
) => {
  let storiesPreference = await getItem(AppConstants.userStoryPreference);
  if (
    storiesPreference === undefined ||
    storiesPreference === null ||
    storiesPreference === ''
  ) {
    storiesPreference = '';
  }
  let storiesList =
    storiesPreference === '' ? [] : JSON.parse(storiesPreference);
  let index = storiesList.findIndex(obj => obj.storyId === storyId);
  if (index !== undefined && index != null && index !== -1) {
    const updatedItem = {
      storyId: storyId,
      page: pageIndex,
      seekTime: seekTime,
      cursorInPara: cursorInPara,
      lastWordIndex: WordIndex,
    };
    storiesList[index] = updatedItem;
    const myObjStr = JSON.stringify(storiesList);
    updateUserStoryPreference(myObjStr);
  } else {
    const newItem = {
      storyId: storyId,
      page: pageIndex,
      seekTime: seekTime,
      cursorInPara: cursorInPara,
      lastWordIndex: WordIndex,
    };
    storiesList = [...storiesList, newItem];
    const myObjStr = JSON.stringify(storiesList);
    updateUserStoryPreference(myObjStr);
  }
};

export const updateUserToDatabase = (
  name,
  childName,
  email,
  password,
  dob,
  photoURL,
) => {
  getItem(AppConstants.userID).then(data => {
    firestore()
      .collection(dbConstants.USER)
      .doc(data)
      .update({
        name: name,
        child_name: childName,
        email_address: email,
        password: password,
        dob: dob,
        profile_pic: photoURL,
      })
      .then(() => {
        console.log('User updated!');
      });
  });
};

export const updateUserLastReadStory = storyId => {
  getItem(AppConstants.userID).then(data => {
    firestore()
      .collection(dbConstants.USER)
      .doc(data)
      .update({
        last_read_story: storyId,
      })
      .then(() => {
        console.log('User updated!');
      });
  });
};

export const updateUserPasswordForFirebaseAuthentication = password => {
  firebase
    .auth()
    .currentUser.updatePassword(password)
    .then(() => {
      console.log('Password Updated');
    })
    .catch(error => {
      console.log(error);
    });
};

export const deleteAccount = async (email, password) => {
  const credential = firebase.auth.EmailAuthProvider.credential(
    email,
    password,
  );
  const user = firebase.auth().currentUser;
  return user
    .reauthenticateWithCredential(credential)
    .then(async () => {
      try {
        await user.delete();
        let userId = await getItem(AppConstants.userID);
        await firestore().collection(dbConstants.USER).doc(userId).delete();
        await deleteAllDependenciesAfterDeleteAccount();
        return 'success';
      } catch (error) {
        console.log(error);
        return error.message;
      }
    })
    .catch(e => {
      console.log('error in deleting account====', e);
      return e.message;
    });
};

export const deleteGoogleAccount = async (email, password) => {
  const userData = await GoogleSignin.signIn();
  const credential = firebase.auth.GoogleAuthProvider.credential(
    userData.idToken,
  );
  const user = firebase.auth().currentUser;
  return user
    .reauthenticateWithCredential(credential)
    .then(async () => {
      try {
        await user.delete();
        let userId = await getItem(AppConstants.userID);
        await firestore().collection(dbConstants.USER).doc(userId).delete();
        await deleteAllDependenciesAfterDeleteAccount();
        return 'success';
      } catch (error) {
        console.log(error);
        return error.message;
      }
    })
    .catch(e => {
      console.log('error in deleting account====', e);
      return e.message;
    });
};

export const deleteAppleAccount = async (email, password) => {
  const appleAuthRequestResponse = await appleAuth.performRequest({
    requestedOperation: appleAuth.Operation.LOGIN,
    requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
  });
  console.log('Hello', appleAuthRequestResponse);
  // Ensure Apple returned a user identityToken
  if (!appleAuthRequestResponse.identityToken) {
    throw new Error('Apple Sign-In failed - no identify token returned');
  }
  // Create a Firebase credential from the response
  const {identityToken, nonce} = appleAuthRequestResponse;
  const appleCredential = firebase.auth.AppleAuthProvider.credential(
    identityToken,
    nonce,
  );

  const user = firebase.auth().currentUser;
  return user
    .reauthenticateWithCredential(appleCredential)
    .then(async () => {
      try {
        await user.delete();
        let userId = await getItem(AppConstants.userID);
        await firestore().collection(dbConstants.USER).doc(userId).delete();
        await deleteAllDependenciesAfterDeleteAccount();
        return 'success';
      } catch (error) {
        console.log(error);
        return error.message;
      }
    })
    .catch(e => {
      console.log('error in deleting account====', e);
      return e.message;
    });
};

export const deleteAllDependenciesAfterDeleteAccount = async () => {
  let userId = await getItem(AppConstants.userID);

  //from subscriptions
  let querySnapshot = await firestore()
    .collection(dbConstants.SUBSCRIPTIONS)
    .get();
  if (querySnapshot._docs.length !== 0) {
    querySnapshot.forEach(async documentSnapshot => {
      let data = documentSnapshot._data;
      if (data.userID === userId) {
        await firestore()
          .collection(dbConstants.SUBSCRIPTIONS)
          .doc(documentSnapshot.id)
          .delete();
      }
    });
  }

  //from leaderboard
  let querySnapshot2 = await firestore()
    .collection(dbConstants.LEADERBOARD)
    .get();
  if (querySnapshot2._docs.length !== 0) {
    querySnapshot2.forEach(async documentSnapshot => {
      let data = documentSnapshot._data;
      if (data.userID === userId) {
        await firestore()
          .collection(dbConstants.LEADERBOARD)
          .doc(documentSnapshot.id)
          .delete();
      }
    });
  }

  //from bookmark
  let querySnapshot3 = await firestore().collection(dbConstants.BOOKMARK).get();
  if (querySnapshot3._docs.length !== 0) {
    querySnapshot3.forEach(async documentSnapshot => {
      let data = documentSnapshot._data;
      if (data.userID === userId) {
        await firestore()
          .collection(dbConstants.BOOKMARK)
          .doc(documentSnapshot.id)
          .delete();
      }
    });
  }

  //again deleting from USER table if there is any record of this userid
  let querySnapshot4 = await firestore().collection(dbConstants.USER).get();
  if (querySnapshot4._docs.length !== 0) {
    querySnapshot3.forEach(async documentSnapshot => {
      let data = documentSnapshot._data;
      if (data.userID === userId) {
        await firestore()
          .collection(dbConstants.USER)
          .doc(documentSnapshot.id)
          .delete();
      }
    });
  }
};

export const getWordTimesStamp = async () => {
  // https://flask-fire-e7iijj2yba-uc.a.run.app/wordtimestamp
  let response = await fetch(
    'https://flask-fire-e7iijj2yba-uc.a.run.app/wordtimestamp',
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://firebasestorage.googleapis.com/v0/b/readrly.appspot.com/o/storyvoices%2F0oguTZuvhc4IXEsuFfJi%2Ffemale%2Fstory.mp3?alt=media&token=2feae4ae-89a5-4211-abe4-4f30005af4e',
      }),
    },
  );

  return response;
};

export const getUserFromDatabase = async () => {
  let data = await getItem(AppConstants.userID);
  let documentSnapshot = await firestore()
    .collection(dbConstants.USER)
    .doc(data)
    .get();
  if (documentSnapshot.exists) {
    return documentSnapshot.data();
  }
};

export const getAgeGroups = async () => {
  let dataArray = [];
  let querySnapshot = await firestore()
    .collection(dbConstants.AGE_GROUPS)
    .get();
  querySnapshot.forEach(documentSnapshot => {
    let data = documentSnapshot.data();
    dataArray.push({
      id: documentSnapshot.id,
      data: data,
    });
  });
  return dataArray;
};

export const getCharacters = async () => {
  let dataArray = [];

  let querySnapshot = await firestore()
    .collection(dbConstants.CHARACTERS)
    .where('status', '==', 'active')
    .get();
  querySnapshot.forEach(documentSnapshot => {
    let data = documentSnapshot.data();
    dataArray.push({
      id: documentSnapshot.id,
      data: data,
    });
  });
  return dataArray;
};

export const getCharacterByID = async id => {
  let documentSnapshot = await firestore()
    .collection(dbConstants.CHARACTERS)
    .doc(id)
    .get();
  return {
    id: id,
    data: documentSnapshot._data,
  };
};

export const getGenres = async () => {
  let dataArray = [];

  let querySnapshot = await firestore().collection(dbConstants.GENRES).get();
  querySnapshot.forEach(documentSnapshot => {
    let data = documentSnapshot.data();
    dataArray.push({
      id: documentSnapshot.id,
      data: data,
    });
  });
  return dataArray;
};

export const getNarrators = async () => {
  let dataArray = [];
  let querySnapshot = await firestore().collection(dbConstants.NARRATORS).get();
  querySnapshot.forEach(documentSnapshot => {
    let data = documentSnapshot._data;
    dataArray.push({
      id: documentSnapshot.id,
      data: data,
    });
  });
  return dataArray;
};

export const getStoriesByCharacterID = async id => {
  let dataArray = [];
  let querySnapshot = await firestore()
    .collection(dbConstants.STORY)
    .where('character_id', '==', id)
    .where('status', '==', 'active')
    .get();
  querySnapshot.forEach(documentSnapshot => {
    let data = documentSnapshot._data;
    dataArray.push({
      id: documentSnapshot.id,
      data: data,
    });
  });
  return dataArray;
};

export const getStories = async () => {
  let dataArray = [];
  let querySnapshot = await firestore().collection(dbConstants.STORY).get();
  querySnapshot.forEach(documentSnapshot => {
    let data = documentSnapshot._data;
    dataArray.push({
      id: documentSnapshot.id,
      data: data,
    });
  });
  return dataArray;
};

export const getLatestStories = async () => {
  let dataArray = [];
  // const start = new Date('2023-01-05T09:36:56.249Z');
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  let querySnapshot = await firestore()
    .collection(dbConstants.STORY)
    .where('status', '==', 'active')
    .where('published_at', '>', sevenDaysAgo)
    .get();

  querySnapshot.forEach(documentSnapshot => {
    let data = documentSnapshot._data;
    dataArray.push({
      id: documentSnapshot.id,
      data: data,
    });
  });
  if (dataArray.length > 0) {
    return dataArray;
  } else {
    dataArray = [];
    let querySnapshot2 = await firestore()
      .collection(dbConstants.STORY)
      .where('status', '==', 'active')
      .orderBy('published_at', 'desc')
      .get();

    querySnapshot2.forEach(documentSnapshot => {
      let data = documentSnapshot._data;
      dataArray.push({
        id: documentSnapshot.id,
        data: data,
      });
    });

    if (dataArray.length > 0) {
      let slicedArray = dataArray.slice(0, 10);
      return slicedArray;
    } else {
      dataArray = [];
      let querySnapshot3 = await firestore()
        .collection(dbConstants.STORY)
        .where('status', '==', 'active')
        .orderBy('created_at', 'desc')
        .get();

      querySnapshot3.forEach(documentSnapshot => {
        let data = documentSnapshot._data;
        dataArray.push({
          id: documentSnapshot.id,
          data: data,
        });
      });

      let slicedArray = dataArray.slice(0, 10);
      return slicedArray;
    }
  }
};

export const updateStoryStatusByID = async (id, status) => {
  await firestore().collection(dbConstants.STORY).doc(id).update({
    status: status,
  });
};

export const getStoryByID = async id => {
  let documentSnapshot = await firestore()
    .collection(dbConstants.STORY)
    .doc(id)
    .get();
  return {
    id: id,
    data: documentSnapshot._data,
  };
};

export const updateStoryRatingByID = async (id, rating, no_of_ratings) => {
  await firestore().collection(dbConstants.STORY).doc(id).update({
    no_of_ratings: no_of_ratings,
    rating: rating,
  });
  let bookmarkIdsArray = await getBookMarkId(id);
  if (bookmarkIdsArray.length === 0) {
    //this story does not exist in the bookmarks, so no need to update the rating
    console.log('not exist bookmark');
  } else {
    let bookmarkId = bookmarkIdsArray[0].id;
    await firestore().collection(dbConstants.BOOKMARK).doc(bookmarkId).update({
      story_rating: rating,
    });
  }
};

export const getStoryQuestions = async id => {
  let dataArray = [];
  let querySnapshot = await firestore()
    .collection(dbConstants.STORY)
    .doc(id)
    .collection(dbConstants.QUESTIONS)
    .orderBy('question_number', 'asc')
    .get();
  querySnapshot.forEach(documentSnapshot => {
    let data = documentSnapshot._data;
    dataArray.push({
      id: documentSnapshot.id,
      data: data,
    });
  });
  return dataArray;
};

export const addStoryPointsToLeaderBoard = async (
  storyID,
  characterID,
  character_img_url,
  story_title,
  story_points,
  totalPoints,
) => {
  console.log(
    storyID,
    characterID,
    character_img_url,
    story_title,
    story_points,
    totalPoints,
  );
  let userID = await getItem(AppConstants.userID);
  let querySnapshot = await firestore()
    .collection(dbConstants.LEADERBOARD)
    .get();

  if (querySnapshot._docs.length == 0) {
    firestore()
      .collection(dbConstants.LEADERBOARD)
      .add({
        storyID: storyID,
        characterID: characterID,
        character_img_url: character_img_url,
        story_title: story_title,
        story_points: story_points,
        totalPoints: totalPoints,
        created_at: new Date(),
        userID: userID,
      })
      .then(() => {
        console.log('Points Added');
        return;
      });
  } else {
    var isFound = false;
    var id = -1;
    querySnapshot.forEach(documentSnapshot => {
      let data = documentSnapshot._data;
      if (data.storyID == storyID && data.userID == userID) {
        id = documentSnapshot.id;
        isFound = true;
      }
    });

    if (isFound) {
      firestore()
        .collection(dbConstants.LEADERBOARD)
        .doc(id)
        .update({
          story_points: story_points,
          totalPoints: totalPoints,
          created_at: new Date(),
        })
        .then(() => {
          console.log('Points Updated');
          return;
        });
    } else {
      firestore()
        .collection(dbConstants.LEADERBOARD)
        .add({
          storyID: storyID,
          characterID: characterID,
          character_img_url: character_img_url,
          story_title: story_title,
          story_points: story_points,
          totalPoints: totalPoints,
          created_at: new Date(),
          userID: userID,
        })
        .then(() => {
          console.log('Points Added');
          return;
        });
    }
  }
};

export const getLeaderBoardByUserID = async () => {
  let userID = await getItem(AppConstants.userID);
  let dataArray = [];
  let querySnapshot = await firestore()
    .collection(dbConstants.LEADERBOARD)
    .where('userID', '==', userID)
    .orderBy('created_at', 'desc')
    .get();
  querySnapshot.forEach(documentSnapshot => {
    let data = documentSnapshot._data;
    dataArray.push({
      id: documentSnapshot.id,
      data: data,
    });
  });
  return dataArray;
};

export const addStoryToBookmark = async (
  storyID,
  characterID,
  characterName,
  character_img_url,
  story_title,
  story_rating,
  is_free,
) => {
  console.log('inside db func');
  console.log(
    storyID,
    characterID,
    characterName,
    character_img_url,
    story_title,
    story_rating,
    is_free,
  );
  let userID = await getItem(AppConstants.userID);
  let isBookmarked = false;
  let querySnapshot = await firestore().collection(dbConstants.BOOKMARK).get();
  if (querySnapshot._docs.length == 0) {
    let data = await firestore().collection(dbConstants.BOOKMARK).add({
      storyID: storyID,
      characterID: characterID,
      characterName: characterName,
      character_img_url: character_img_url,
      story_title: story_title,
      story_rating: story_rating,
      is_free: is_free,
      created_at: new Date(),
      userID: userID,
    });
    console.log('Added');
    isBookmarked = true;
    return isBookmarked;
  } else {
    var isFound = false;
    var id = -1;
    querySnapshot.forEach(documentSnapshot => {
      let data = documentSnapshot._data;
      if (data.storyID == storyID && data.userID == userID) {
        id = documentSnapshot.id;
        isFound = true;
      }
    });

    if (isFound) {
      await firestore().collection(dbConstants.BOOKMARK).doc(id).delete();
      isBookmarked = false;
      return isBookmarked;
    } else {
      console.log(
        storyID,
        characterID,
        characterName,
        character_img_url,
        story_title,
        story_rating,
        is_free,
        userID,
      );
      await firestore().collection(dbConstants.BOOKMARK).add({
        storyID: storyID,
        characterID: characterID,
        characterName: characterName,
        character_img_url: character_img_url,
        story_title: story_title,
        story_rating: story_rating,
        is_free,
        created_at: new Date(),
        userID: userID,
      });
      isBookmarked = true;
      return isBookmarked;
    }
  }
};

export const getBookMarksByUserID = async () => {
  let userID = await getItem(AppConstants.userID);
  let dataArray = [];
  let querySnapshot = await firestore()
    .collection(dbConstants.BOOKMARK)
    .where('userID', '==', userID)
    .orderBy('created_at', 'desc')
    .get();
  querySnapshot.forEach(documentSnapshot => {
    let data = documentSnapshot._data;
    dataArray.push({
      id: documentSnapshot.id,
      data: data,
    });
  });
  return dataArray;
};

export const isBookMarkExists = async storyID => {
  let userID = await getItem(AppConstants.userID);
  let querySnapshot = await firestore()
    .collection(dbConstants.BOOKMARK)
    .where('userID', '==', userID)
    .where('storyID', '==', storyID)
    .get();
  if (querySnapshot._docs.length == 0) {
    return false;
  } else {
    return true;
  }
};

export const getBookMarkId = async storyID => {
  let dataArray = [];
  let userID = await getItem(AppConstants.userID);
  let querySnapshot = await firestore()
    .collection(dbConstants.BOOKMARK)
    .where('userID', '==', userID)
    .where('storyID', '==', storyID)
    .get();
  querySnapshot.forEach(documentSnapshot => {
    dataArray.push({
      id: documentSnapshot.id,
    });
  });
  return dataArray;
};

// export const checkEitherSubscriptionExpired = async () => {
//   let dataArray = await getAllSubscriptions();
//   let userID = await getItem(AppConstants.userID);
//   console.log('dataArray = ', dataArray);
//   console.log('userID = ', userID);

//   let currentUserSubscription = dataArray.find(
//     item => item.data.userID === userID,
//   );

//   console.log('currentUserSubscription = ', currentUserSubscription.data);
//   let timeOfPurchase = currentUserSubscription.data.transactionDateTimeStamp;
//   // let timeOfPurchase = '1665301491000';
//   let currentTimestamp = moment(Date.now());
//   var isExpired = false;
//   let intTimeStamp = parseInt(timeOfPurchase, 10);
//   console.log('intTimeStamp =', intTimeStamp);

//   var timeStampDate = moment(new Date(intTimeStamp).getTime());
//   console.log('timeStampDate = ', timeStampDate);
//   var purchaseLocalDate = moment
//     .utc(timeStampDate)
//     .local()
//     .format(DateFormats.T_FORMAT);
//   console.log('purchaseLocalDate = ', purchaseLocalDate);

//   if (
//     currentUserSubscription.data.subscriptionType === SubscriptionType.monthly
//   ) {
//     const expiryDateOfMonth = moment(new Date(purchaseLocalDate)).add(
//       720,
//       'hours',
//     ); // 30 days hours is equal to 720

//     console.log('currentTimestamp = ', currentTimestamp);
//     console.log('expiredDate = ', expiryDateOfMonth);

//     if (currentTimestamp < expiryDateOfMonth) {
//       isExpired = false;
//       console.log(
//         'monthly subscription expire nhi hui ha ====================',
//       );
//       // setItem(AppConstants.isSubscriptionEnabled, true);
//       setItem(AppConstants.isSubscriptionEnabled, false);
//     } else {
//       isExpired = true;
//       console.log('monthly subscription expire ho gyi ha ====================');
//       setItem(AppConstants.isSubscriptionEnabled, false);
//     }
//   } else {
//     const expiryDateOfMonth = moment(new Date(purchaseLocalDate)).add(
//       8760,
//       'hours',
//     ); // 365 days hours is equal to 8760
//     console.log('purchaeExpiryDate = ', expiryDateOfMonth);

//     if (currentTimestamp < expiryDateOfMonth) {
//       isExpired = false;
//       console.log('yearly subscription expire nhi hui ha ====================');
//       // setItem(AppConstants.isSubscriptionEnabled, true);
//       setItem(AppConstants.isSubscriptionEnabled, false);
//     } else {
//       isExpired = true;
//       console.log('yearly subscription expire ho gyi ha ====================');
//       setItem(AppConstants.isSubscriptionEnabled, false);
//     }
//   }
//   return isExpired;
// };

// export const checkEitherSubscriptionExpired = async () => {
//   if (Platform.OS === 'ios') {
//     console.log('inside checkEitherSubscriptionExpired 1');

//     const availablePurchases = await RNIap.getAvailablePurchases();
//     console.log(
//       'getAvailablePurchases response length= ',
//       availablePurchases.length,
//     );
//     const sortedAvailablePurchases = availablePurchases.sort(
//       (a, b) => b.transactionDate - a.transactionDate,
//     );
//     const latestAvailableReceipt =
//       sortedAvailablePurchases[0].transactionReceipt;

//     let isSubscriptionActive = await getVerifyReceiptResponseFromApple(
//       latestAvailableReceipt,
//     );
//     console.log('checkEitherSubscriptionExpired ===', isSubscriptionActive);
//     return isSubscriptionActive;
//   } else {
//     console.log('inside checkEitherSubscriptionExpired 2');
//     const availablePurchases1 = await RNIap.getAvailablePurchases();
//     console.log('availablePurchases ===', availablePurchases1);
//   }
// };

// const getVerifyReceiptResponseFromApple = async receiptStr => {
//   // console.log('getVerifyReceiptResponseFromApple receiptStr ===', receiptStr);
//   var appleURL = '';
//   if (__DEV__) {
//     appleURL = InAppConstants.iOSSandboxURL;
//   } else {
//     appleURL = InAppConstants.iOSProductionURL;
//   }
//   const response = await axios.post(appleURL, {
//     'receipt-data': receiptStr,
//     password: InAppConstants.iOSSecretPassword,
//   });

//   if (response != null) {
//     var latestReceiptInfo = response.data.latest_receipt_info;
//     console.log(
//       'latest_receipt_info count after removing cancelled subscription =',
//       latestReceiptInfo.length,
//     );

//     latestReceiptInfo = latestReceiptInfo.filter(
//       item => item.cancellation_date == null,
//     );
//     console.log(
//       'latest_receipt_info count after removing cancelled subscription =',
//       latestReceiptInfo.length,
//     );

//     if (latestReceiptInfo == null) {
//       setItem(AppConstants.isSubscriptionEnabled, false);
//     } else {
//       const isSubValid = !!latestReceiptInfo.find(receipt => {
//         const expirationInMilliseconds = Number(receipt.expires_date_ms);
//         const nowInMilliseconds = Date.now();
//         return expirationInMilliseconds > nowInMilliseconds;
//       });

//       setItem(AppConstants.isSubscriptionEnabled, isSubValid);
//       return isSubValid;
//     }
//   } else {
//     setItem(AppConstants.isSubscriptionEnabled, false);
//     return false;
//   }
// };

export const getUserRecommendations = async storyID => {
  const response = await axios.post(MLURLS.apiEndpoint, {
    story_id: storyID,
  });
  // .then(function (response) {
  if (response != null) {
    return response.data.similarities;
  } else {
    return false;
  }
};

export const getAllSubscriptions = async () => {
  let dataArray = [];

  let querySnapshot = await firestore()
    .collection(dbConstants.SUBSCRIPTIONS)
    .get();
  querySnapshot.forEach(documentSnapshot => {
    let data = documentSnapshot._data;
    dataArray.push({
      id: documentSnapshot.id,
      data: data,
    });
  });
  return dataArray;
};

export const addSubscription = async (
  productId,
  transactionDateTimeStamp,
  deviceType,
  subscriptionType,
  price,
  transactionReceipt,
) => {
  console.log(
    'in addSubscription function, parameters are ===',
    productId,
    transactionDateTimeStamp,
    deviceType,
    subscriptionType,
    price,
  );
  let userID = await getItem(AppConstants.userID);
  let querySnapshot = await firestore()
    .collection(dbConstants.SUBSCRIPTIONS)
    .get();
  if (querySnapshot._docs.length === 0) {
    let data = await firestore().collection(dbConstants.SUBSCRIPTIONS).add({
      userID: userID,
      productId: productId,
      transactionDateTimeStamp: transactionDateTimeStamp,
      deviceType: deviceType,
      subscriptionType: subscriptionType,
      price: price,
      transactionReceipt: transactionReceipt,
    });
  } else {
    var isFound = false;
    var id = -1;
    querySnapshot.forEach(documentSnapshot => {
      let data = documentSnapshot._data;
      if (data.userID === userID) {
        id = documentSnapshot.id;
        isFound = true;
      }
    });

    if (isFound) {
      await firestore().collection(dbConstants.SUBSCRIPTIONS).doc(id).update({
        userID: userID,
        productId: productId,
        transactionDateTimeStamp: transactionDateTimeStamp,
        deviceType: deviceType,
        subscriptionType: subscriptionType,
        price: price,
        transactionReceipt: transactionReceipt,
      });
    } else {
      await firestore().collection(dbConstants.SUBSCRIPTIONS).add({
        userID: userID,
        productId: productId,
        transactionDateTimeStamp: transactionDateTimeStamp,
        deviceType: deviceType,
        subscriptionType: subscriptionType,
        price: price,
        transactionReceipt: transactionReceipt,
      });
    }
  }
};

export const addDownloadStory = async (
  storyID,
  characterID,
  character_img_url,
  story_title,
  percentageDownload,
  downloadStatus,
  totalPages,
  downloadedPages,
  story,
  narratorList,
  pageList,
  fcm_token,
) => {
  let userID = await getItem(AppConstants.userID);
  let querySnapshot = await firestore().collection(dbConstants.DOWNLOADS).get();
  if (querySnapshot._docs.length === 0) {
    let data = await firestore().collection(dbConstants.DOWNLOADS).add({
      userID: userID,
      storyID: storyID,
      characterID: characterID,
      character_img_url: character_img_url,
      story_title: story_title,
      percentageDownload: percentageDownload,
      downloadStatus: downloadStatus,
      totalPages: totalPages,
      downloadedPages: downloadedPages,
      story: story,
      narratorList: narratorList,
      pageList: pageList,
      fcm_token: fcm_token,
    });
  } else {
    var isFound = false;
    var id = -1;
    querySnapshot.forEach(documentSnapshot => {
      let data = documentSnapshot._data;
      if (
        data.userID === userID &&
        data.storyID === storyID &&
        data.fcm_token === fcm_token
      ) {
        id = documentSnapshot.id;
        isFound = true;
      }
    });

    if (isFound) {
      await firestore().collection(dbConstants.DOWNLOADS).doc(id).update({
        userID: userID,
        storyID: storyID,
        characterID: characterID,
        character_img_url: character_img_url,
        story_title: story_title,
        percentageDownload: percentageDownload,
        downloadStatus: downloadStatus,
        totalPages: totalPages,
        downloadedPages: downloadedPages,
        story: story,
        narratorList: narratorList,
        pageList: pageList,
        fcm_token: fcm_token,
      });
    } else {
      await firestore().collection(dbConstants.DOWNLOADS).add({
        userID: userID,
        storyID: storyID,
        characterID: characterID,
        character_img_url: character_img_url,
        story_title: story_title,
        percentageDownload: percentageDownload,
        downloadStatus: downloadStatus,
        totalPages: totalPages,
        downloadedPages: downloadedPages,
        story: story,
        narratorList: narratorList,
        pageList: pageList,
        fcm_token: fcm_token,
      });
    }
  }
};

export const isStoryDownloaded = async storyID => {
  let userID = await getItem(AppConstants.userID);
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  let querySnapshot = await firestore()
    .collection(dbConstants.DOWNLOADS)
    .where('userID', '==', userID)
    .where('storyID', '==', storyID)
    .where('percentageDownload', '==', 100)
    .where('fcm_token', '==', fcmToken)
    .get();
  if (querySnapshot._docs.length == 0) {
    return false;
  } else {
    return true;
  }
};

export const getInteruptedStories = async () => {
  let userID = await getItem(AppConstants.userID);
  let querySnapshot = await firestore()
    .collection(dbConstants.DOWNLOADS)
    .where('userID', '==', userID)
    .where('percentageDownload', '<', 100)
    .get();
  if (querySnapshot._docs.length == 0) {
    return false;
  } else {
    return true;
  }
};
