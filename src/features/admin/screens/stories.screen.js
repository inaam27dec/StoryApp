import React, {useCallback, useState} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeArea} from '../../../components/utility/safe-area.component';
import {ToolBar} from '../../../components/utility/Toolbar';
import {MainContainer} from '../../../infrastructure/theme/global.styles';
import {colors} from '../../../infrastructure/theme/colors';
import {fonts} from '../../../infrastructure/theme/fonts';
import {Images} from '../../../constants/app.constants';
import {clearAsyncStorage} from '../../../constants/helper';
import {getStories, removeFCMToken} from '../../../constants/social.helper';
import CustomActivityIndicator from '../../../components/utility/activity.indicator.component';
import {useFocusEffect} from '@react-navigation/native';
import {firebase} from '@react-native-firebase/auth';
import {openAudioPlayer} from '../../../utils/router_service';

function StoriesScreen({navigation, route}) {
  const [selection, setSelection] = useState(-1);
  const [lisData, setListData] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setSelection(-1);
      setLoading(true);
      getStories()
        .then(data => {
          setLoading(false);
          let pendingStories = data.filter(
            item => item.data.status === 'pending',
          );
          setListData(pendingStories);
        })
        .then(data => {});
    }, []),
  );

  return (
    <SafeArea>
      <ToolBar
        showLeftIcon={false}
        leftIcon={Images.back}
        showRightIcon={true}
        isText={true}
        text="Logout"
        fontSize={10}
        heading="Pending Stories"
        onLeftPressed={() => {
          navigation.pop();
        }}
        onRightPressed={() => {
          Alert.alert('Logout', 'Are you sure you want to logout?', [
            {
              text: 'Cancel',
              onPress: () => null,
            },
            {
              text: 'OK',
              onPress: async () => {
                setLoading(true);
                let responseFCM = await removeFCMToken();
                console.log('response FCM = ', responseFCM);
                setLoading(false);
                if (responseFCM === 'success') {
                  firebase.auth().signOut();
                  navigation.replace('Auth');
                  await clearAsyncStorage();
                } else {
                  Alert.alert('Readrly', 'Oops! an error occured');
                }
              },
            },
          ]);
        }}
      />
      {loading && <CustomActivityIndicator animate={loading} />}

      <MainContainer style={{flex: 1}}>
        {lisData.length === 0 && (
          <View style={styles.noStoriesContainer}>
            <Text style={styles.noStoriesLbl}>No more pending stories</Text>
          </View>
        )}
        {lisData.length !== 0 && (
          <View style={{margin: 20, marginBottom: 50}}>
            <FlatList
              bounces={false}
              data={lisData}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    style={[
                      styles.btn,
                      selection === index
                        ? {backgroundColor: colors.ui.purple}
                        : null,
                    ]}
                    onPress={async () => {
                      setSelection(index);
                      console.log(item.id);
                      let result = openAudioPlayer(
                        navigation,
                        true,
                        true,
                        item,
                        item.data.character_id,
                        true,
                      );
                      if (result === false) {
                        setSelection(-1);
                      }
                    }}>
                    <Text
                      style={[
                        styles.btnText,
                        selection === index ? {color: colors.ui.white} : null,
                      ]}>
                      {item.data.title}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              keyExtractor={(item, index) => `${index}`}
            />
          </View>
        )}
      </MainContainer>
    </SafeArea>
  );
}

export default StoriesScreen;

const styles = StyleSheet.create({
  noStoriesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noStoriesLbl: {
    textAlign: 'center',
    fontFamily: fonts.Poppins_Regular,
    fontSize: 17,
    color: colors.ui.black,
  },
  btn: {
    borderWidth: 1,
    borderColor: colors.ui.purple,
    borderRadius: 5,
    marginBottom: 10,
  },
  btnText: {
    textAlign: 'center',
    paddingVertical: 10,
    fontSize: 14,
    color: colors.ui.black,
    fontFamily: fonts.Poppins_Regular,
    fontWeight: '500',
  },
});
