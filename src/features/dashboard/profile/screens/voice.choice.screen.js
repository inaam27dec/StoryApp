import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import styled from 'styled-components';
import {Spacer} from '../../../../components/spacer/spacer.component';
import {SafeArea} from '../../../../components/utility/safe-area.component';
import ToggleSelectionComponent from '../../../../components/utility/toggle.selection.component';
import {ToolBar} from '../../../../components/utility/Toolbar';
import {Images} from '../../../../constants/app.constants';
import {
  getUserPreferenceFromDatabase,
  updateUserFemaleVoicePreference,
  updateUserMaleVoicePreference,
} from '../../../../constants/social.helper';
import {MainContainer} from '../../../../infrastructure/theme/global.styles';

const Title = styled(Text)`
  font-size: 16px;
  font-family: ${props => props.theme.fonts.Poppins_Regular};
  font-weight: 500;
  color: #8858ed;
`;

function VoiceChoiceScreen(props) {
  const {navigation} = props;

  const [isMale, setIsMale] = useState(false);
  const [isFemale, setIsFemale] = useState(false);

  useEffect(() => {
    getUserPreferenceFromDatabase().then(data => {
      setIsMale(data.is_male_voice);
      setIsFemale(data.is_female_voice);
    });
  }, []);

  return (
    <SafeArea>
      <ToolBar
        showLeftIcon={true}
        leftIcon={Images.back}
        showRightIcon={false}
        rightIcon={Images.setting}
        heading="Voice choice"
        onLeftPressed={() => {
          navigation.pop();
        }}
        onRightPressed={() => {}}
      />
      <MainContainer
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 30,
          padding: 20,
          alignSelf: 'auto',
        }}>
        <Title style={{alignSelf: 'center'}}>Select Voice</Title>
        <Spacer position="bottom" size="medium" />
        <View style={styles.listContainer}>
          <ToggleSelectionComponent
            title="Grandpa"
            value={isMale}
            onValueChange={value => {
              console.log(value);
              if (isFemale) {
                setIsFemale(false);
                updateUserFemaleVoicePreference(false);
              } else if (value == false && isFemale == false) {
                setIsFemale(true);
                updateUserFemaleVoicePreference(true);
              }
              setIsMale(value);
              updateUserMaleVoicePreference(value);
            }}
          />
          <ToggleSelectionComponent
            title="Grandma"
            value={isFemale}
            onValueChange={value => {
              if (isMale) {
                setIsMale(false);
                updateUserMaleVoicePreference(false);
              } else if (value == false && isMale == false) {
                setIsMale(true);
                updateUserMaleVoicePreference(true);
              }
              setIsFemale(value);
              updateUserFemaleVoicePreference(value);
            }}
          />
        </View>
      </MainContainer>
    </SafeArea>
  );
}

export default VoiceChoiceScreen;

const styles = StyleSheet.create({
  listContainer: {
    height: 100,
    justifyContent: 'space-between',
  },
  item: {
    flex: 1,
    height: 50,
  },
});
