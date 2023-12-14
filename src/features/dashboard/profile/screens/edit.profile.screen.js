import React, {useEffect, useRef, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  Platform,
  KeyboardAvoidingView,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';

import Moment from 'moment';
import {Spacer} from '../../../../components/spacer/spacer.component';
import InputComponent from '../../../../components/utility/input.component';
import PurpleButton from '../../../../components/utility/PurpleButton.component';
import {SafeArea} from '../../../../components/utility/safe-area.component';
import {ToolBar} from '../../../../components/utility/Toolbar';
import {EMAIL_REGEX, Images} from '../../../../constants/app.constants';
import DatePickerComponent from '../../../../components/utility/date.picker.component';
import {colors} from '../../../../infrastructure/theme/colors';
import DOBComponent from '../../../../components/utility/dob.component';
import dbConstants from '../../../../constants/dbConstants';
import {
  updateUserPasswordForFirebaseAuthentication,
  updateUserToDatabase,
} from '../../../../constants/social.helper';
import ImagePicker from 'react-native-image-crop-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import imagePath from '../../../../constants/imagePath';
import {removeSpaces} from '../../../../constants/helper';

function EditProfileScreen(props) {
  const {navigation} = props;
  const {userData} = props.route.params;
  const [name, setName] = useState(
    userData.name === null ? '-' : userData.name,
  );
  const [childName, setChildName] = useState(
    userData.child_name === null ? '-' : userData.child_name,
  );

  const [email, setEmail] = useState(userData.email_address);
  const [password, setPassword] = useState('123456789');
  const [dob, setDOB] = useState(userData.dob);
  const [photoURL, setPhotoURL] = useState(userData.profile_pic);
  const [date, setDate] = useState(
    userData.dob === '' || userData.dob === null || userData.dob === undefined
      ? new Date()
      : new Date(userData.dob + ' UTC'),
  );
  const [passwordEditStatus, setPasswordEditStatus] = useState(false);
  const [nameEditStatus, setNameEditStatus] = useState(true);
  const [childNameEditStatus, setChildNameEditStatus] = useState(true);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const refRBSheet = useRef();

  const toggleModal = () => {
    setIsDatePickerVisible(!isDatePickerVisible);
  };

  const btnActionSave = () => {
    console.log('Hello', childName);
    if (!name || removeSpaces(name) === '') {
      Alert.alert('Readrly', 'Please enter your full name');
      return;
    }
    if (!childName || removeSpaces(childName) === '') {
      Alert.alert('Readrly', 'Please enter your child name');
      return;
    }
    if (!email || removeSpaces(email) === '' || !EMAIL_REGEX.test(email)) {
      Alert.alert('Readrly', 'Please enter your valid email');
      return;
    }
    if (!dob) {
      setDOB('');
    }
    if (!photoURL) {
      setPhotoURL('');
    }
    if (!password || removeSpaces(password) === '') {
      Alert.alert('Readrly', 'Please enter your password');
      return;
    }
    if (password.length < 8) {
      Alert.alert(
        'Readrly',
        'Weak password, minimum 8 and maximum 26 characters is required',
      );
      return;
    }
    if (userData.login_method == dbConstants.SIMPLE) {
      updateUserToDatabase(name, childName, email, password, dob, photoURL);
      if (userData.password != password) {
        updateUserPasswordForFirebaseAuthentication(password);
      }
    } else {
      updateUserToDatabase(
        name,
        childName,
        email,
        userData.password,
        dob,
        photoURL,
      );
    }
    navigation.pop();
  };

  const addSingleImage = () => {
    ImagePicker.openPicker({
      cropping: true,
      width: 300,
      height: 400,
      cropperCircleOverlay: true,
      freeStyleCropEnabled: true,
      avoidEmptySpaceAroundImage: true,
      includeBase64: true,
    })
      .then(image => {
        refRBSheet.current.close();
        console.log({uri: `data:${image.mime};base64,${image.data}`});
        setPhotoURL(`data:${image.mime};base64,${image.data}`);
        console.log(photoURL);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const openCamera = () => {
    ImagePicker.openCamera({
      cropping: true,
      width: 300,
      height: 400,
      cropperCircleOverlay: true,
      freeStyleCropEnabled: true,
      avoidEmptySpaceAroundImage: true,
      includeBase64: true,
    })
      .then(image => {
        refRBSheet.current.close();
        console.log({uri: `data:${image.mime};base64,${image.data}`});
        setPhotoURL(`data:${image.mime};base64,${image.data}`);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const helper = () => {
    if (userData.login_method == dbConstants.SIMPLE) {
      setPassword(userData.password);
      setPasswordEditStatus(true);
      // setNameEditStatus(true);
      // setChildNameEditStatus(true);
    }
  };

  useEffect(() => {
    helper();
  }, []);

  return (
    <SafeArea>
      <ToolBar
        showLeftIcon={true}
        leftIcon={Images.back}
        showRightIcon={false}
        rightIcon={Images.setting}
        heading="Edit Profile"
        onLeftPressed={() => {
          console.log('back tapped');
          navigation.pop();
        }}
        onRightPressed={() => {}}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}>
        <View style={{flex: 1}}>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={styles.photoContainer}>
              <Image
                style={styles.photo}
                source={
                  photoURL === '' || photoURL === null
                    ? imagePath.profilePlaceHolder
                    : {uri: photoURL}
                }
              />
              <TouchableOpacity
                style={styles.cameraStyle}
                onPress={() => refRBSheet.current.open()}>
                <Image
                  source={imagePath.cameraIcon}
                  style={{width: '60%', height: '60%'}}
                />
              </TouchableOpacity>
            </View>
            <RBSheet
              ref={refRBSheet}
              closeOnDragDown={true}
              closeOnPressMask={false}
              animationType="slide"
              customStyles={{
                wrapper: {
                  backgroundColor: 'transparent',
                },
                container: {
                  height: '45%',
                },
                draggableIcon: {
                  backgroundColor: '#000',
                },
              }}>
              <ScrollView>
                <TouchableOpacity
                  style={styles.bottomButtonStyle}
                  onPress={addSingleImage}>
                  <Text style={styles.bottomButtonText}>
                    Add Image from Gallery
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bottomButtonStyle}
                  onPress={openCamera}>
                  <Text style={styles.bottomButtonText}>Open Camera</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bottomButtonStyle}
                  onPress={() => {
                    setPhotoURL('');
                    refRBSheet.current.close();
                  }}>
                  <Text style={styles.bottomButtonText}>Remove</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.bottomButtonStyle}
                  onPress={() => refRBSheet.current.close()}>
                  <Text style={styles.bottomButtonText}>Close</Text>
                </TouchableOpacity>
              </ScrollView>
            </RBSheet>

            <InputComponent
              heading="Name"
              placeholder="Enter name"
              value={name}
              onChangeText={setName}
              editable={nameEditStatus}
            />
            <Spacer position="bottom" size="medium" />
            <InputComponent
              heading="Child Name"
              placeholder="Enter child name"
              value={childName}
              onChangeText={setChildName}
              editable={childNameEditStatus}
            />
            <Spacer position="bottom" size="medium" />
            <InputComponent
              heading="Email Address"
              placeholder="Enter email"
              value={email}
              onChangeText={setEmail}
              editable={false}
            />
            <Spacer position="bottom" size="medium" />
            <InputComponent
              heading="Password"
              isPasswordField={true}
              isSecureTextEntry={true}
              value={password}
              onChangeText={setPassword}
              editable={passwordEditStatus}
            />
            <Spacer position="bottom" size="medium" />
            <DOBComponent
              heading="Date of birth"
              placeholder="Enter dob"
              value={dob}
              onPress={() => {
                toggleModal();
              }}
            />
            <View style={styles.btnContainer}>
              <PurpleButton
                paddingVertical={10}
                paddingHorizontal={55}
                width={350}
                title="Save"
                onPressed={() => {
                  console.log('save button tapped');
                  btnActionSave();
                }}
              />
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
      <View style={styles.centeredView}>
        <DatePickerComponent
          visible={isDatePickerVisible}
          selectedDate={date}
          onDateSelected={date => {
            setDate(date);
            setIsDatePickerVisible(false);
            console.log('inside onDateSelected dob', date, isDatePickerVisible);
            setDOB(Moment(date).format('MMMM DD, yyyy'));
          }}
          onClose={() => {
            toggleModal();
          }}
        />
      </View>
    </SafeArea>
  );
}

export default EditProfileScreen;

const styles = StyleSheet.create({
  container: {
    height: '90%',
  },
  btnContainer: {
    marginTop: 50,
    alignSelf: 'center',
    width: 350,
    height: 50,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: colors.ui.white,
  },
  photoContainer: {
    alignItems: 'center',
    alignSelf: 'center',
    height: 150,
    width: 150,
    marginTop: 30,
    borderWidth: 3,
    borderRadius: 100,
    padding: 5,
    borderColor: '#D9C9F9',
  },
  photo: {
    width: 130,
    height: 130,
    borderRadius: 100,
    overflow: 'hidden',
    borderColor: colors.ui.black,
    margin: 1,
  },
  cameraStyle: {
    height: 40,
    width: 40,
    top: '-10%',
    left: '20%',
    borderRadius: 25,
    backgroundColor: '#c3a4f5',
    justifyContent: 'center',
    opacity: 0.9,
    alignItems: 'center',
  },
  bottomButtonStyle: {
    width: '90%',
    height: '40%',
    backgroundColor: '#CFCFCF',
    margin: 8,
    justifyContent: 'center',
    alignSelf: 'center',
    borderRadius: 10,
  },
  bottomButtonText: {
    fontSize: 18,
    color: 'blue',
    textAlign: 'center',
  },
});
