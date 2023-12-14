/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {SafeArea} from '../../../../components/utility/safe-area.component';
import ToggleSelectionComponent from '../../../../components/utility/toggle.selection.component';
import {ToolBar} from '../../../../components/utility/Toolbar';
import {Images} from '../../../../constants/app.constants';
import {
  getUserPreferenceFromDatabase,
  updateUserHighlightPreference,
} from '../../../../constants/social.helper';
import {MainContainer} from '../../../../infrastructure/theme/global.styles';

function GeneralSettingScreen(props) {
  const {navigation} = props;
  const [isHighlighted, setIsHighlighted] = useState(false);

  const itemTapped = index => {
    switch (index) {
      case 0:
        navigation.navigate('AgeGroupScreen');
        break;
      case 1:
        navigation.navigate('GenresScreen');
        break;
      case 2:
        navigation.push('VoiceChoiceScreen');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    getUserPreferenceFromDatabase().then(data => {
      console.log('Datattattatata', data);
      setIsHighlighted(data.is_highlighting_enabled);
    });
  }, []);
  return (
    <SafeArea>
      <ToolBar
        showLeftIcon={true}
        leftIcon={Images.back}
        showRightIcon={false}
        rightIcon={Images.setting}
        heading="General Settings"
        onLeftPressed={() => {
          console.log('back tapped');
          navigation.pop();
        }}
        onRightPressed={() => {}}
      />
      <MainContainer
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 30,
          padding: 20,
          height: 65,
          justifyContent: 'center',
        }}>
        <View style={styles.listContainer}>
          {/* <TouchableOpacity style={styles.item} onPress={() => itemTapped(0)}>
            <GeneralSettingsComponent title="Age Group" />
          </TouchableOpacity> */}
          {/* <TouchableOpacity style={styles.item} onPress={() => itemTapped(1)}>
            <GeneralSettingsComponent title="Genres" />
          </TouchableOpacity> */}
          {/* <TouchableOpacity style={styles.item} onPress={() => itemTapped(2)}>
            <GeneralSettingsComponent title="Voice Choice" />
          </TouchableOpacity> */}
          <ToggleSelectionComponent
            title="Highlight"
            value={isHighlighted}
            onValueChange={value => {
              setIsHighlighted(value);
              console.log(value);
              updateUserHighlightPreference(value);
            }}
          />
        </View>
      </MainContainer>
    </SafeArea>
  );
}

export default GeneralSettingScreen;

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  item: {
    flex: 1,
    height: 50,
  },
});
